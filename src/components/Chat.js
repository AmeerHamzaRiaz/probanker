import React, { Component } from "react";
import { Alert } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import Tts from "react-native-tts";
import fire from "../config/fire";
import { MessageRequest } from "../config/Assistant";

const MAIN_COLOR = "#e74c3c";
const databaseRef = fire.database();

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      Username: "", //  NEED TO
      balance: null, //  ASSIGN THESE FROM
      uid: null, //  FIREBASE
      conversationID: null,
      context: null
    };
  }

  componentDidMount() {
    //connect to firebase and fetch name, balance, uid
    const uid = fire.auth().currentUser.uid;
    console.log(`uid ${uid}`);
    databaseRef
      .ref(`/users/${uid}`)
      .once("value")
      .then(snapshot => {
        console.log(snapshot.val());
        this.setState(
          {
            Username: snapshot.val().name,
            balance: snapshot.val().accountBalance,
            uid
          },
          () => {
            this.initalMessage();
          }
        );
      })
      .catch(error => {
        console.log("in catch");
        Alert.alert("Firebase Error");
      });
  }

  onSend = (message = []) => {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }),
      () => {
        this.getMessage(message[0].text.replace(/[\n\r]+/g, " "));
      }
    );
  };

  getMessage = async text => {
    try {
      const response = await MessageRequest(text, this.state.context);
      console.log(response);
      let txt = response.output.text.join(" ");
      if (txt == "Apka account balance he  rupay.") {
        console.log("equals");
        txt = txt.replace(" rupay", `${this.state.balance} rupay`);
      }
      Tts.speak(txt);
      this.setState({ context: response.context });
      const message = {
        _id: Math.round(Math.random() * 1000000).toString(),
        text: txt,
        createdAt: new Date(),
        user: { _id: "2" }
      };
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }));
    } catch (error) {
      Alert.alert("Check your internet");
    }
  };

  initalMessage = async () => {
    try {
      const response = await MessageRequest("");
      console.log(response);
      // if (response === undefined) {
        this.setState({ context: response.context });
        let txt = response.output.text.join(" ");
        txt = txt.replace("Mr.   ", `Mr. ${this.state.Username}`);
        Tts.speak(txt);
        const message = {
          _id: Math.round(Math.random() * 1000000).toString(),
          text: txt,
          createdAt: new Date(),
          user: { _id: "2" }
        };
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message)
        }));
      // } else {
        // Alert.alert(
        //   "Cannot connect to IBM WATSON",
        //   "Check your internet connection"
        // );
      // }
    } catch (error) {
      Alert.alert("Check your internet and try again");
    }
  };

  readText = async txt => {
    Tts.getInitStatus().then(() => {
      Tts.stop();
      Tts.speak(txt);
    });
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: MAIN_COLOR
          }
        }}
      />
    );
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        renderBubble={this.renderBubble}
        user={{ _id: 1 }}
        renderAvatar={null}
      />
    );
  }
}
