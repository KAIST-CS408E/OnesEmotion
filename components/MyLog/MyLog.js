import React from "react";
import { StyleSheet, View } from "react-native";
import LogList from "../LogList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

export default class MyLog extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <LogList myLog={true} />
      </View>
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