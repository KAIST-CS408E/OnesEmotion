import React from "react";
import { StyleSheet, View } from "react-native";
import LogList from "./components/LogList";
import ChatRoom from "./components/ChatRoom";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import nlp from './utils/nlp';

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

export default class App extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {
    nlp.isMeaningful("안녕하세요. 제가 요즘 궁금한 건 장을 보는 일입니다.");
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<LogList myLog={myLog} />*/}
        <ChatRoom/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    alignItems: "center",
    justifyContent: "center"
  }
});
