import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Colors from "./../../assets/Colors";
import Images from "./../../assets/Images";
import Icons from "./../../assets/Icons";

class LogItem extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.text !== this.props.text;
  }

  render() {
    const {
      myLog,
      id,
      date,
      text,
      selfEmotion,
      crowdEmotion,
      onLongPress,
      onClick,
      backgroundImageName,
    } = this.props;

    const { navigate } = this.props.navigation;
    // const page = (myLog ? "MyLog" : "OtherChat");

    return (
      <TouchableOpacity
        onPress={() =>
          myLog
            ? this.props.navigation.navigate("MyChat", {chatId: id, backgroundImageName})
            : this.props.navigation.navigate("OtherChat", {chatId: id, backgroundImageName})
        }
        onLongPress={() => onLongPress()}
      >
        <ImageBackground 
          source={Images(backgroundImageName)}
          style={styles.itemBox}
        >
          {myLog ? (
            <View style={styles.itemBoxLeft}>
              <View style={styles.itemBoxImageBox}>
                <Image
                  style={styles.imageSelfEmotion}
                  source={Icons(selfEmotion)}
                />
              </View>
            </View>
          ) : null}
          <View
            style={myLog ? styles.itemBoxMiddle : styles.itemBoxMiddleStory}
          >
            <View style={styles.itemBoxTextBox}>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.itemDate}>{date}</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.itemText}>{text}</Text>
              </View>
            </View>
          </View>
          {myLog ? (
            <View style={styles.itemBoxRight}>
              <View style={styles.itemBoxImageBox}>
                <Image
                  style={styles.imageCrowdEmotion}
                  source={Icons(crowdEmotion)}
                />
                <View style={{ paddingTop: imageSizeCrowd / 3 }}>
                  <Image style={styles.imageCrowd} source={Icons("crowd")} />
                </View>
              </View>
            </View>
          ) : null}
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

const itemBoxHeight = hp("25%");
const myLogWidthSide = wp("25%");
const myLogWidthMiddle = wp("50%");
const storyWidthMiddle = wp("100%");
const imageSizeSelfEmotion = (itemBoxHeight * 2) / 7;
const imageSizeCrowdEmotion = itemBoxHeight / 5;
const imageSizeCrowd = itemBoxHeight / 6;

const styles = StyleSheet.create({
  itemBox: {
    height: itemBoxHeight,
    marginTop: wp("1.5%"),
    marginBottom: wp("1.5%"),
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: Colors.logBackground
  },
  itemBoxMiddle: {
    width: myLogWidthMiddle,
    // backgroundColor: "skyblue",
    alignItems: "center"
  },
  itemBoxTextBox: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  itemBoxMiddleStory: {
    width: storyWidthMiddle,
    // backgroundColor: "skyblue",
    alignItems: "center"
  },
  itemBoxMiddleText: {
    textAlignVertical: "center"
  },
  itemBoxRight: {
    width: myLogWidthSide,
    // backgroundColor: "steelblue",
    alignItems: "center"
  },
  itemBoxLeft: {
    width: myLogWidthSide,
    // backgroundColor: "powderblue",
    alignItems: "center"
  },
  itemBoxImageBox: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  itemDate: {
    textAlign: "center",
    fontSize: itemBoxHeight / 9,
    height: itemBoxHeight / 6,
    color: Colors.white
  },
  itemText: {
    textAlign: "center",
    fontSize: itemBoxHeight / 12,
    color: Colors.white
  },
  imageSelfEmotion: {
    width: imageSizeSelfEmotion,
    height: imageSizeSelfEmotion
  },
  imageCrowdEmotion: {
    width: imageSizeCrowdEmotion,
    height: imageSizeCrowdEmotion
  },
  imageCrowd: {
    width: imageSizeCrowd,
    height: imageSizeCrowd
  }
});

export default LogItem;
