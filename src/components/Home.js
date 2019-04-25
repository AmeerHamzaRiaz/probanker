import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import {
  Icon,
  Container,
  Header,
  Button,
  Left,
  Right,
  Body,
  Title
} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import fire from 'firebase';

const BLUE_STATUS = '#c0392b';
const MAIN_COLOR = '#e74c3c';

export default class Home extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Home',
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => (
      <Icon name="home" style={{ color: tintColor, fontSize: 22 }} />
    )
  });

  onButtonPress = () => {
    fire.auth().signOut();
  }

  launchCamera = () => {
    const options = {
      title: 'Capture Image',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({ avatarSource: source });
      }
    });
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
              <Icon name="menu" style={{ color: 'white' }} />
            </Button>
          </Left>

          <Body>
            <Title style={{ color: 'white' }}>Home</Title>
          </Body>

          <Right>
            <Button transparent onPress={() => Alert.alert('Action Performed')}>
              <Icon name="search" style={{ color: 'white' }} />
            </Button>
            <Button transparent onPress={() => this.launchCamera()}>
              <Icon name="camera" style={{ color: 'white' }} />
            </Button>
          </Right>
        </Header>
       
        <Button
        rounded
        block
        iconLeft
         onPress={() => this.onButtonPress()} //Big Problem here <---------- Need to pass this as a screenProp
       // style={styles.button}
        />
      </Container>
    );
  }
}
