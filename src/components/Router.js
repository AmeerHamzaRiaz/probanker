import { createDrawerNavigator, DrawerItems } from "react-navigation";
import {
  StyleSheet,
  Image,
  StatusBar,
  AsyncStorage,
  Alert
} from "react-native";
import React, { Component } from "react";
import {
  Header,
  Container,
  Content,
  Text,
  Body,
  Button,
  Icon
} from "native-base";
import Home from "./Home";
import fire from "../config/fire";

const MAIN_COLOR = "#e74c3c";
const STATUSBAR_COLOR = "#c0392b";

export default class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Username: "Username"
    };
  }

  componentDidMount() {
    const databaseRef = fire.database();
    const uid = fire.auth().currentUser.uid;

    //uploads the jobId and sets it to true then updates the list
    databaseRef
      .ref(`/users/${uid}/name`)
      .once("value")
      .then(snapshot => {
        this.setState({ Username: snapshot.val() });
      })
      .catch(error => {
        console.log(error);
      });
  }
  onLogOutButtonPress = () => {
    fire.auth().signOut();
  };

  render() {
    return (
      <MyApp
        screenProps={{
          Username: this.state.Username,
          onLogOutButtonPress: this.onLogOutButtonPress
        }}
      />
    );
  }
}

const CustomDrawerContentComponent = props => (
  <Container>
    <Header style={styles.drawerHeader}>
      <Body style={styles.container}>
        <Image
          style={styles.drawerImage}
          source={require("../images/riley.jpg")}
        />
        <Text style={styles.drawerText}>{props.screenProps.Username}</Text>
      </Body>
    </Header>

    <Content>
      <StatusBar backgroundColor={STATUSBAR_COLOR} />
      <DrawerItems {...props} />
      <Button
        rounded
        block
        iconLeft
        onPress={() => {
          props.screenProps.onLogOutButtonPress();
        }}
        style={styles.button}
      >
        <Text style={{ color: "white" }}>Log Out</Text>
        <Icon name="log-out" />
      </Button>
    </Content>
  </Container>
);

const MyApp = createDrawerNavigator(
  {
    // For each screen that you can navigate to, create a new entry like this:
    Home: {
      screen: Home
    }
    // History: {
    //   screen: History,
    // }
  },
  {
    initialRouteName: "Home",
    drawerPosition: "left",
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",
    contentOptions: {
      activeTintColor: MAIN_COLOR
    }
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  drawerHeader: {
    height: 180,
    backgroundColor: MAIN_COLOR
  },
  drawerImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
    borderColor: "white",
    paddingBottom: 20
  },
  drawerText: {
    marginTop: 20,
    fontSize: 22,
    color: "white",
    fontWeight: "bold"
  },
  button: {
    marginTop: 20,
    width: 220,
    marginLeft: 18,
    backgroundColor: MAIN_COLOR
  }
});
