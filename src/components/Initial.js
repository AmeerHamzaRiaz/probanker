import React, { Component } from 'react';
import { Root, Spinner } from 'native-base';
import Login from './Login';
import Router from './Router';

export default class App extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }
  changeLoginStatus = () => {
    this.setState({ isLoggedIn: true });
  };

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
        return <Spinner size="large" color="orange" />;
    }
  };
  render() {
    //if logged in return home page else return login page
    //abhi logic ni daali ye
    return <Root>{this.renderContent()}</Root>;
  }
}
