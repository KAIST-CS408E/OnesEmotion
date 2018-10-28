import React, { Component } from "react";
import {
  View,
  Alert,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import Header from "./../Header";
import TextInputFooter from "./../TextInputFooter";
import ButtonInputFooter from "./../ButtonInputFooter";
import ImageButton from "./../ImageButton";
import ChatElement from "./ChatElement";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Colors from "./../../assets/Colors";
import Icons from "./../../assets/Icons";

const questions = {
  0: "Hey, what happened today?",
  1: "Oh i see, how do you feel now?",
  2: "Is there another emotion you felt?",
  3: "Thanks for telling me.",
  4: "Can I ask others with your situation for feedback?" //botPushThisQuestion 에서 마지막인 인덱스를 꼭 바꿔줘야 마지막 질문과 함꼐 buttoninput 보여줌.
};

class ChatRoom extends Component {
  // Add the Navigation option
  static navigationOptions = {
    title: 'ChatRoom',
  };

  state = {
    currentDialog: [{ speaker: "bot", text: questions[0] }],
    dialogIndex: 1,
    isTextInput: true,
    isFinished: false
  };

  examplePress = () => {
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Ask me later",
          onPress: () => console.log("Ask me later pressed")
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  };

  renderChatRoomHeaderLeft = (navigate) => (
    <ImageButton
      boxWidth={"20"}
      imageWidth={"7"}
      imageName={"save"}
      onPress={
        () => navigate("First", {})
      }
    />
  );

  renderChatRoomHeaderRight = () => (
    <ImageButton
      boxWidth={"20"}
      imageWidth={"5"}
      imageName={"cancel"}
      onPress={this.examplePress}
    />
  );

  getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  botPushThisQuestion = questionIndex => {
    setTimeout(() => {
      //   console.log(
      //     "In ChatRoom, botPushThisQuestion: this.state = ",
      //     this.state
      //   );
      this.setState({
        currentDialog: [
          ...this.state.currentDialog,
          { speaker: "bot", text: questions[questionIndex] }
        ],
        isTextInput: true,
        isFinished: questionIndex == 4 ? true : false
      });
    }, this.getRandomInt(2000, 3000));
  };

  handleTextInput = (speaker, text) => {
    // console.log("In ChatRoom speaker and text:", speaker, text);
    this.setState({
      currentDialog: [
        ...this.state.currentDialog,
        { speaker: speaker, text: text }
      ],
      dialogIndex: this.state.dialogIndex + 1,
      isTextInput: false
    });
    // console.log("In ChatRoom, handleTextInput: this.state = ", this.state);
    this.botPushThisQuestion(this.state.dialogIndex);
  };

  render() {
    const { chatLog } = this.props; //chatLog가 있으면 기존 chatLog에 담긴 대화 내용으로 로그 만들기, 없으면 새로운 채팅창 열기(아직 새 채팅창만 구현됨)
    // console.log("In ChatRoom this.state:", this.state);
    const contentsTopBottomMargin = 8;
    var {navigate} = this.props.navigation; 

    return (
      <View>
        <Header
          title={chatLog ? "ChatLog" : "MyHome"}
          left={this.renderChatRoomHeaderLeft(navigate)}
          right={this.renderChatRoomHeaderRight()}
        />
        <View style={styles.chatRoomContents}>
          <ScrollView
            style={{
              paddingBottom: contentsTopBottomMargin,
              paddingTop: contentsTopBottomMargin
            }}
            ref={ref => (this.scrollView = ref)}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
            }}
          >
            {this.state.currentDialog
              ? this.state.currentDialog.map((dialog, index) => (
                  <ChatElement
                    key={index}
                    speaker={dialog.speaker}
                    text={dialog.text}
                  />
                ))
              : null}
          </ScrollView>
          {this.state.isTextInput & !this.state.isFinished ? (
            <TextInputFooter onPress={this.handleTextInput} />
          ) : null}
          {this.state.isFinished ? <ButtonInputFooter /> : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatRoomContents: {
    flex: 1
  }
});

export default ChatRoom;
