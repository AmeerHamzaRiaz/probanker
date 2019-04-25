import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
} from "react-native";
import { Spinner } from "native-base";

const MAIN_COLOR = "#e74c3c";
const STATUSBAR_COLOR = "#c0392b";

export default class Login extends Component {
  render() {
    return (
      <ImageBackground source={require("../images/bg.jpg")} style={styles.bg}>
        <StatusBar backgroundColor={STATUSBAR_COLOR} />
        <View style={styles.overlay} />
        <Spinner size="large" color={MAIN_COLOR} />
        <Text style={styles.subtitle}>Loading</Text>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    opacity: 0.7
  },
  bg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  subtitle: {
    textAlign: "center",
    color: "white",
    fontSize: 20
  }
});
