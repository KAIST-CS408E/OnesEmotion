import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Icons from "./../../assets/Icons";
import ChatRoom from "../ChatRoom";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import { withNavigation, DrawerActions } from "react-navigation";

import fb from "../../utils/firebaseWrapper";

const sampleDialog = [
  { speaker: "bot", text: "오늘 무슨 일 있었어?" },
  { speaker: "user", text: "나 오늘 너무 바빠서 밥을 못먹었어.." },
  { speaker: "bot", text: "말해줘서 고마워!" },
  {
    speaker: "bot",
    text: "혹시 그 상황에서 어떤 감정을 느꼈어? 아래 보기에서 골라줘."
  },
  { speaker: "userIcon", text: "anger_option_clicked" },
  { speaker: "bot", text: "너가 느낀 감정은 화남(이)구나. 혹시 이유가 뭐야?" },
  { speaker: "user", text: "그냥 내 자신한테 답답해서 화가 났어.." },
  { speaker: "bot", text: "그렇구나. 다른 감정을 느낀게 있다면 뭐가 있을까?" },
  { speaker: "bot", text: "마찬가지로 아래 보기에서 골라줘." },
  { speaker: "userIcon", text: "sadness_option_clicked" },
  { speaker: "bot", text: "슬픔도 느꼈구나. 슬픔(을)를 느낀 이유는 뭐야?" },
  {
    speaker: "user",
    text: "갑자기 이렇게 바쁘게 살아야하는지 회의감이 좀 들었던 것 같아..."
  },
  { speaker: "bot", text: "답해줘서 고마워." },
  {
    speaker: "bot",
    text: "만약 지금 그 감정으로 인한 문제가 있다면 어떤게 있을까?"
  },
  {
    speaker: "user",
    text: "스스로한테 좀 답답한거? 자책하는건 아닌데 그냥 힘들더라고.."
  },
  { speaker: "bot", text: "잘 들었어!" },
  { speaker: "bot", text: "지금까지 말해준 것들을 다른사람들과 공유해도 될까?" }
];

class MyChat extends React.Component {
  state = {
    chatId: null,
    chatLog: []
  }

  componentDidMount() {
    this.getChatLogs();
  }

  getChatLogs = async () => {
    const chatId = this.props.navigation.getParam('chatId')
    const {messages, state} = await fb.getAChat(chatId)
    this.setState({
      chatId,
      chatLog: messages.map((m) => {
        if (m.userId == "bot") {
          return {
            speaker: "bot", text: m.content
          }
        }
        if (m.content.indexOf('clicked') != -1) {
          return {
            speaker: "userIcon", text: m.content
          }
        }
        return {
          speaker: "user", text: m.content
        }
      }),
      state
    })
  }

  render() {
    // const chatLog = sampleDialog;
    const {chatLog, chatId, state} = this.state;
    const navigation = this.props.navigation;

    return (
      <View style={styles.container}>
        <ChatRoom
          done={true}
          chatLog={chatLog}
          chatId={chatId}
          state={state}
          isCrowdBox={true}
          isStartTop={true}
          navigation={navigation}
          myChat={true}
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
    height: 24
  }
});
