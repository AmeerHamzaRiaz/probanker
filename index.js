/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import AudioExample from './src/components/AudioExample';

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
