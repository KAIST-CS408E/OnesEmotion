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

import { createStackNavigator, createDrawerNavigator, DrawerActions } from 'react-navigation';

import fb from "../../utils/firebaseWrapper";
import datetime from "../../utils/datetime";

const EMOTIONS = ["sobad", "bad", "soso", "good", "sogood"];

class LogList extends Component {
  state = {
    logList: [
      // {
      //   key: "0",
      //   selfEmotion: EMOTIONS[0],
      //   crowdEmotion: EMOTIONS[1],
      //   date: "18.10.05",
      //   text: "I fought with my friend..."
      // },
      // {
      //   key: "1",
      //   selfEmotion: EMOTIONS[3],
      //   crowdEmotion: EMOTIONS[2],
      //   date: "18.10.04",
      //   text: "My teacher said that i was bad guy..."
      // },
      // {
      //   key: "2",
      //   selfEmotion: EMOTIONS[2],
      //   crowdEmotion: EMOTIONS[4],
      //   date: "18.10.03",
      //   text: "I got the GPA 4.3~"
      // },
      // {
      //   key: "3",
      //   selfEmotion: EMOTIONS[0],
      //   crowdEmotion: EMOTIONS[1],
      //   date: "18.10.02",
      //   text: "I fought with my best friend..."
      // },
      // {
      //   key: "4",
      //   selfEmotion: EMOTIONS[1],
      //   crowdEmotion: EMOTIONS[2],
      //   date: "18.10.01",
      //   text: "I played with my brother!"
      // },
      // {
      //   key: "5",
      //   selfEmotion: EMOTIONS[4],
      //   crowdEmotion: EMOTIONS[4],
      //   date: "18.09.31",
      //   text: "I played with my sister!"
      // }
    ],
    user: fb.getUser()
  };

  componentDidMount() {
    this.getChatList()
  }

  getChatList = async () => {
    const {user} = this.state;
    const {myLog} = this.props;
    if (myLog) {
      const chatList = await fb.getAllChats(user.userId);
      if (chatList.length == 0) {
        return
      }
      this.setState({
        logList: chatList.map((chat) => ({
          key: chat.chatId,
          selfEmotion: chat.userEmotion, // TODO: emotion name matching
          crowdEmotion: chat.othersEmotion, // TODO: emotion name matching
          date: datetime.toString(chat.createdAt.toDate()),
          text: this.toShort(chat.summary ? chat.summary : "채팅 요약 캐싱 전 로그입니다.")
        }))
      })
    } else {
      const chatList = await fb.getAllStories(user.userId);
      if (chatList.length == 0) {
        return
      }
      let logList = [];
      chatList.forEach((chat) => {
        if (!chat.createdAt) {
          return
        }
        logList.push({
          key: chat.chatId,
          date: datetime.toString(chat.createdAt? chat.createdAt.toDate() : new Date()),
          text: this.toShort(chat.summary ? chat.summary : "채팅 요약 캐싱 전 로그입니다.")
        })
      });
      this.setState({
        logList: logList
      })
    }
  }

  toShort = (text) => {
    if (text.length > 30) {
      return text.slice(0, 28) + '...'
    }
    return text
  }

  handlePress = id => {};

  handleRemove = id => {
    const nextLogList = this.state.logList.filter(item => item.id !== id);
    this.setState({
      logList: nextLogList
    });
  };

  renderLogListHeaderLeft = () => (
    <ImageButton
      boxWidth={"20"}
      imageWidth={"6"}
      imageName={"menu"}
      onPress={() =>this.props.navigation.dispatch(DrawerActions.openDrawer())}
    />
  );

  renderLogListHeaderRight = (myLog) => (
    <ImageButton
      boxWidth={"20"}
      imageWidth={"6"}
      imageName={myLog? "add" : "refresh"}
      onPress={
        myLog
        ? () => this.props.navigation.navigate("ChatRoom")
        : () => this.props.navigation.navigate("Story")
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

    const contents = this.state.logList.map(item => (
      <LogItem
        myLog={myLog}
        id={item.key}
        key={item.key}
        date={item.date}
        text={item.text}
        selfEmotion={item.selfEmotion}
        crowdEmotion={item.crowdEmotion}
        onRemove={this.handleRemove}
        onClick={this.handleClick}
        navigation = {this.props.navigation}
      />
    ));

    return (
      <View>
        <Header
          title={myLog ? "나의 이야기" : "다른 사람들의 이야기"}
          left={this.renderLogListHeaderLeft()}
          right={this.renderLogListHeaderRight(myLog)}
        />
        <ScrollView>{contents}</ScrollView>
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
    height: 24,
  }
});

export default LogList;
