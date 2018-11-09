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
import IconInputFooter from "./../IconInputFooter";
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
import nlp from "./../../utils/nlp";

const botQuestions = {
  q0: [
    "오늘 무슨 일 있었어?",
    "오늘 어떤 일이 있었니?",
    "어떤 일이 오늘 있었니?"
  ],
  q1: [
    // 순서대로임!!!
    "말해줘서 고마워!",
    "혹시 그 상황에서 어떤 감정을 느꼈어? 아래 보기에서 골라줘."
  ],
  q2: ["너가 느낀 감정은 a구나. 혹시 이유가 뭐야?"], // 순서대로임!!! /butPush함수에서 변용!
  q3: [
    "그렇구나. 다른 감정을 느낀게 있다면 뭐가 있을까?",
    "마찬가지로 아래 보기에서 골라줘."
  ], // 순서대로임!!!
  q4: [{ once: "a만 느꼈구나.", twice: "b도 느꼈구나. b를 느낀 이유는 뭐야?" }], //받은 감정을 이용해서 a, b를 채워서 넣어야 함! /butPush함수에서 변용!
  q5: [
    "답해줘서 고마워.",
    "만약 지금 그 감정으로 인한 문제가 있다면 어떤게 있을까?" //q4와 5는 합쳐질 수 있음. /butPush함수에서 변용!
  ],
  q6: [
    "좀 더 자세히 말해줄 수 있을까?",
    "좀 더 구체적으로 말해줄 수 있어?",
    "한번만 다시 자세히 말해줄 수 있을까?",
    "한번만 다시 구체적으로 말해줄 수 있을까?",
    "좀 더 자세히 설명해줄 수 있을까?",
    "좀 더 구체적으로 설명해줄 수 있어?",
    "한번만 다시 자세히 설명해줄 수 있을까?",
    "한번만 다시 구체적으로 설명해줄 수 있을까?"
  ],
  q61: [
    "내용을 입력해 줘야해!",
    "빈 내용이 입력되었네. 다시 입력해줄래?",
    "다시 입력해줘!"
  ],
  q7: [
    "조심스럽지만, 지금 말해준 것들 다른 사람들과 공유해도 될까?",
    "잘 모르고 있는걸 수 있으니까!"
  ],
  q8: [
    // 순서대로임!!!
    "잘 들었어!",
    "지금까지 말해준 것들을 다른사람들과 공유해도 될까?"
  ]
};

class ChatRoom extends Component {
  state = {
    currentDialog: [
      {
        speaker: "bot",
        text: "오늘 무슨 일 있었어?"
      }
    ],
    currentQuestion: "q0", // botPushThisQuestion에서만 수정해야함
    nextQuestion: "q1", // botPushThisQuestion에서만 수정해야함
    listOfEmotion: [],
    isCrowdBox: false,
    isTextInput: true,
    isIconInput: false,
    isFinished: false,
    isOnceAgained: false
  };

  handleTextInput = async (speaker, text, iconInput, isMyLog) => {
    //crowdbox면 this.state.currentDialog를 답변 하나만 있는 상태로 초기화!
    const myLogInput = {
      //when is not MyLog and don't have iconInput
      currentDialog: [
        ...this.state.currentDialog,
        { speaker: speaker, text: text }
      ],
      isCrowdBox: false,
      isTextInput: false,
      isIconInput: false,
      isFinished: false
    };
    const forCrowdBox = {
      //when is not MyLog
      currentDialog: [
        {
          speaker: "user",
          text: text,
          profileImageName: `${iconInput.split("_")[0]}_option_clicked`
        }
      ],
      currentQuestion: null,
      nextQuestion: null,
      listOfEmotion: [],
      isCrowdBox: true,
      isTextInput: false,
      isIconInput: false,
      isFinished: false
    };
    this.setState(isMyLog ? myLogInput : forCrowdBox);
    //check user input here
    let nextQuestionFixed = this.state.nextQuestion;
    !nlp.isNotEmpty(text) ? (nextQuestionFixed = "q61") : null; //모든 답변은 내용이 있어야 함.
    const isTarget =
      !this.state.isOnceAgained && this.state.currentQuestion == "q0";
    const isMeaningful = !isTarget ? true : await nlp.isMeaningful(text);
    isTarget && !isMeaningful ? (nextQuestionFixed = "q6") : null; //q0일 때 불충분한 답변이면 한번만 더 물어봄.
    this.setState({
      isOnceAgained: isTarget ? true : false
    });
    //add bot question here
    this.botPushThisQuestion(nextQuestionFixed);
  };

