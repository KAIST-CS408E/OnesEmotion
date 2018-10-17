import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Colors from "./../../assets/Colors";

class Header extends Component {
  render() {
    const { title, left, right } = this.props; // left and right should be the ImageButton
    return (
      <View style={styles.header}>
        <View className="HeaderLeft" style={{ width: hearderSideBoxWidth }}>
          {left ? left : null}
        </View>
        {title ? (
          <View>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        ) : null}
        <View className="HeaderRight" style={{ width: hearderSideBoxWidth }}>
          {right ? right : null}
        </View>
      </View>
    );
  }
}

const hearderSideBoxWidth = wp('20%');
const headerHeight = hp("13%");
const headerTextHeight = (headerHeight * 2) / 5;

const styles = StyleSheet.create({
  header: {
    height: headerHeight,
    backgroundColor: Colors.headerGrey,
    alignItems: "center",
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headerTitle: {
    fontSize: headerTextHeight,
    color: Colors.white,
    height: headerHeight,
    textAlignVertical: "center"
  }
});

export default Header;
