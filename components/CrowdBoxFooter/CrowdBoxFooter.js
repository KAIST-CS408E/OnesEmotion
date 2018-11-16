import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import ChatElement from "./../ChatRoom/ChatElement";
import Colors from "./../../assets/Colors";

class CrowdBoxFooter extends Component {
  state = {
    crowdBoxDialog: [
      {
        speaker: "bot",
        text: "Calm down! Why don’t you talk to your friend?",
        profileImageName: "anticipation_option_clicked"
      },
      {
        speaker: "bot",
        text:
          "Well.. how about talking to your friend if you are still disappointed?",
        profileImageName: "fear_option_clicked"
      },
      {
        speaker: "bot",
        text:
          "Well.. how about talking to your friend if you are still disappointed?",
        profileImageName: "fear_option_clicked"
      }
    ]
  };

  render() {
    const { userInputDialog, isCrowdBox, onPress } = this.props; // onPress에서 반드시 yes, no 둘중 뭐를 체크한건지 param으로 받아오도록 해야함.
    // console.log("In CrowdBoxFooter userInputDialog elems: ", userInputDialog);
    // console.log(
    //   "In CrowdBoxFooter userInputDialog elems: ",
    //   userInputDialog.speaker,
    //   userInputDialog.text,
    //   userInputDialog.profileImageName
    // );
    const contentsTopBottomMargin = 8;

    return (
      <View style={styles.container}>
        <View style={styles.crowdBoxHeader}>
          <Text style={styles.crowdBoxHeaderText}>Crowd's thoughts</Text>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{
              width: wp("100%"),
              paddingBottom: contentsTopBottomMargin,
              paddingTop: contentsTopBottomMargin
            }}
            ref={ref => (this.scrollView = ref)}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
            }}
          >
            {this.state.crowdBoxDialog.map((dialog, index) => (
              <ChatElement
                key={index}
                speaker={dialog.speaker}
                text={dialog.text}
                profileImageName={dialog.profileImageName}
              />
            ))}
            {isCrowdBox ? null : (
              <ChatElement
                speaker={userInputDialog.speaker}
                text={userInputDialog.text}
                profileImageName={userInputDialog.profileImageName}
              />
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const crowdBoxHeaderText = 20;
const crowdBoxHeaderBox = 2 * crowdBoxHeaderText;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    height: hp("40%"),
    // marginTop: 10,
    backgroundColor: Colors.headerGrey,
    alignItems: "center",
    // flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  crowdBoxHeader: {
    width: wp("100%"),
    height: hp("7%"),
    backgroundColor: Colors.white,
    alignItems: "center",
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  crowdBoxHeaderText: {
    fontSize: crowdBoxHeaderText,
    fontWeight: "bold",
    color: Colors.headerGrey,
    height: crowdBoxHeaderBox,
    textAlignVertical: "center"
  }
});

export default CrowdBoxFooter;
