import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Icons from "./../../assets/Icons";
import LogList from "../LogList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import { withNavigation, DrawerActions } from 'react-navigation';

class MyLog extends React.Component {
  render() {
    const myLog = false
    const navigation = this.props.navigation;

    return (
      <View style={styles.container}>
        <LogList 
          myLog={myLog} 
          navigation={navigation}
        />
      </View>
    );
  }
}

export default withNavigation(MyLog);

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    width: 24,
    height: 24,
  }
});