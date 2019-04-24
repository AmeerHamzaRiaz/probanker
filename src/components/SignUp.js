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
  TouchableOpacity,
  Image
} from 'react-native';
import { Spinner, Button, Item, Input, Icon, Badge } from 'native-base';
import ImagePicker from 'react-native-image-picker';

const MAIN_COLOR = '#e74c3c';
const STATUSBAR_COLOR = '#c0392b';

export default class SignUp extends Component {
  static navigationOptions = {
    title: 'Register',
    headerStyle: {
      backgroundColor: MAIN_COLOR,
    },
    headerTintColor: '#fff',
  }

  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      name: '',
      email: '',
      password: '',
      repassword: '',
      loading: false
    };
  }

  onButtonPress() {
    Keyboard.dismiss();
    // get email and password
    const { name, email, password, repassword } = this.state;
    //first check inputs then set
    this.setState({ loading: true });
    if (name.length === 0 || password !== repassword || !this.validateEmail(email) || email.length === 0 || password.length < 5) {
       Alert.alert('Missing or Invalid Fields', 'Enter valid information then retry');
       this.setState({ loading: false });
    }
    // Alert.alert(email, password);
  }

  onImagePress = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { uri: response.uri };
    
        // You can also display the image using data:
        const source = { uri: `data:image/jpeg;base64,${response.data}` };
    
        this.setState({
          avatar: source,
        });
      }
    });
  }

  validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size='large' color={MAIN_COLOR} />;
    }
    return (
      <Button
        rounded
        block
        iconLeft
        onPress={this.onButtonPress.bind(this)}
        style={styles.button}
      >
        <Text style={{ color: 'white' }}>Sign Up</Text>
        <Icon name="log-in" />
      </Button>
    );
  }

  render() {
    return (
      <ImageBackground
        source={require('../images/bg.jpg')}
        style={styles.bg}
      >
        <StatusBar backgroundColor={STATUSBAR_COLOR} />
        <View
          style={styles.overlay}
        />
          <TouchableOpacity onPress={this.onImagePress}>
          {
            this.state.avatar === '' ? <Image circle style={{ borderRadius: 50, width: 100, height: 100 }} source={require('../images/riley.jpg')} /> :
            this.state.avatar !== '' && <Image circle style={{ borderRadius: 50, width: 100, height: 100 }} source={this.state.avatar} />
          }
          <Badge style={{ position: 'absolute', backgroundColor: 'rgba(41, 128, 185,0.8)' }}>
            <Icon name="add" style={{ fontSize: 20, color: '#fff', lineHeight: 25 }}/>
          </Badge>
          </TouchableOpacity>
        {/* <Image style={styles.logoImage} source={require('../images/lens.png')} /> */}
        {/* <Text style={styles.logo}>Snapppy</Text> */}
        {/* <Text style={styles.subtitle}>Capture your life!</Text> */}

        <KeyboardAvoidingView
          behavior="padding"
          style={{ alignItems: 'center' }}
        >
          <Item
            rounded
            style={styles.item}
          >
            <Icon active name="person" style={{ color: MAIN_COLOR }} />
            <Input
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
              placeholder="Full Name"
              placeholderTextColor="rgba(255,255,255,0.7)"
              autoCorrect={false}
              keyboardType="default"
              style={{ color: '#fff' }}
            />
          </Item>
          <Item
            rounded
            style={styles.item}
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
            style={styles.item}
          >
            <Icon active name="key" style={{ color: MAIN_COLOR }} />
            <Input
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              autoCorrect={false}
              keyboardType="default"
              style={{ color: '#fff' }}
              secureTextEntry
              error={this.state.password !== this.state.repassword}
            />
          </Item>
          <Item
            rounded
            style={styles.item}
            error={this.state.password !== this.state.repassword}
          >
            <Icon active name="key" style={{ color: MAIN_COLOR }} />
            <Input
              onChangeText={repassword => this.setState({ repassword })}
              value={this.state.repassword}
              placeholder="Confirm Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              autoCorrect={false}
              keyboardType="default"
              style={{ color: '#fff' }}
              secureTextEntry
            />
          </Item>
          {this.renderButton()}
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    marginTop: 10,
    width: 250,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column'
  },
  logoImage: {
    width: 100,
    height: 100,
    marginTop: 20
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
    marginBottom: 80,
    fontSize: 16
  },
  button: {
    marginTop: 20,
    width: 250,
    backgroundColor: MAIN_COLOR
  }
});
