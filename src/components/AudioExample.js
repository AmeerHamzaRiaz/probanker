import React, { Component } from "react";
import { StyleSheet, View, Button, Alert, Text, ActivityIndicator } from "react-native";
import { Buffer } from "buffer";
import Permissions from "react-native-permissions";
import Sound from "react-native-sound";
import AudioRecord from "react-native-audio-record";
import RNFetchBlob from 'rn-fetch-blob';

export default class AudioExample extends Component {
  sound = null;
  state = {
    audioFile: "",
    recording: false,
    loaded: false,
    paused: true,
    transcript: "",
    uploading: false
  };

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
    if (!this.state.recording) return;
    console.log("stop record");
    let audioFile = await AudioRecord.stop();
    console.log("audioFile", audioFile);
    this.setState({ audioFile, recording: false });
  };

  uploadAudio = async () => {
    this.setState({ uploading: true });
    console.log("UPLOAD AUDIO");
    RNFetchBlob.fetch('POST', 'http://8c79c203.ngrok.io/proAudio', {
      'Content-Type': 'multipart/form-data',
    }, [
      { name: 'file', filename: 'file.wav', type: 'audio/wav', data: RNFetchBlob.wrap(this.state.audioFile) },
    ]).then((resp) => {
      this.setState({ transcript: resp.data });
     // Alert.alert("res", resp.data);
      this.setState({ uploading: false });
      console.log(resp);
    }).catch((err) => {
      this.setState({ uploading: false });
      //Alert.alert("Something was wrong", err);
      console.error(err);
    });
  }

  load = () => {
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
    const { recording, paused, audioFile, transcript, uploading } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Button onPress={this.start} title="Record" disabled={recording} />
          <Button onPress={this.stop} title="Stop" disabled={!recording} />
          {
            paused ? 
           (<Button onPress={this.play} title="Play" disabled={!audioFile} />)
           : (<Button onPress={this.pause} title="Pause" disabled={!audioFile} />)
           }
          <Button onPress={this.uploadAudio} title="Upload" disabled={!audioFile} />
        </View>
        <View style={{ flexDirection: "column", marginTop: 80, justifyContent: "center" }}>
          <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 'bold' }} >{transcript}</Text>
          {
            uploading && <ActivityIndicator size="large" color="#0000ff" />
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  }
});
