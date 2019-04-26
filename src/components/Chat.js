import React, { Component } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import fire from '../config/fire';

const MAIN_COLOR = '#e74c3c';
const databaseRef = fire.database();

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      Username: "Ameer",
      uid: "1"
    };
  }

  
  componentDidMount() {
    //  console.log(uid);
    this.setState({
      messages: [
        {
          _id: 1,
          text: `Hello Mr ${this.state.Username}, Men apki kia madad kar sakta hun ?`,
          createdAt: new Date(),
          user: { 
            _id: 2
          }
        },
      ]
    });
  }

  onSend(messages = []) {
    let uid = fire.auth().currentUser.uid;
    let val = Math.floor((Math.random() * 10000) + 1);

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }), () => {
      let newPostRef = databaseRef.ref(`messages/${uid}/`)
      .push();
      databaseRef.ref(`messages/${uid}/${newPostRef.key}`)
      .set({
        _id: val,
        text: messages[0].text,
        createdAt: messages[0].createdAt.toString(),
      });
      console.log(newPostRef.key);
      databaseRef.ref(`messages/${uid}/${newPostRef.key}/user`)
      .set({
        _id: 1
      });
    });
    console.log(messages[0].createdAt);
  }

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
