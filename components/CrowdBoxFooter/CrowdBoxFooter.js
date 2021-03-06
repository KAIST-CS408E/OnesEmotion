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

import getManIcon from "./../../assets/Icons/getManIcon";

import fb from "../../utils/firebaseWrapper";

class CrowdBoxFooter extends Component {
  state = {
    crowdBoxDialog: [],
    notice: "댓글을 불러오는 중..",
    scrollViewHeight: CommentHeaderHeight
    // [
    //   {
    //     speaker: "bot",
    //     text: "바빠서 밥을 잘 챙기지 못하면 너무 비참해.. 간단히라도 꼭 먹어!",
    //     profileImageName: getManIcon(),
    //     crowdEmotion: "surprise_option_clicked"
    //   },
    //   {
    //     speaker: "bot",
    //     text: "너한테 화를 낼 필요는 전혀 없어! 자책하지는 말았으면 해!",
    //     profileImageName: getManIcon(),
    //     crowdEmotion: "surprise_option_clicked"
    //   },
    //   {
    //     speaker: "bot",
    //     text: "화나는 상황이긴하지만, 자책할 필요는 없어! 열심히 하고있잖아.",
    //     profileImageName: getManIcon(),
    //     crowdEmotion: "surprise_option_clicked"
    //   }
    // ]
  };
  // new comment info
  // speaker={userInputDialog.speaker}
  // text={userInputDialog.text}
  // profileImageName={userInputDialog.profileImageName}
  // crowdEmotion={userInputDialog.crowdEmotion}

  componentDidMount = () => {
    const { userId, chatId, userInputDialog, crowdBoxDialog } = this.props;
    // this.getCommentList(this.props.chatId); // load saved crowd comments
    // this.setState({ crowdBoxDialog: crowdBoxDialog });
    // if (userInputDialog && userInputDialog.crowdEmotion) {
    //   this.setNewComment(
    //     userId,
    //     chatId,
    //     userInputDialog.text,
    //     userInputDialog.crowdEmotion,
    //     userInputDialog.profileImageName
    //   );
    // }
    setTimeout(() => {
      const { crowdBoxDialog } = this.state;
      if (crowdBoxDialog.length != 0) {
        return;
      }
      this.setState({ notice: "아직 댓글이 없습니다." });
    }, 3000);
    this.getCommentList();
  };

  componentWillReceiveProps(nextProps) {
    const { crowdBoxDialog } = this.state;
    if (crowdBoxDialog.length > 0) {
      if (crowdBoxDialog && crowdBoxDialog.length != 0) {
        this.setState({ notice: "사람들의 댓글" });
      }
      return;
    }
    const { comments } = nextProps;
    const commentOfThisChat = comments;
    let thisCrowdBoxDialog = commentOfThisChat.map((commentObject, index) => ({
      speaker: commentObject.userId == this.props.userId ? "user" : "bot",
      text: commentObject.content,
      profileImageName: commentObject.profileImageName,
      crowdEmotion: commentObject.emotion
    }));
    this.props.isCrowdBox
      ? null
      : thisCrowdBoxDialog.push({
          speaker: "user",
          text: userInputDialog.text,
          profileImageName: userInputDialog.profileImageName,
          crowdEmotion: commentObject.emotion
        });
    this.setState({ crowdBoxDialog: thisCrowdBoxDialog });
    if (thisCrowdBoxDialog && thisCrowdBoxDialog.length != 0) {
      this.setState({ notice: "사람들의 댓글" });
    }
  }

  getCommentList = async () => {
    const { chatId } = this.props;
    if (!chatId) {
      return;
    }
    const { comments } = await fb.getAStory(chatId);
    const commentOfThisChat = comments;
    let thisCrowdBoxDialog = commentOfThisChat.map((commentObject, index) => ({
      speaker: commentObject.userId == this.props.userId ? "user" : "bot",
      text: commentObject.content,
      profileImageName: commentObject.profileImageName,
      crowdEmotion: commentObject.emotion
    }));
    this.props.isCrowdBox
      ? null
      : thisCrowdBoxDialog.push({
          speaker: "user",
          text: userInputDialog.text,
          profileImageName: userInputDialog.profileImageName,
          crowdEmotion: commentObject.emotion
        });
    this.setState({ crowdBoxDialog: thisCrowdBoxDialog });
    if (thisCrowdBoxDialog && thisCrowdBoxDialog.length != 0) {
      this.setState({ notice: "사람들의 댓글" });
    }
  };

  // setNewComment = (userId, chatId, content, emotion, profileImageName) => {
  //   fb.createComment(userId, chatId, content, emotion, profileImageName);
  // };

  render() {
    const { userInputDialog, isCrowdBox, onPress } = this.props; // onPress에서 반드시 yes, no 둘중 뭐를 체크한건지 param으로 받아오도록 해야함.
    const { notice } = this.state;
    // console.log("In CrowdBoxFooter userInputDialog elems: ", userInputDialog);
    // console.log(
    //   "In CrowdBoxFooter userInputDialog elems: ",
    //   userInputDialog.speaker,
    //   userInputDialog.text,
    //   userInputDialog.profileImageName
    // );
    console.log("scrollViewHeight:", this.state.scrollViewHeight);
    const contentsTopBottomMargin = 8;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.crowdBoxHeader}>
            <Text style={styles.crowdBoxHeaderText}>{notice}</Text>
          </View>
          <ScrollView
            style={{
              width: wp("100%"),
              paddingBottom: contentsTopBottomMargin,
              paddingTop: contentsTopBottomMargin
            }}
            ref={ref => (this.scrollView = ref)}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
              this.setState({
                scrollViewHeight:
                  contentHeight === 0 ? CommentHeaderHeight : contentHeight + 50
              });
              this.forceUpdate();
            }}
          >
            {this.state.crowdBoxDialog
              ? this.state.crowdBoxDialog.map((dialog, index) => (
                  <ChatElement
                    key={index}
                    speaker={dialog.speaker}
                    text={dialog.text}
                    profileImageName={dialog.profileImageName}
                    crowdEmotion={dialog.crowdEmotion}
                  />
                ))
              : null}
            {isCrowdBox ? null : (
              <ChatElement
                speaker={userInputDialog.speaker}
                text={userInputDialog.text}
                profileImageName={userInputDialog.profileImageName}
                crowdEmotion={userInputDialog.crowdEmotion}
              />
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const CommentHeaderHeight = hp("6%");
const crowdBoxHeaderText = 15;
const crowdBoxHeaderBox = 2 * crowdBoxHeaderText;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    maxHeight: hp("40%"),
    height: hp("35%"),
    // marginTop: 10,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    // flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  crowdBoxHeader: {
    width: wp("100%"),
    height: CommentHeaderHeight,
    backgroundColor: "#212121",
    alignItems: "center",
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    opacity: 0.7
  },
  crowdBoxHeaderText: {
    fontSize: crowdBoxHeaderText,
    fontWeight: "bold",
    color: "white",
    height: crowdBoxHeaderBox,
    textAlignVertical: "center"
  }
});

export default CrowdBoxFooter;
