import React from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import DrawerNav from './DrawerNav';
import fb from './utils/firebaseWrapper';

const myLog = true; //true for MyLog and false for Story
const story = false;
const sampleDialog = [
  {
    speaker: "bot",
    text: "Hey, what happened today?"
  },
  {
    speaker: "user",
    text: "I fought with my friend..."
  },
  {
    speaker: "bot",
    text: "Oh i see, how do you feel now?"
  },
  {
    speaker: "userIcon",
    text: "disgust_option_clicked"
  },
  {
    speaker: "user",
    text: "Actually.. i'm just upset.. and felt like i couldn't do anything."
  },
  {
    speaker: "bot",
    text: "Is there another emotion you felt?"
  },
  {
    speaker: "user",
    text:
      "May be disappointment? I don't know.. I don't want to do anything now.."
  },
  {
    speaker: "bot",
    text: "Thanks for telling me."
  },
  {
    speaker: "user",
    text: "No problem"
  },
  {
    speaker: "bot",
    text: "Can I ask others with your situation for feedback?"
  }
];
// chatLog={sampleDialog}

export default class App extends React.Component {
  constructor() {
    super();
  }
  
  // componentDidMount() {
  //    StatusBar.setHidden(true);
  // }

  render() {
    return (
      <DrawerNav />
    );
  }
}