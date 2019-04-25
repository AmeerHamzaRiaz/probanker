import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCexOuHpdkYJc8lzdbKH3mn9iEQXJqrr24",
  authDomain: "probanker-c161b.firebaseapp.com",
  databaseURL: "https://probanker-c161b.firebaseio.com",
  projectId: "probanker-c161b",
  storageBucket: "probanker-c161b.appspot.com",
  messagingSenderId: "425787365041"
};
const fire = firebase.initializeApp(config);

export default fire;
