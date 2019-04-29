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
import ImagePicker from "react-native-image-picker";
import Chat from "../components/Chat";

const MAIN_COLOR = "#e74c3c";

export default class Home extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Home",
    drawerLabel: "Home",
    drawerIcon: ({ tintColor }) => (
      <Icon name="home" style={{ color: tintColor, fontSize: 22 }} />
    )
  });

  launchMicRecorder = () => {
    Alert.alert("Open Sesame");
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
            {/* <Button transparent onPress={() => Alert.alert('Action Performed')}>
              <Icon name="search" style={{ color: 'white' }} />
            </Button> */}
            <Button transparent onPress={() => this.launchMicRecorder()}>
              <Icon name="mic" style={{ color: "white" }} />
            </Button>
          </Right>
        </Header>
        <Chat />
      </Container>
    );
  }
}
