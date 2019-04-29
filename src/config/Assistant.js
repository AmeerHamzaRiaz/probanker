import base64 from 'react-native-base64';
import { Alert } from 'react-native';

const USERNAME = 'apikey';
const PASSWORD = 'MXORuvTctcKP5IbXPySFM0wsE1exIHEvuJbZn2T9NwTh';
const URL = 'https://gateway.watsonplatform.net/assistant/api';
const VERSION = '2019-04-24';
const WORKSPACE_ID = '5be03472-03c4-4a4e-8bd6-c218b5a8f9c3';

// Watson Assistant API documentation:
// https://console.bluemix.net/apidocs/assistant
// eslint-disable-next-line no-undef
MessageRequest = (input, context = {}) => {
  const body = {
    alternate_intents: true,
    input: {
      text: input
    }
  };
  if (context) {
    body.context = context;
  }
  // eslint-disable-next-line no-undef
  return fetch(`${URL}/v1/workspaces/${WORKSPACE_ID}/message?version=${VERSION}`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + base64.encode(USERNAME + ":" + PASSWORD),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    return responseJson;
  })
  .catch((error) => {
    Alert.alert("ERROR", error);
  });
};

module.exports = {
  // eslint-disable-next-line no-undef
  MessageRequest
};
