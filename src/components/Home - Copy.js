import React, { Component } from "react";
import { Alert } from "react-native";
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
import { Buffer } from 'buffer';
import Permissions from 'react-native-permissions';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import Chat from "../components/Chat";

const MAIN_COLOR = "#e74c3c";

export default class Home extends Component {
  sound = null;
  constructor(props) {
    super(props);
    this.state = {
      audioFile: '',
      recording: false,
      loaded: false,
      paused: true
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: "Home",
    drawerLabel: "Home",
    drawerIcon: ({ tintColor }) => (
      <Icon name="home" style={{ color: tintColor, fontSize: 22 }} />
    )
  });

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
      // do something with audio chunk
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

  stop = async () => {
    console.log("stop");
    if (!this.state.recording) return;
    console.log("stop record");
    let audioFile = await AudioRecord.stop();
    console.log("audioFile", audioFile);
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

          <Body>
            <Title style={{ color: "white" }}>Home</Title>
          </Body>

          <Right>
          <Button transparent onPress={() => this.stop()} disabled={!this.state.recording} >
              <Icon name="pause" style={{ color: 'white' }} />
            </Button>
            <Button transparent onPress={() => this.play()} disabled={!this.state.audioFile}>
              <Icon name="play" style={{ color: 'white' }} />
            </Button>
            <Button transparent onPress={() => this.start()} disabled={this.state.recording}>
              <Icon name="mic" style={{ color: "white" }} />
            </Button>
          </Right>
        </Header>
        <Chat />
      </Container>
    );
  }
}
