import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Colors from "./../../assets/Colors";
import Icons from "./../../assets/Icons";
import ImageButton from "../ImageButton";

class ChatElement extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.text !== this.props.text;
  }

  render() {
    const { speaker, text, profileImageName, isMyChat } = this.props;
    // console.log("In ChatElement isMyChat: ", isMyChat);
    const { crowdEmotion } = this.props;
    // console.log("In ChatElement profileImageName: ",profileImageName);
    // console.log("In ChatElement isMyChat: ", isMyChat);
    const isBot = speaker == "bot";
    const isUserIcon = speaker == "userIcon";
    const profileSize = 40;
    const profileBoxSize = 50;
    const textSize = 15;
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
                  source={Icons(profileImageName)}
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
                  marginLeft: marginBetweenPrfileAndText
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
              {crowdEmotion ? (
                <View
                  style={{
                    width: profileBoxSize,
                    height: profileBoxSize,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 5
                  }}
                >
                  <Image
                    style={{ width: profileSize, height: profileSize }}
                    source={Icons(crowdEmotion)}
                  />
                </View>
              ) : null}
            </View>
          </View>
        ) : (
          <View style={styles.userChat}>
            <View
              style={{
                flexDirection: "row"
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
                  paddingRight: isMyChat ? 10 : 5,
                  marginRight: marginBetweenPrfileAndText
                }}
              >
                {isUserIcon ? (
                  <View
                    style={{
                      backgroundColor: Colors.white,
                      padding: 5,
                      height: wp("20%"),
                      borderRadius: 10
                    }}
                  >
                    <ImageButton
                      boxWidth={"20"}
                      imageWidth={"15"}
                      imageName={text}
                    />
                  </View>
                ) : (
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
                )}
              </View>
              {!isMyChat ? (
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
                    source={Icons(profileImageName)}
                  />
                </View>
              ) : null}
            </View>
          </View>
        )}
      </View>
    );
  }
}

// <View
//   style={{
//     width: profileBoxSize,
//     height: profileBoxSize,
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center"
//   }}
// >
//   <Image
//     style={{ width: profileSize, height: profileSize }}
//     source={Icons(profileImageName)}
//   />
// </View>;

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
