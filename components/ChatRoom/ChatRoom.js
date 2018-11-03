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

const dialogIndexWithIconOptionBox = new Set([2, 3]); //아이콘옵션박스를 띄워야 할 dialog의 index+1의 값을 적어야 함.
const lastDialogWord = "음 그렇구나..";

class ChatRoom extends Component {
  state = {
    currentDialog: [{ speaker: "bot", text: "오늘 무슨 일 있었어?" }],
    dialogIndex: 1,
    isTextInput: true,
    countOfIconInput: 0,
    isFinished: false,
    isEndingQ: false,
    isCrowdBox: false,
    emotionList: [],
    questions: [
      "오늘 무슨 일 있었어?",
      "말해줘서 고마워. 네가 그 상황에서 어떤 감정을 느꼈는지 말해줄 수 있어? 아래의 보기에서 골라줘!",
      `너가 느낀 감정은 A(이)구나. 혹시 다른 감정도 느꼈어? 그렇다면 아래의 보기에서 골라줘!`,
      "너는 그때 A, B(을)를 느꼈구나. 혹시 그런 감정을 느낀 이유가 있었어?",
      "음 그렇구나.. 혹시 지금 문제가 되는 부분이 있니?" //botPushThisQuestion 에서 마지막인 인덱스를 꼭 바꿔줘야 마지막 질문과 함꼐 buttoninput 보여줌.
    ],
    ending1: [
      "조심스럽지만, 네가 잘 모르는 것일수도 있으니까! 비슷한 상황에서 다른 사람들은 어떤 감정을 느끼는지 물어봐도 될까?"
      // "답변이 모이면 말해줄게! 오늘 대화가 도움이 됐다면 좋겠다. 다음에 봐~"
    ],
    ending2: [
      "지금까지 네가 말해준 상황에 대해서 다른 사람들은 어떤 감정을 느끼는지 물어봐도 될까?"
      // "답변이 모이면 말해줄게! 오늘 대화가 도움이 됐다면 좋겠다. 다음에 봐~"
    ]
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
      console.log(
        "In ChatRoom, botPushThisQuestion: this.state = ",
        this.state,
        questionIndex,
        this.state.questions.length
      );
      this.setState({
        currentDialog: [
          ...this.state.currentDialog,
          { speaker: "bot", text: this.state.questions[questionIndex] }
        ],
        isTextInput: true,
        isFinished: questionIndex == 0 ? true : false
      });
    }, this.getRandomInt(2000, 3000));
  };

  iconNameToKorean = iconName => {
    if (iconName.includes("joy")) return "즐거움";
    if (iconName.includes("trust")) return "신뢰";
    if (iconName.includes("fear")) return "공포";
    if (iconName.includes("surprise")) return "놀라움";
    if (iconName.includes("anticipation")) return "기대";
    if (iconName.includes("anger")) return "분노";
    if (iconName.includes("disgust")) return "혐오";
    if (iconName.includes("sadness")) return "슬픔";
  };

  handleTextInput = (speaker, text, iconInput, isMyLog) => {
    // console.log(
    //   "asdkl;fjasdf;j :",
    //   this.state.currentDialog[this.state.currentDialog.length-1]["text"].includes("음 그렇구나.. 혹시 해결할 수 있는 방법이 있을까?")
    // );
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
              profileImageName: `${iconInput.split("_")[0]}_option_clicked`
            }
          ],
      dialogIndex: isMyLog
        ? (iconInput &&
            iconInput.includes("nothing") &&
            this.state.countOfIconInput == 0) ||
          this.state.currentDialog[this.state.currentDialog.length - 1][
            "text"
          ].includes(lastDialogWord)
          ? 0
          : this.state.dialogIndex + 1
        : this.state.dialogIndex,
      countOfIconInput: iconInput
        ? this.state.countOfIconInput + 1
        : this.state.countOfIconInput,
      isTextInput: false,
      isCrowdBox: !isMyLog,
      emotionList:
        this.state.emotionList.length < 2 && iconInput
          ? this.state.emotionList.concat(iconInput)
          : this.state.emotionList,
      questions:
        (iconInput &&
          iconInput.includes("nothing") &&
          this.state.countOfIconInput == 0) ||
        this.state.currentDialog[this.state.currentDialog.length - 1][
          "text"
        ].includes(lastDialogWord) //첫번째 감정선택에서 '없음'인 경우 ending1으로 넘어감
          ? this.state.currentDialog[this.state.currentDialog.length - 1][
              "text"
            ].includes(lastDialogWord)
            ? this.state.ending2
            : this.state.ending1
          : this.state.emotionList.length == 0 &&
            iconInput &&
            !iconInput.includes("nothing") //아직 emotionList에 반영이 안되어서 emotionList는 length가 0!
            ? [
                "오늘 무슨 일 있었어?",
                "말해줘서 고마워. 네가 그 상황에서 어떤 감정을 느꼈는지 말해줄 수 있어? 아래의 보기에서 골라줘!",
                `너가 느낀 감정은 ${this.iconNameToKorean(
                  iconInput
                )}(이)구나. 혹시 다른 감정도 느꼈어? 그렇다면 아래의 보기에서 골라줘!`,
                `그럼 너는 그때 ${this.iconNameToKorean(
                  iconInput
                )}(을)를 느꼈구나. 혹시 그런 감정을 느낀 이유가 있었어?`,
                "음 그렇구나.. 혹시 지금 문제가 되는 부분이 있니?" //botPushThisQuestion 에서 마지막인 인덱스를 꼭 바꿔줘야 마지막 질문과 함꼐 buttoninput 보여줌.
              ]
            : this.state.emotionList.length == 1 &&
              iconInput &&
              !iconInput.includes("nothing") //아직 emotionList에 반영이 안되어서 emotionList는 length가 1!
              ? [
                  "오늘 무슨 일 있었어?",
                  "말해줘서 고마워. 네가 그 상황에서 어떤 감정을 느꼈는지 말해줄 수 있어? 아래의 보기에서 골라줘!",
                  `너가 느낀 감정은 ${
                    this.iconNameToKorean(this.state.emotionList[0])
                  }(이)구나. 혹시 다른 감정도 느꼈어? 그렇다면 아래의 보기에서 골라줘!`,
                  `너는 그때 ${
                    this.iconNameToKorean(this.state.emotionList[0])
                  }, ${this.iconNameToKorean(
                    iconInput
                  )}(을)를 느꼈구나. 혹시 그런 감정을 느낀 이유가 있었어?`,
                  "음 그렇구나.. 혹시 지금 문제가 되는 부분이 있니?" //botPushThisQuestion 에서 마지막인 인덱스를 꼭 바꿔줘야 마지막 질문과 함꼐 buttoninput 보여줌.
                ]
              : this.state.questions
    });
    // console.log("In ChatRoom, handleTextInput: this.state = ", this.state);
    const dialogIndexFixed = isMyLog
      ? (iconInput &&
          iconInput.includes("nothing") &&
          this.state.countOfIconInput == 0) ||
        this.state.currentDialog[this.state.currentDialog.length - 1][
          "text"
        ].includes(lastDialogWord)
        ? 0
        : this.state.dialogIndex
      : this.state.dialogIndex;
    isMyLog ? this.botPushThisQuestion(dialogIndexFixed) : null;
  };

  render() {
    const { chatLog } = this.props; //chatLog가 있으면 기존 chatLog에 담긴 대화 내용으로 로그 만들기, 없으면 새로운 채팅창 열기(아직 새 채팅창만 구현됨)
    console.log("In ChatRoom this.state:", this.state);
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
                  isIconOptionBox={dialogIndexWithIconOptionBox.has(
                    this.state.dialogIndex
                  )}
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
