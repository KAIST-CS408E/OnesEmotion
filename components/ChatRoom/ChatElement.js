import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Colors from "./../../assets/Colors";
import Icons from "./../../assets/Icons";

class ChatElement extends Component {
  render() {
    const { speaker, text } = this.props;
    const isBot = speaker == "bot";
    const profileSize = 40;
    const profileBoxSize = 50;
    const textSize = 18;
    const textBoxMaxWidth = wp("70%");
    const marginBetweenPrfileAndText = 0;

    return (
      <View>
        {isBot ? (
          <View style={styles.botChat}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <View
                style={{
                  width: profileBoxSize,
                  height: profileBoxSize,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  style={{ width: profileSize, height: profileSize }}
                  source={Icons("bot")}
                />
              </View>
              <View
                style={{
                  maxWidth: textBoxMaxWidth,
                  height: "auto",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                  marginLeft: marginBetweenPrfileAndText,
                }}
              >
                <Text
                  style={{
                    fontSize: textSize,
                    color: Colors.white,
                    backgroundColor: Colors.chatElementGrey,
                    padding: 5,
                    borderRadius: 10
                  }}
                >
                  {text}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.userChat}>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  maxWidth: textBoxMaxWidth,
                  height: "auto",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                  marginRight: marginBetweenPrfileAndText,
                }}
              >
                <Text
                  style={{
                    fontSize: textSize,
                    color: Colors.black,
                    backgroundColor: Colors.white,
                    padding: 5,
                    borderRadius: 10
                  }}
                >
                  {text}
                </Text>
              </View>
              <View
                style={{
                  width: profileBoxSize,
                  height: profileBoxSize,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  style={{ width: profileSize, height: profileSize }}
                  source={Icons("user")}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const marginBetweenElements = 5;

const styles = StyleSheet.create({
  botChat: {
    // flex: 1,
    marginTop: marginBetweenElements,
    marginBottom: marginBetweenElements,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  userChat: {
    // flex: 1,
    marginTop: marginBetweenElements,
    marginBottom: marginBetweenElements,
    flexDirection: "row",
    justifyContent: "flex-end"
  }
});

export default ChatElement;
