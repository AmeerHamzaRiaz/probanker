import React, { Component } from "react";
import { Root } from "native-base";
import Login from "./Login";
import Router from "./Router";
import Loading from "./Loading";
import fire from "../config/fire";

export default class App extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: null
    };
  }

  componentDidMount() {
    this.authListener();
  }

  changeLoginStatus = () => {
    this.setState({ isLoggedIn: true });
  };

  authListener() {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ isLoggedIn: true });
      } else {
        this.setState({ isLoggedIn: false });
      }
    });
  }

  renderContent = () => {
    switch (this.state.isLoggedIn) {
      case true:
        return <Router />;
      case false:
        return (
          <Login
            changeLoginStatus={this.changeLoginStatus}
            navigation={this.props.navigation}
          />
        );
      default:
        return <Loading />;
    }
  };
  render() {
    return <Root>{this.renderContent()}</Root>;
  }
}
