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
import CrowdBoxFooter from "./../CrowdBoxFooter";
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
const dialogIndexWithIconOptionBox = 2; //아이콘옵션박스를 띄워야 할 dialog의 index+1의 값을 적어야 함.

class ChatRoom extends Component {
  state = {
    currentDialog: [{ speaker: "bot", text: questions[0] }],
    dialogIndex: 1,
    isTextInput: true,
    isFinished: false,
    isCrowdBox: false
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

  renderChatRoomHeaderLeft = () => (
    <ImageButton
      boxWidth={"20"}
      imageWidth={"7"}
      imageName={"save"}
      onPress={this.examplePress}
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
      // console.log(
      //   "In ChatRoom, botPushThisQuestion: this.state = ",
      //   this.state
      // );
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

  handleTextInput = (speaker, text, iconInput, isMyLog) => {
    // console.log(
    //   "In ChatRoom speaker, text and iconInput:",
    //   speaker,
    //   text,
    //   iconInput
    // );
    this.setState({
      //iconInput은 `${selectedImageName.split("_")[0]}_option_clicked`꼴
      currentDialog: isMyLog
        ? iconInput
          ? [
              ...this.state.currentDialog,
              { speaker: "userIcon", text: iconInput },
              { speaker: speaker, text: text }
            ]
          : [...this.state.currentDialog, { speaker: speaker, text: text }]
        : [
            {
              speaker: "user",
              text: text,
              profileImageName: `${iconInput.split("_")[0]}_crowdBox`
            }
          ],
      dialogIndex: isMyLog
        ? this.state.dialogIndex + 1
        : this.state.dialogIndex,
      isTextInput: false,
      isCrowdBox: !isMyLog
    });
    // console.log("In ChatRoom, handleTextInput: this.state = ", this.state);
    isMyLog ? this.botPushThisQuestion(this.state.dialogIndex) : null;
  };

  render() {
    const { chatLog } = this.props; //chatLog가 있으면 기존 chatLog에 담긴 대화 내용으로 로그 만들기, 없으면 새로운 채팅창 열기(아직 새 채팅창만 구현됨)
    // console.log("In ChatRoom this.state:", this.state);
    const contentsTopBottomMargin = 8;
    const targetDialog = chatLog ? chatLog : this.state.currentDialog;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        style={{ backgroundColor: Colors.chatRoomBackground }}
      >
        <Header
          title={chatLog ? "ChatLog" : "MyHome"}
          left={this.renderChatRoomHeaderLeft()}
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
            {targetDialog.map((dialog, index) => (
              <ChatElement
                key={index}
                speaker={dialog.speaker}
                text={dialog.text}
                profileImageName={dialog.speaker == "bot" ? "bot" : "user"}
              />
            ))}
          </ScrollView>
          {chatLog ? (
            <View>
              {this.state.isCrowdBox ? (
                <CrowdBoxFooter userInputDialog={this.state.currentDialog[0]} />
              ) : (
                <TextInputFooter
                  onPress={this.handleTextInput}
                  isIconOptionBox={true}
                  isMyLog={false}
                />
              )}
            </View>
          ) : (
            <View>
              {this.state.isTextInput & !this.state.isFinished ? (
                <TextInputFooter
                  onPress={this.handleTextInput}
                  isIconOptionBox={
                    this.state.dialogIndex == dialogIndexWithIconOptionBox
                      ? true
                      : false
                  }
                  isMyLog={chatLog ? false : true}
                />
              ) : null}
              {this.state.isFinished ? <ButtonInputFooter /> : null}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  chatRoomContents: {
    flex: 1
  }
});

export default ChatRoom;
