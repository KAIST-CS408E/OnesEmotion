import React, { Component } from "react";
import { View, Text, Image, Alert, StyleSheet, ScrollView } from "react-native";
import LogItem from "./LogItem";
import Header from "./../Header";
import ImageButton from "./../ImageButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Colors from "./../../assets/Colors";
import Icons from "./../../assets/Icons";
import Modal from "../Modal";
import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerActions
} from "react-navigation";
import NoticeBox from "../NoticeBox";
import Loading from "../Loading";

import fb from "../../utils/firebaseWrapper";
import datetime from "../../utils/datetime";
import { bold } from "../../node_modules/ansi-colors";

const EMOTIONS = ["sobad", "bad", "soso", "good", "sogood"];
const storyNotice = [
  "다른 사람들의 이야기",
  "이 페이지에서는",
  "다른 사람들의 이야기를 볼 수 있습니다.",
  "공감할 수 있는 이야기에",
  "힘이 되는 댓글을 남겨주세요!"
];
const myLogNotice = [
  "나의 이야기",
  "이 페이지에서는",
  "내가 기록한 이야기들을 볼 수 있습니다.",
  "이야기를 삭제하고 싶다면",
  "아이템을 길~게 눌러주세요!"
];

class LogList extends Component {
  state = {
    logList: [],
    user: fb.getUser(),
    isRemoveModalVisible: false,
    removeTargetKey: -1,
    isLoaded: false
  };

  componentDidMount() {
    this.getChatList();
  }

  componentWillReceiveProps(nextProps) {
    this.getChatList();
  }

  getChatList = async () => {
    if (this.props.refreshRecommend) {
      this.props.refreshRecommend()
    }
    let user = this.state.user || (await fb.getUserInfo());
    const { myLog } = this.props;
    if (myLog) {
      const chatList = await fb.getAllChats(user.userId);
      if (chatList.length == 0) {
        this.setState({ isLoaded: true });
        return;
      }
      this.setState({
        logList: chatList.map(chat => ({
          key: chat.chatId,
          selfEmotion: chat.userEmotion, // TODO: emotion name matching
          crowdEmotion: chat.othersEmotion, // TODO: emotion name matching
          date: datetime.toString(chat.createdAt.toDate()),
          text: this.toShort(chat.summary ? chat.summary : ""),
          backgroundImageName: chat.backgroundImage
        })),
        isLoaded: true
      });
    } else {
      const chatList = await fb.getAllStories(user.userId);
      if (chatList.length == 0) {
        this.setState({ isLoaded: true });
        return;
      }
      let logList = [];
      chatList.forEach(chat => {
        if (!chat.createdAt) {
          return;
        }
        logList.push({
          key: chat.chatId,
          date: datetime.toString(
            chat.createdAt ? chat.createdAt.toDate() : new Date()
          ),
          text: this.toShort(chat.summary ? chat.summary : ""),
          backgroundImageName: chat.backgroundImage,
          commentNum: chat.totalComments
        });
      });
      this.setState({
        logList: logList,
        isLoaded: true
      });
    }
  };

  toShort = text => {
    if (text.length > 30) {
      return text.slice(0, 28) + "...";
    }
    return text;
  };

  handleRemove = () => {
    const { myLog } = this.props;
    if (!myLog) {
      return;
    }
    const nextLogList = this.state.logList.filter(item => {
      const keeping = item.key !== this.state.removeTargetKey;
      if (!keeping && myLog) {
        fb.removeChat(item.key);
      }
      return keeping;
    });
    this.setState({
      logList: nextLogList
    });
  };

  handleModalVisible = () => {
    this.setState({ isRemoveModalVisible: false, removeTargetKey: -1 });
  };

  renderLogListHeaderLeft = () => (
    <ImageButton
      boxWidth={"20"}
      imageWidth={"6"}
      imageName={"menu"}
      onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}
    />
  );

  renderLogListHeaderRight = myLog => (
    <ImageButton
      boxWidth={"20"}
      imageWidth={"6"}
      imageName={myLog ? "add" : "refresh"}
      onPress={
        myLog
          ? () =>
              this.props.navigation.navigate("ChatRoom", {
                getChatList: this.getChatList
              })
          : () => this.getChatList()
      }
    />
  );

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

  render() {
    const { myLog } = this.props;
    console.log("logList", this.state.logList);
    const contents = this.state.logList.map((item, i) => (
      <LogItem
        myLog={myLog}
        id={item.key}
        key={i}
        date={item.date}
        text={item.text}
        selfEmotion={item.selfEmotion}
        crowdEmotion={item.crowdEmotion}
        onLongPress={() => {
          this.setState({
            isRemoveModalVisible: true,
            removeTargetKey: item.key
          });
        }}
        navigation={this.props.navigation}
        backgroundImageName={item.backgroundImageName}
        commentNum={item.commentNum}
      />
    ));

    return (
      <View>
        <Header
          title={myLog ? "내가 진행한 이야기들" : "다른 사람들의 이야기"}
          left={this.renderLogListHeaderLeft()}
          right={this.renderLogListHeaderRight(myLog)}
        />
        <NoticeBox notice={myLog ? myLogNotice : storyNotice} />
        {this.state.isLoaded ? null : <Loading />}
        <ScrollView>
          {this.state.isLoaded && contents.length == 0 ? (
            <View style={styles.emptyMyLogMessageContainer}>
              <View style={styles.emptyMyLogMessageWrapper}>
                <Text style={styles.emptyMyLogMessageText1}>
                  {"아직 채팅이 없습니다."}
                </Text>
                <Text style={styles.emptyMyLogMessageText2}>
                  {"오른쪽 상단의 '+' 버튼을 눌러 시작해 보세요!"}
                </Text>
              </View>
            </View>
          ) : (
            contents
          )}
        </ScrollView>
        {this.state.isRemoveModalVisible && myLog ? (
          <Modal
            onYes={this.handleRemove}
            handleModalVisible={this.handleModalVisible}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logList: {
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    width: 24,
    height: 24
  },
  emptyMyLogMessageContainer: {
    height: hp("85%"),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  emptyMyLogMessageWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  emptyMyLogMessageText1: {
    fontSize: 20,
    fontWeight: "bold"
  },
  emptyMyLogMessageText2: {
    fontSize: 15,
    fontWeight: "bold"
  }
});

export default LogList;