  handleIconInput = (speaker, iconInput, isMyLog) => {
    // console.log("In ChatRoom handleIconInput iconInput: ", iconInput);
    this.setState({
      currentDialog: [
        ...this.state.currentDialog,
        { speaker: "userIcon", text: iconInput }
      ],
      listOfEmotion: [...this.state.listOfEmotion, iconInput],
      isCrowdBox: false,
      isTextInput: false,
      isIconInput: false,
      isFinished: false
    });
    //add bot question here
    this.botPushThisQuestion(this.state.nextQuestion, [
      ...this.state.listOfEmotion,
      iconInput
    ]);
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

  botPushThisQuestion = (thisQuestion, listOfEmotion = null) => {
    let nextQuestion = [];
    let thisQuestionText = "";
    //nextQuestion을 list형태로 만들고, 보여줘야 하는 답변을 순서대로 list안에 넣어둠!
    if (thisQuestion == "q1") {
      thisQuestionText = botQuestions.q1;
      nextQuestion = "q2";
    }
    if (thisQuestion == "q2") {
      const latestIconInput =
        listOfEmotion[listOfEmotion.length ? listOfEmotion.length - 1 : 0];
      // console.log(
      //   "In ChatRoom botPushThisQuestion if q2 listOfEmotion:",
      //   listOfEmotion
      // );
      const isIconInputNothing =
        listOfEmotion.length != 0 && latestIconInput.includes("nothing");
      // console.log(
      //   "In ChatRoom botPushThisQuestion if q2 latestIconInput:",
      //   latestIconInput
      // );
      thisQuestionText = isIconInputNothing
        ? botQuestions.q7 //인풋이 없으면 q2위치가 q7이 되어야 함.
        : [
            `너가 느낀 감정은 ${this.iconNameToKorean(
              latestIconInput
            )}(이)구나. 혹시 이유가 뭐야?`
            // botQuestions.q2[botQuestions.q2.length - 1]
          ];
      nextQuestion = isIconInputNothing ? "q7" : "q3";
      // console.log(
      //   "In ChatRoom botPushThisQuestion if q2 nextQuestion:",
      //   nextQuestion
      // );
    }
    if (thisQuestion == "q3") {
      thisQuestionText = botQuestions.q3;
      nextQuestion = "q4";
    }
    if (thisQuestion == "q4") {
      const prevIconInput = listOfEmotion[0];
      const latestIconInput =
        listOfEmotion[listOfEmotion.length ? listOfEmotion.length - 1 : 0];
      const isIconInputNothing =
        listOfEmotion.length != 0 && latestIconInput.includes("nothing");
      // console.log(
      //   "In ChatRoom botPushThisQuestion if q4 latestIconInput:",
      //   latestIconInput
      // );
      thisQuestionText = isIconInputNothing
        ? [
            `${this.iconNameToKorean(
              prevIconInput
            )}만 느꼈구나. 답해줘서 고마워.`,
            botQuestions.q5[botQuestions.q5.length - 1]
          ]
        : [
            `${this.iconNameToKorean(
              latestIconInput
            )}도 느꼈구나. ${this.iconNameToKorean(
              latestIconInput
            )}(을)를 느낀 이유는 뭐야?`
          ];
      nextQuestion = isIconInputNothing ? "q8" : "q5";
    }
    if (thisQuestion == "q5") {
      thisQuestionText = botQuestions.q5;
      nextQuestion = "q8";
    }
    if (thisQuestion == "q6") {
      //구체적인 설명을 되물어야 하는 경우
      thisQuestionText = [
        botQuestions.q6[this.getRandomInt(0, botQuestions.q6.length - 1)]
      ];
      nextQuestion = this.state.nextQuestion;
    }
    if (thisQuestion == "q61") {
      //내용이 아얘 없이 스페이스바만 있는 경우
      thisQuestionText = [
        botQuestions.q61[this.getRandomInt(0, botQuestions.q61.length - 1)]
      ];
      nextQuestion = this.state.nextQuestion;
    }
    if (thisQuestion == "q7") {
      thisQuestionText = botQuestions.q7;
      nextQuestion = null;
    }
    if (thisQuestion == "q8") {
      thisQuestionText = botQuestions.q8;
      nextQuestion = null;
    }
    const isFinished = nextQuestion == "q7" || this.state.nextQuestion == "q8";
    const isIconInput =
      !isFinished && (thisQuestion == "q1" || thisQuestion == "q3");
    const isTextInput = !isFinished && !isIconInput;
    // console.log("In ChatRoom botPushThisQuestion isFinished:", isFinished);

    const isAfterCheckingMeaningful = thisQuestion == "q1" && this.state.currentDialog.length<3;
    const firstTimeIntervalFiexd = isAfterCheckingMeaningful ? 0 : 1000
    let timeOffset = 0;
    thisQuestionText.map((text, index) => {
      // console.log(text);
      const isItLastItem = index == thisQuestionText.length - 1;
      setTimeout(() => {
        this.setState({
          currentDialog: [
            ...this.state.currentDialog,
            {
              speaker: "bot",
              text: text
            }
          ],
          currentQuestion: isItLastItem
            ? thisQuestion
            : this.state.currentQuestion, // botPushThisQuestion에서만 수정해야함
          nextQuestion: isItLastItem ? nextQuestion : this.state.nextQuestion, // botPushThisQuestion에서만 수정해야함
          isTextInput: isItLastItem ? isTextInput : this.state.isTextInput,
          isIconInput: isItLastItem ? isIconInput : this.state.isIconInput,
          isFinished: isItLastItem ? isFinished : this.state.isFinished
        });
      }, firstTimeIntervalFiexd + this.getRandomInt(1200, 1850) * timeOffset);
      timeOffset += 1;
    });
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

  // meaningless = async (text) => {
  //   const meaningless = await nlp.meaningless(text);
  //   this.setState({
  //   })
  // }

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
                  isIconOptionBox={false}
                  isMyLog={true}
                />
              ) : null}
              {this.state.isIconInput & !this.state.isFinished ? (
                <IconInputFooter
                  onPress={this.handleIconInput}
                  isMyLog={true}
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
