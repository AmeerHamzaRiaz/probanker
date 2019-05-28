import base64 from 'react-native-base64';
import { Alert } from 'react-native';

const USERNAME = 'apikey';
const PASSWORD = 'password';
const URL = 'url';
const VERSION = '2019-04-24';
const WORKSPACE_ID = 'id';

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
