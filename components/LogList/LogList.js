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

import {Actions} from 'react-native-router-flux';

const EMOTIONS = ["sobad", "bad", "soso", "good", "sogood"];

class LogList extends Component {
  state = {
    logList: [
      {
        key: "0",
        selfEmotion: EMOTIONS[0],
        crowdEmotion: EMOTIONS[1],
        date: "18.10.05",
        text: "I fought with my friend..."
      },
      {
        key: "1",
        selfEmotion: EMOTIONS[3],
        crowdEmotion: EMOTIONS[2],
        date: "18.10.04",
        text: "My teacher said that i was bad guy..."
      },
      {
        key: "2",
        selfEmotion: EMOTIONS[2],
        crowdEmotion: EMOTIONS[4],
        date: "18.10.03",
        text: "I got the GPA 4.3~"
      },
      {
        key: "3",
        selfEmotion: EMOTIONS[0],
        crowdEmotion: EMOTIONS[1],
        date: "18.10.02",
        text: "I fought with my best friend..."
      },
      {
        key: "4",
        selfEmotion: EMOTIONS[1],
        crowdEmotion: EMOTIONS[2],
        date: "18.10.01",
        text: "I played with my brother!"
      },
      {
        key: "5",
        selfEmotion: EMOTIONS[4],
        crowdEmotion: EMOTIONS[4],
        date: "18.09.31",
        text: "I played with my sister!"
      }
    ]
  };

  routeToChatRoom = () => {
    Actions.chatroom()
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
      imageWidth={"10"}
      imageName={"save"}
    />
  );

  renderLogListHeaderRight = () => (
    <ImageButton
      boxWidth={"20"}
      imageWidth={"10"}
      imageName={"search"}
      onPress={this.examplePress}
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
        onPress={this.routeToChatRoom}
      />
    ));

    return (
      <View>
        <Header
          title={myLog ? "MyLog" : "Story"}
          left={this.renderLogListHeaderLeft()}
          right={this.renderLogListHeaderRight()}
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
  }
});

export default LogList;
