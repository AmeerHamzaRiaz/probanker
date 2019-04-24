import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  StatusBar,
  ImageBackground,
  Keyboard,
  Alert,
  Image
} from 'react-native';
import { Spinner, Button, Item, Input, Icon } from 'native-base';

const MAIN_COLOR = '#e74c3c';
const STATUSBAR_COLOR = '#c0392b';

export default class Login extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false
    };
  }

  onButtonPress() {
    Keyboard.dismiss();
    // get email and password
    const { email, password } = this.state;
    //first check inputs then set
    this.setState({ loading: true });

    if (
      !this.validateEmail(email) ||
      email.length === 0 ||
      password.length < 5
    ) {
      //If login Credentials are wrong
      Alert.alert(
        'Missing or Invalid Fields',
        'Enter valid email and password'
      );
      this.setState({ loading: false });
    } else {
      // else if Login Credentials are right
      setTimeout(() => {
        this.setState({ loading: false });
        this.props.changeLoginStatus();
      }, 10000);
    }
  }

  validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="large" color={MAIN_COLOR} />;
    }
    return (
      <Button
        rounded
        block
        iconLeft
        onPress={this.onButtonPress.bind(this)}
        style={styles.button}
      >
        <Text style={{ color: 'white' }}>Login</Text>
        <Icon name="log-in" />
      </Button>
    );
  }

  render() {
    return (
      <ImageBackground source={require('../images/bg.jpg')} style={styles.bg}>
        <StatusBar backgroundColor={STATUSBAR_COLOR} />
        <View style={styles.overlay} />
        <Image
          style={styles.logoImage}
          source={require('../images/logo.png')}
        />
        <Text style={styles.logo}>ProBanker</Text>
        <Text style={styles.subtitle}>Making your life easier!</Text>

        <KeyboardAvoidingView
          behavior="padding"
          style={{ alignItems: 'center' }}
        >
          <Item
            rounded
            style={{
              width: 250,
              marginTop: 10,
              backgroundColor: 'rgba(0,0,0,0.4)'
            }}
          >
            <Icon active name="at" style={{ color: MAIN_COLOR }} />
            <Input
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.7)"
              autoCorrect={false}
              keyboardType="email-address"
              style={{ color: '#fff' }}
            />
          </Item>
          <Item
            rounded
            style={{
              marginTop: 10,
              width: 250,
              backgroundColor: 'rgba(0,0,0,0.4)'
            }}
          >
            <Icon active name="key" style={{ color: MAIN_COLOR }} />
            <Input
              onChangeText={pass => this.setState({ password: pass })}
              value={this.state.password}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              autoCorrect={false}
              keyboardType="default"
              style={{ color: '#fff' }}
              secureTextEntry
            />
          </Item>
          {this.renderButton()}
        </KeyboardAvoidingView>
        <Text
          onPress={() => this.props.navigation.navigate('SignUp')}
          style={styles.signup}
        >
          Don't have account? Sign Up
        </Text>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.7
  },
  bg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImage: {
    width: 100,
    height: 100,
    marginTop: 10
  },
  logo: {
    fontSize: 52,
    textAlign: 'center',
    color: MAIN_COLOR,
    fontFamily: 'Lobster-Regular'
  },
  subtitle: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 40,
    fontSize: 18
  },
  signup: {
    textAlign: 'center',
    color: 'white',
    marginTop: 20,
    fontSize: 16
  },
  signupBlue: {
    textAlign: 'center',
    color: MAIN_COLOR,
    marginTop: 20,
    fontSize: 16
  },
  button: {
    marginTop: 20,
    width: 250,
    backgroundColor: MAIN_COLOR
  }
});
