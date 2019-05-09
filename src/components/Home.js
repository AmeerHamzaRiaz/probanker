import React, { Component } from "react";
import { Alert, StyleSheet } from "react-native";
import {
  Icon,
  Container,
  Header,
  Button,
  Left,
  Right,
  Body,
  Title
} from "native-base";
import { Buffer } from "buffer";
import Permissions from "react-native-permissions";
import Sound from "react-native-sound";
import AudioRecord from "react-native-audio-record";
import Chat from "../components/Chat";
import RNFetchBlob from 'rn-fetch-blob';

const MAIN_COLOR = "#e74c3c";

export default class Home extends Component {
  sound = null;
  static navigationOptions = ({ navigation }) => ({
    title: "Home",
    drawerLabel: "Home",
    drawerIcon: ({ tintColor }) => (
      <Icon name="home" style={{ color: tintColor, fontSize: 22 }} />
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      audioFile: "",
      recording: false,
      loaded: false,
      paused: true,
      isUploading: false,
      trans : ""
    };
  }

  async componentDidMount() {
    await this.checkPermission();

    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: "test.wav"
    };

    AudioRecord.init(options);

    AudioRecord.on("data", data => {
      const chunk = Buffer.from(data, "base64");
      console.log("chunk size", chunk.byteLength);
    });
  }

  checkPermission = async () => {
    const p = await Permissions.check("microphone");
    console.log("permission check", p);
    if (p === "authorized") return;
    return this.requestPermission();
  };

  requestPermission = async () => {
    const p = await Permissions.request("microphone");
    console.log("permission request", p);
  };

  start = () => {
    console.log("start record");
    this.setState({ audioFile: "", recording: true, loaded: false });
    AudioRecord.start();
  };

  uploadAudio = async () => {
    this.setState({ isUploading: true });
    RNFetchBlob.fetch('POST', 'http://8c79c203.ngrok.io/proAudio', {
      'Content-Type': 'multipart/form-data',
    }, [
      { name: 'file', filename: 'file.wav', type: 'audio/wav', data: RNFetchBlob.wrap(this.state.audioFile) },
    ]).then((resp) => {
      // Alert.alert(resp.data);
      let resultTrans = resp.data.replace(/["]+/g, '')
      this.setState({ isUploading: false, trans: resultTrans });
      console.log(resp);
    }).catch((err) => {
      this.setState({ isUploading: false });
      //Alert.alert("Something was wrong", err);
      console.error(err);
    });
  };

  stop = async () => {
    console.log("stop");
    if (!this.state.recording) return;
    console.log("stop record");
    let audioFile = await AudioRecord.stop();
    console.log("audioFile", audioFile);
    console.log(typeof audioFile);
    this.setState({ audioFile, recording: false });
  };

  load = () => {
    console.log("loaded success");
    return new Promise((resolve, reject) => {
      if (!this.state.audioFile) {
        return reject("file path is empty");
      }

      this.sound = new Sound(this.state.audioFile, "", error => {
        if (error) {
          console.log("failed to load the file", error);
          return reject(error);
        }
        this.setState({ loaded: true });
        return resolve();
      });
    });
  };

  play = async () => {
    console.log("play pressed");
    if (!this.state.loaded) {
      try {
        await this.load();
      } catch (error) {
        console.log(error);
      }
    }

    this.setState({ paused: false });
    Sound.setCategory("Playback");

    this.sound.play(success => {
      if (success) {
        console.log("successfully finished playing");
      } else {
        console.log("playback failed due to audio decoding errors");
      }
      this.setState({ paused: true });
      // this.sound.release();
    });
  };

  pause = () => {
    this.sound.pause();
    this.setState({ paused: true });
  };

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: MAIN_COLOR }}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" style={{ color: "white" }} />
            </Button>
          </Left>

          {/* <Body>
            <Title style={{ color: "white" }}>Home</Title>
          </Body> */}

          <Right>
            <Button
              danger
              onPress={() => this.stop()}
              disabled={!this.state.recording}
              style={styles.playerButton}
            >
              <Icon
                type="FontAwesome"
                android="stop"
                ios="stop"
                style={styles.playerIcon}
              />
            </Button>
            <Button
              danger
              onPress={() => this.play()}
              disabled={!this.state.audioFile}
              style={styles.playerButton}
            >
              <Icon name="play" style={styles.playerIcon} />
            </Button>
            <Button
              danger
              onPress={() => this.start()}
              disabled={this.state.recording}
              style={styles.playerButton}
            >
              <Icon name="mic" style={styles.playerIcon} />
            </Button>
            <Button
              danger
              onPress={() => this.uploadAudio()}
              disabled={this.state.audioFile ===""}
              style={styles.playerButtonEnd}
            >
              <Icon name="send" style={styles.playerIcon} />
            </Button>
          </Right>
        </Header>
        <Chat isUploading={this.state.isUploading} transcript={this.state.trans} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  playerButton: {
    marginRight: 10,
    alignSelf: "flex-end",
    paddingTop: 0,
    paddingBottom: 0,
    height: 40,
    width: 40,
    justifyContent: "center"
  },
  playerButtonEnd: {
    alignSelf: "flex-end",
    paddingTop: 0,
    paddingBottom: 0,
    height: 40,
    width: 40,
    justifyContent: "center"
  },
  playerIcon: {
    color: "white",
    marginLeft: 0,
    marginRight: 0,
    fontSize: 24
  }
});
