import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Icons from "./../../assets/Icons";
import ChatRoom from "../ChatRoom";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import { withNavigation, DrawerActions } from 'react-navigation';

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

class MyChat extends React.Component {
  render() {
    const chatLog = sampleDialog
    const navigation = this.props.navigation;

    return (
      <View style={styles.container}>
        <ChatRoom 
          chatLog={chatLog}
          isCrowdBox={true}
          isStartTop={true}
          navigation={navigation}
        />
      </View>
    );
  }
}

export default withNavigation(MyChat);

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    width: 24,
    height: 24,
  }
});