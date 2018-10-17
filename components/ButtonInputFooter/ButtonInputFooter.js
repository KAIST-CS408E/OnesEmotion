import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Colors from "./../../assets/Colors";

class TextInputFooter extends Component {
  state = {
    text: "Type your answer"
  };

  render() {
    const { onPress } = this.props; // onPress에서 반드시 yes, no 둘중 뭐를 체크한건지 param으로 받아오도록 해야함.
    return (
      <View style={styles.container}>
        <View style={{marginLeft: wp("5%")}}>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.text}>Yes, please</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginRight: wp("5%")}}>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.text}>No, thanks</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    height: 100,
    marginTop: 10,
    backgroundColor: Colors.headerGrey,
    alignItems: "center",
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  text: {
    width: wp("40%"),
    height: 60,
    fontSize: 23,
    padding: 10,
    fontWeight: "bold",
    backgroundColor: Colors.white,
    color: Colors.chatElementGrey,
    borderRadius: 10,
    textAlign: "center",
    textAlignVertical: "center"
  }
});

export default TextInputFooter;
