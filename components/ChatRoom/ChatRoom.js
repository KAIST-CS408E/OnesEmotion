import React, { Component } from "react";
import {
  View,
  Alert,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  DeviceEventEmitter,
  Keyboard,
  Dimensions,
  ImageBackground
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
import Images from "./../../assets/Images";
import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerActions
} from "react-navigation";

import fb from "../../utils/firebaseWrapper";
import nlp from "./../../utils/nlp";
import NoticeBox from "../NoticeBox";
import { StackActions } from "react-navigation";
import getBackgroundImageName from "../../assets/Images/getBackgroundImageName";

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
  q4a: ["음 내가 생각하기엔 너가 느끼는 감정은 c인 것 같아.", "어떻게 생각해?"], //분석한 감정을 이용해서 c를 채워서 넣어야 함! /butPush함수에서 변용!
  q5: [
    "답해줘서 고마워.",
    "만약 지금 그 감정으로 인한 문제가 있다면 어떤게 있을까?" //q4와 5는 합쳐질 수 있음. /butPush함수에서 변용!
  ],
  q6: [
    "음.. 상황 설명이 좀 더 구체적이면 좋을 것 같아.",
    "음.. 상황 설명이 좀 더 자세하면 좋을 것 같아.",
    "그렇구나. 상황 설명이 좀 더 구체적이면 좋을 것 같아.",
    "그렇구나. 조금더 자세한 설명이 있으면 좋을 것 같아."
  ],
  q61: [
    "내용을 입력해 줘야해!",
    "빈 내용이 입력되었네. 다시 입력해줄래?",
    "다시 입력해줘!"
  ],
  q7: [
    // 순서대로임!!!
    "그렇구나.",
    "조심스럽지만, 너가 동의한다면 지금 말해준 상황을 다른 사람들과 공유해도 될까?",
    "그들의 입장에서 너의 상황에 어떤 감정을 느꼈는지 물어보자!"
  ],
  q8: [
    // 순서대로임!!!
    "잘 들었어!",
    "다른 사람들과 지금 이 내용을 공유한다면 너가 느낀 감정이 상황에 적합한지 알 수 있을거야.",
    "너가 동의해준다면 그들에게 물어볼게, 어떻게 생각해?"
  ],
  q9: [
    "좋아. 좋은 답변들이 모아지면 알려줄게!",
    "지금 대화는 메뉴의 '내 이야기'와 '다른 사람들의 이야기'에서 확인할 수 있어."
  ],
  q10: ["알겠어!", "지금 대화는 메뉴의 '내 이야기 보기'에서 확인할 수 있어."]
};

