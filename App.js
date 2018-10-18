import React from "react";
import { StyleSheet, View } from "react-native";
import LogList from "./components/LogList";
import ChatRoom from "./components/ChatRoom";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import Routes from "./components/Routes";

const myLog = true; //true for MyLog and false for Story
const story = false;

export default class App extends React.Component {
  render() {
    return (
      <Routes />
      //<View style={styles.container}>
      //  {/*<LogList myLog={myLog} />*/}
      //  <ChatRoom />
      //</View>
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