const myChatNotice = [
  "새 이야기 시작하기",
  "챗봇에게 내 이야기를 할 수 있습니다.",
  "오늘 느낀 상황과 감정을 솔직하게 말해주세요!",
  "대화 기록은 다른 사람들과 공유할 수 있습니다.",
  " 왼쪽 : [저장], 오른쪽 : [나가기]"
];
const otherChatNotice = [
  "다른 사람의 이야기",
  "사람들은 각자 느끼는 감정을 이야기합니다.",
  "비난과 비판은 삼가고",
  "내가 느낀 것을 친절히 말해주세요",
  "따뜻한 댓글은 그들에게 힘이 될 수 있습니다."
];
const myLogNotice = [
  "나의 이야기",
  "내가 썼던 글에 남겨진",
  "사람들의 댓글을 볼 수 있습니다.",
  "도움이 되는 댓글에는",
  "[고마워요] 버튼을 눌러보세요."
];

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
    isButtonInput: false,
    buttonInputAns: "",
    isFinished: false,
    isOnceAgained: false,
    visibleHeight: hp("100%"),
    // get user info
    user: fb.getUser(),
    chatId: null,
    backgroundImageName: "",
    firstQuestion: null,
    crowdBoxDialog: [],
    isAlreadyCommentedWithThisUser: false,
  };

  componentWillMount() {
    const backgroundImageName = this.props.navigation.getParam(
      "backgroundImageName"
    );
    if (backgroundImageName) {
      this.setState({ backgroundImageName });
    }
    try {
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        this.keyboardDidShow.bind(this)
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        this.keyboardDidHide.bind(this)
      );
    } catch (e) {
      this.keyboardDidShowListener = DeviceEventEmitter.addListener(
        "keyboardDidShow",
        this.keyboardDidShow.bind(this)
      );
      this.keyboardDidHideListener = DeviceEventEmitter.addListener(
        "keyboardDidHide",
        this.keyboardDidHide.bind(this)
      );
    }
    const {done} = this.props;
    if (done) {
      return
    }
    this.createChatRoom();
  }

  componentWillReceiveProps(nextProps) {
    const {chatId, state, chatLog} = nextProps;
    this.getCommentList(chatId)
    const isBoolean = (value) => {
      if (value === true || value === false) {
        return true
      }
      return null
    }
    if (!state) {
      this.setState({chatId, currentDialog: chatLog ? chatLog : this.state.currentDialog})
      return
    }
    this.setState({
      chatId,
      currentDialog: chatLog ? chatLog : this.state.currentDialog,
      currentQuestion: state.currentQuestion || this.state.currentQuestion,
      nextQuestion: state.nextQuestion || this.state.nextQuestion,
      listOfEmotion: state.listOfEmotion || this.state.listOfEmotion,
      isCrowdBox: isBoolean(state.isCrowdBox) ? state.isCrowdBox : this.state.isCrowdBox,
      isTextInput: isBoolean(state.isTextInput) ? state.isTextInput : this.state.isTextInput,
      isIconInput: isBoolean(state.isIconInput) ? state.isIconInput : this.state.isIconInput,
      isFinished: isBoolean(state.isFinished) ? state.isFinished : this.state.isFinished,
      isOnceAgained: isBoolean(state.isOnceAgained) ? state.isOnceAgained : this.state.isOnceAgained,
      visibleHeight: state.visibleHeight || this.state.visibleHeight
    })
  }

  componentDidMount() {
    this.getUser();
  }

  getCommentList = async chatId => {
    const userInputDialog = this.state.currentDialog[0]
    const story = await fb.getAStory(chatId);
    const commentOfThisChat = story.comments;
    let thisIsAlreadyCommentedWithThisUser = false;
    console.log("commentOfThisChat: ", commentOfThisChat);
    //이미 코멘트 달았는지 확인
    commentOfThisChat.forEach((commentObject, index) => {
      commentObject.userId == this.props.userId
        ? (thisIsAlreadyCommentedWithThisUser = true)
        : null;
    });
    let thisCrowdBoxDialog = commentOfThisChat.map((commentObject, index) => ({
      speaker: commentObject.userId == this.props.userId ? "user" : "bot",
      text: commentObject.content,
      profileImageName: commentObject.profileImageName,
      crowdEmotion: commentObject.emotion
    }));
    this.props.isCrowdBox
      ? null
      : thisCrowdBoxDialog.push({
          speaker: "user",
          text: userInputDialog.text,
          profileImageName: userInputDialog.profileImageName,
          crowdEmotion: commentObject.emotion
        });
    this.crowdBoxDialog = thisCrowdBoxDialog;
    this.setState({
      crowdBoxDialog: thisCrowdBoxDialog,
      isAlreadyCommentedWithThisUser: thisIsAlreadyCommentedWithThisUser
    });
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow(e) {
    let newSize = Dimensions.get("window").height - e.endCoordinates.height;
    this.setState({
      visibleHeight: newSize
      // topLogo: {width: 100, height: 70}
    });
  }

  keyboardDidHide(e) {
    this.setState({
      visibleHeight: Dimensions.get("window").height
      // topLogo: {width: Dimensions.get('window').width}
    });
  }

  createChatRoom = async () => {
    const hello = "오늘 무슨 일 있었어?";
    const backgroundImage = getBackgroundImageName();
    this.setState({
      currentDialog: [
        {
          speaker: "bot",
          text: hello
        }
      ],
      backgroundImageName: backgroundImage,
      firstQuestion: hello
    });
  };

  handleTextInput = async (speaker, text, iconInput, isMyLog) => {
    const { firstQuestion, backgroundImageName } = this.state;
    const { user, chatId } = this.state;
    //crowdbox면 this.state.currentDialog를 답변 하나만 있는 상태로 초기화!
    const myLogInput = {
      //when is not MyLog and don't have iconInput
      currentDialog: [
        ...this.state.currentDialog,
        { speaker: speaker, text: text },
        { speaker: "bot", text: "..." }
      ],
      isCrowdBox: false,
      isTextInput: false,
      isIconInput: false,
      isButtonInput: false,
      isFinished: false
    };
    const forCrowdBox = {
      //when is not MyLog
      currentDialog: [
        {
          speaker: "user",
          text: text,
          profileImageName: user.usericon,
          crowdEmotion: `${iconInput.split("_")[0]}_option_clicked`
        }
      ],
      currentQuestion: null,
      nextQuestion: null,
      listOfEmotion: [],
      isCrowdBox: true,
      isTextInput: false,
      isIconInput: false,
      isButtonInput: false,
      isFinished: false
    };
    console.log("forCrowdBox", forCrowdBox);
    // this.setState(isMyLog ? myLogInput : forCrowdBox);
    if (isMyLog) {
      this.setState(myLogInput);
      // const caching = !!this.state.firstQuestion;
      // let { chatId } = this.state;
      // if (firstQuestion) {
      //   chatId = await fb.createChat(user.userId, backgroundImageName, this.state);
      //   this.setState({chatId, firstQuestion: null});
      //   // fb.createMessage("bot", chatId, firstQuestion, false, null);
      // }
      // await fb.createMessage(user.userId, chatId, text, caching, myLogInput);
    } else {
      this.setState(forCrowdBox);
      // fb.createComment(user.userId, chatId, text, `${iconInput.split("_")[0]}_option_clicked`)
    }
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
    console.log("nextQuestionFixed: ", nextQuestionFixed);
    this.botPushThisQuestion(nextQuestionFixed, this.state.listOfEmotion);
  };

  handleIconInput = async (speaker, iconInput, isMyLog) => {
    const {user, chatId} = this.state;
    // console.log("In ChatRoom handleIconInput iconInput: ", iconInput);
    const nextState = {
      currentDialog: [
        ...this.state.currentDialog,
        { speaker: "userIcon", text: iconInput },
        { speaker: "bot", text: "..." }
      ],
      listOfEmotion: [...this.state.listOfEmotion, iconInput],
      isCrowdBox: false,
      isTextInput: false,
      isIconInput: false,
      isButtonInput: false,
      isFinished: false
    }
    this.setState(nextState);
    // await fb.createEmotion(user.userId, chatId, iconInput, nextState);
    //add bot question here
    this.botPushThisQuestion(this.state.nextQuestion, [
      ...this.state.listOfEmotion,
      iconInput
    ]);
  };

  handleButtonInput = buttonAnswer => {
    this.setState({
      currentDialog: [
        ...this.state.currentDialog,
        { speaker: "user", text: buttonAnswer },
        { speaker: "bot", text: "..." }
      ],
      isCrowdBox: false,
      isTextInput: false,
      isIconInput: false,
      isButtonInput: false,
      isFinished: false
    });
    this.botPushThisQuestion(
      this.state.nextQuestion,
      this.state.listOfEmotion,
      buttonAnswer
    );
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

  renderChatRoomHeaderLeft = chatLog => (chatLog ? null : null);

  renderChatRoomHeaderRight = chatLog => (
    <ImageButton
      boxWidth={"20"}
      imageWidth={"5"}
      imageName={"cancel"}
      onPress={
        chatLog
          ? () => this.props.navigation.goBack()
          : () => this.finishChat()
      }
    />
  );

  finishChat = async () => {
    const {user, backgroundImageName, chatId, currentDialog} = this.state;
    if (!chatId && currentDialog.length > 1) {
      fb.createChat(user.userId, backgroundImageName, this.state);
    }
    this.props.navigation.goBack()
  }

  iconNameToKorean = iconName => {
    if (iconName.includes("joy")) return "즐거움";
    if (iconName.includes("trust")) return "신뢰";
    if (iconName.includes("fear")) return "공포";
    if (iconName.includes("surprise")) return "놀라움";
    if (iconName.includes("anticipation")) return "설렘";
    if (iconName.includes("anger")) return "화남";
    if (iconName.includes("disgust")) return "혐오";
    if (iconName.includes("sadness")) return "슬픔";
  };

  makeKoreanChunk1 = koreanIconName => {
    if (koreanIconName == "즐거움") {
      const chunk = "즐거움 이";
      return chunk;
    }
    if (koreanIconName == "신뢰") {
      const chunk = "신뢰";
      return chunk;
    }
    if (koreanIconName == "공포") {
      const chunk = "공포";
      return chunk;
    }
    if (koreanIconName == "놀라움") {
      const chunk = "놀라움 이";
      return chunk;
    }
    if (koreanIconName == "설렘") {
      const chunk = "설렘 이";
      return chunk;
    }
    if (koreanIconName == "화남") {
      const chunk = "화남 이";
      return chunk;
    }
    if (koreanIconName == "혐오") {
      const chunk = "혐오";
      return chunk;
    }
    if (koreanIconName == "슬픔") {
      const chunk = "슬픔 이";
      return chunk;
    }
  };

  makeKoreanChunk2 = koreanIconName => {
    if (koreanIconName == "즐거움") {
      const chunk = "즐거움을 ";
      return chunk;
    }
    if (koreanIconName == "신뢰") {
      const chunk = "신뢰를 ";
      return chunk;
    }
    if (koreanIconName == "공포") {
      const chunk = "공포를 ";
      return chunk;
    }
    if (koreanIconName == "놀라움") {
      const chunk = "놀라움을 ";
      return chunk;
    }
    if (koreanIconName == "설렘") {
      const chunk = "설렘을 ";
      return chunk;
    }
    if (koreanIconName == "화남") {
      const chunk = "화남을 ";
      return chunk;
    }
    if (koreanIconName == "혐오") {
      const chunk = "혐오를 ";
      return chunk;
    }
    if (koreanIconName == "슬픔") {
      const chunk = "슬픔을 ";
      return chunk;
    }
  };

  isIncludes = (emotionList, emotion1, emotion2) => {
    if (emotionList.includes(emotion1) && emotionList.includes(emotion2)) {
      return true;
    }
    return false;
  };

  analyzeEmotion = (emotion1, emotion2) => {
    if (this.isIncludes(["즐거움", "신뢰"], emotion1, emotion2)) {
      //사랑
      const resultDialog = [
        `내가 볼때 너, 사랑을 느끼고 있는 것 같아!`,
        "어떻게 생각해?"
      ];
      return resultDialog;
    }
    if (this.isIncludes(["신뢰", "공포"], emotion1, emotion2)) {
      //순종
      const resultDialog = [
        "두 가지 감정을 봤을 때, 아까 말해준 상황에서 네가 조금 순종적이었던 것 같아.",
        "내 생각이 맞니?"
      ];
      return resultDialog;
    }
    if (this.isIncludes(["공포", "놀라움"], emotion1, emotion2)) {
      //두려움
      const resultDialog = [
        `잠깐 생각해봤는데, 아까 말해준 상황에서 네가 두려움을 느꼈던 것 같아.`,
        "정말로 그랬니?"
      ];
      return resultDialog;
    }
    if (this.isIncludes(["놀라움", "슬픔"], emotion1, emotion2)) {
      //난감
      const resultDialog = [
        `다시 생각해보니까 너 되게 난감했을 것 같아.`,
        "정말 그랬어?"
      ];
      return resultDialog;
    }
    if (this.isIncludes(["슬픔", "혐오"], emotion1, emotion2)) {
      //자책
      const resultDialog = [
        `네가 말해준 감정들을 보니까, 너 지금 자책하고 있는 것 같아.`,
        "어떻게 생각해?"
      ];
      return resultDialog;
    }
    if (this.isIncludes(["혐오", "화남"], emotion1, emotion2)) {
      //경멸
      const resultDialog = [
        `네 말을 듣고 생각해보니까, 너 뭔가 경멸하고 있었던 것  같기도 해.`,
        "내 생각이 맞니?"
      ];
      return resultDialog;
    }
    if (this.isIncludes(["화남", "설렘"], emotion1, emotion2)) {
      //공격적인 상태
      const resultDialog = [
        `조심스럽지만, 아까 상황에서 네가 조금 공격적이었던 것 같아.`,
        "어떻게 생각해?"
      ];
      return resultDialog;
    }
    if (this.isIncludes(["즐거움", "설렘"], emotion1, emotion2)) {
      //낙천적인 상태
      const resultDialog = [
        `문득 든 생각인데 너 정말 긍정적이구나! `,
        "너도 그렇게 생각하니?"
      ];
      return resultDialog;
    }
  };

  isBadEmotion = (emotion1, emotion2) => {
    // console.log("Input emotion1, 2: ", emotion1, emotion2);
    if (this.isIncludes(["즐거움", "설렘", "신뢰"], emotion1, emotion2)) {
      return false;
    }
    return true;
  };

  getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  botPushThisQuestion = (thisQuestion, listOfEmotion, buttonAnswer = null) => {
    let { user, chatId, backgroundImageName } = this.state;
    console.log("thisQuestion: ", thisQuestion);
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
            `너가 느낀 감정은 ${this.makeKoreanChunk1(
              this.iconNameToKorean(latestIconInput)
            )}구나. 혹시 이유가 뭐야?`
            // botQuestions.q2[botQuestions.q2.length - 1]
          ];
      nextQuestion = isIconInputNothing ? "end" : "q3";
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
      // console.log("im in q4!!!");
      const prevIconInput = listOfEmotion[0];
      const latestIconInput =
        listOfEmotion[listOfEmotion.length ? listOfEmotion.length - 1 : 0];
      const isIconInputNothing =
        listOfEmotion.length != 0 &&
        (latestIconInput.includes("nothing") ||
          latestIconInput.includes(prevIconInput)); //없음을 눌렀거나 첫번째로 고른 감정과 동일한 감정을 눌렀거나
      const isBadEmotion = this.isBadEmotion(
        this.iconNameToKorean(prevIconInput),
        this.iconNameToKorean(latestIconInput)
      );
      // console.log("q4: isBadEmotion: ", isBadEmotion);
      // console.log(
      //   "In ChatRoom botPushThisQuestion if q4 latestIconInput:",
      //   latestIconInput
      // );
      thisQuestionText = isIconInputNothing
        ? isBadEmotion
          ? [
              `${this.iconNameToKorean(
                prevIconInput
              )}만 느꼈구나. 답해줘서 고마워.`,
              botQuestions.q5[botQuestions.q5.length - 1] //p5랑 합쳐졌으므로 이 경우 nextQuestion은 "q8"
            ]
          : [
              `${this.iconNameToKorean(
                prevIconInput
              )}만 느꼈구나. 답해줘서 고마워.`,
              "혹시 이 감정이 너에게 긍정적인 영향을 주고 있니?"
            ]
        : [
            `${this.iconNameToKorean(
              latestIconInput
            )}도 느꼈구나. ${this.makeKoreanChunk2(
              this.iconNameToKorean(latestIconInput)
            )}느낀 이유는 뭐야?`
          ];
      nextQuestion = isIconInputNothing ? "q8" : "q4a";
    }
    if (thisQuestion == "q4a") {
      // console.log("Im in q4a!!!!!:",listOfEmotion)
      const analyzedEmotion = this.analyzeEmotion(
        this.iconNameToKorean(listOfEmotion[0]),
        this.iconNameToKorean(listOfEmotion[1])
      );
      // console.log("analyzedEmotion: ", analyzedEmotion);
      const isBadEmotion = this.isBadEmotion(
        this.iconNameToKorean(listOfEmotion[0]),
        this.iconNameToKorean(listOfEmotion[1])
      );
      thisQuestionText = analyzedEmotion
        ? analyzedEmotion
        : isBadEmotion
        ? botQuestions.q5
        : botQuestions.q8;
      nextQuestion = analyzedEmotion
        ? isBadEmotion
          ? "q5"
          : "q8"
        : isBadEmotion
        ? "q8"
        : null;
    }
    if (thisQuestion == "q5") {
      thisQuestionText = botQuestions.q5;
      nextQuestion = "q8";
    }
    if (thisQuestion == "q6") {
      //구체적인 설명을 되물어야 하는 경우
      thisQuestionText = [
        botQuestions.q6[this.getRandomInt(0, botQuestions.q6.length - 1)],
        "조금만 더 설명해줄 수 있어?"
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
      nextQuestion = "end";
    }
    if (thisQuestion == "q8") {
      thisQuestionText = botQuestions.q8;
      nextQuestion = "end";
    }
    if (thisQuestion == "end") {
      thisQuestionText =
        buttonAnswer == "응 그렇게 해줘" ? botQuestions.q9 : botQuestions.q10;
      nextQuestion = null;
    }
    const isFinished = nextQuestion === null;
    const isIconInput =
      !isFinished && (thisQuestion === "q1" || thisQuestion === "q3");
    const isButtonInput = !isFinished && !isIconInput && nextQuestion == "end";
    const isTextInput = !isFinished && !isIconInput && !isButtonInput;

    // console.log("In ChatRoom botPushThisQuestion isFinished:", isFinished);

    const isAfterCheckingMeaningful =
      thisQuestion == "q1" && this.state.currentDialog.length < 3;
    const firstTimeIntervalFiexd = isAfterCheckingMeaningful ? 0 : 1800;
    let timeOffset = 0;
    thisQuestionText.map((text, index) => {
      // console.log(text);
      const isItFirstItem = index == 0;
      const isItLastItem = index == thisQuestionText.length - 1;
      setTimeout(async () => {
        // fb.createMessage("bot", chatId, text);
        this.setState({
          currentDialog: isItLastItem
            ? [
                ...this.state.currentDialog.slice(
                  0,
                  this.state.currentDialog.length - 1
                ),
                {
                  speaker: "bot",
                  text: text
                }
              ]
            : [
                ...this.state.currentDialog.slice(
                  0,
                  this.state.currentDialog.length - 1
                ),
                {
                  speaker: "bot",
                  text: text
                },
                {
                  speaker: "bot",
                  text: "..."
                }
              ],
          currentQuestion: isItLastItem
            ? thisQuestion
            : this.state.currentQuestion, // botPushThisQuestion에서만 수정해야함
          nextQuestion: isItLastItem ? nextQuestion : this.state.nextQuestion, // botPushThisQuestion에서만 수정해야함
          isTextInput: isItLastItem ? isTextInput : this.state.isTextInput,
          isIconInput: isItLastItem ? isIconInput : this.state.isIconInput,
          isButtonInput: isItLastItem
            ? isButtonInput
            : this.state.isButtonInput,
          isFinished: isItLastItem ? isFinished : this.state.isFinished
        });
        // this.setState(nextState);
        // fb.createMessage("bot", chatId, text, false, nextState);
        // if (nextState.isFinished)
        if (isItLastItem ? isFinished : this.state.isFinished) {
          const {chatId} = await fb.createChat(user.userId, backgroundImageName, this.state);
          this.setState({chatId})
        }
      }, firstTimeIntervalFiexd + this.getRandomInt(1500, 1950) * timeOffset);
      timeOffset += 1;
    });
    this.scrollView.scrollToEnd({ animated: true });
  };

  // meaningless = async (text) => {
  //   const meaningless = await nlp.meaningless(text);
  //   this.setState({
  //   })
  // }
  printDialogAsWellFormed = () => {
    this.state.currentDialog.map((dialog, index) => {
      index == 0 ? console.log("[") : null;
      console.log(`{"speaker":"${dialog.speaker}", "text":"${dialog.text}"},`);
      index == this.state.currentDialog.length - 1 ? console.log("]\n") : null;
    });
  };

  getUser = async () => {
    const user = this.state.user || (await fb.getUserInfo());
    this.setState({ user });
    console.log("usericon: ", user.usericon);
  };

  render() {
    const { myChat, chatLog, isCrowdBox, isStartTop, chatId } = this.props; //chatLog가 있으면 기존 chatLog에 담긴 대화 내용으로 로그 만들기, 없으면 새로운 채팅창 열기(아직 새 채팅창만 구현됨)
    let { backgroundImageName } = this.props;
    if (!backgroundImageName) {
      backgroundImageName = this.state.backgroundImageName;
    }
    // console.log("In ChatRoom this.state:", this.state);
    // this.printDialogAsWellFormed();
    const contentsTopBottomMargin = 8;
    const targetDialog = chatLog ? chatLog : this.state.currentDialog;
    // const targetDialog = this.state.currentDialog;
    var { navigate } = this.props.navigation;
    const navigation = this.props.navigation;
    const isNewChat = navigation.getParam("isNewChat");
    // const backgroundImageName = navigation.getParam('backgroundImageName');

    return (
      <View
        style={{
          height: this.state.visibleHeight
        }}
      >
        <ImageBackground
          source={Images(backgroundImageName)}
          style={styles.backgroundImage}
        >
          <Header
            title={
              chatLog
                ? myChat
                  ? "나의 이야기"
                  : "다른 사람의 이야기"
                : "내가 진행중인 대화"
            }
            left={this.renderChatRoomHeaderLeft(chatLog)}
            right={this.renderChatRoomHeaderRight(chatLog)}
          />

          <NoticeBox
            notice={
              chatLog ? (myChat ? myLogNotice : otherChatNotice) : myChatNotice
            }
          />
          <ScrollView
            style={{
              backgroundColor: "rgba(0,0,0,0)",
              paddingBottom: contentsTopBottomMargin,
              paddingTop: contentsTopBottomMargin
            }}
            ref={ref => (this.scrollView = ref)}
            onContentSizeChange={(contentWidth, contentHeight) => {
              isStartTop
                ? null
                : this.scrollView.scrollToEnd({ animated: true });
            }}
          >
            {targetDialog.map((dialog, index) => (
              <ChatElement
                key={index}
                speaker={dialog.speaker}
                isMyChat={myChat || isNewChat}
                text={dialog.text}
                profileImageName={
                  dialog.speaker == "bot"
                    ? "bot"
                    : this.state.user
                    ? this.state.user.usericon
                    : "user"
                }
              />
            ))}
          </ScrollView>
          {chatLog ? (
            <View>
              {this.state.isCrowdBox ||
              isCrowdBox ? (
                <CrowdBoxFooter
                  chatId={chatId}
                  userId={this.state.user.userId}
                  isCrowdBox={true}
                  // crowdBoxDialog={this.crowdBoxDialog}
                  userInputDialog={this.state.currentDialog[0]}
                />
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
              {this.state.isTextInput && !this.state.isFinished ? (
                <TextInputFooter
                  onPress={this.handleTextInput}
                  isIconOptionBox={false}
                  isMyLog={true}
                />
              ) : null}
              {this.state.isIconInput && !this.state.isFinished ? (
                <IconInputFooter
                  onPress={this.handleIconInput}
                  isMyLog={true}
                />
              ) : null}
              {this.state.isButtonInput && !this.state.isFinished ? (
                <ButtonInputFooter onPress={this.handleButtonInput} />
              ) : null}
            </View>
          )}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatRoomContents: {
    flex: 1
  },
  icon: {
    width: 24,
    height: 24
  },
  backgroundImage: {
    flex: 1
  }
});

export default ChatRoom;
