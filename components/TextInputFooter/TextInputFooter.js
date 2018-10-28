import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Colors from "./../../assets/Colors";
import ImageButton from "./../ImageButton";

const optionIconNameList = ["sogood", "good", "soso", "bad", "sobad"];

class TextInputFooter extends Component {
  state = {
    text: ""
  };

  renderIconOptionBox = (iconNameList, isMyLog) => (
    // console.log("In TextInputFooter renderIconOptionBox iconNameList:", iconNameList);
    <View style={styles.iconOptionBoxContainer}>
      <Text style={styles.iconOptionBoxText}>
        {isMyLog ? "Choose your emotion" : "How about your thought?"}
      </Text>
      <View style={styles.iconOptionBox}>
        {iconNameList.map(iconName => (
          <ImageButton
            boxWidth={"20"}
            imageWidth={"15"}
            imageName={iconName}
            isOption={true}
            // onPress={this.examplePress}
          />
        ))}
      </View>
    </View>
  );

  render() {
    const { onPress, isIconOptionBox, isMyLog } = this.props;
    // console.log("In TextInputFooter isIconOptionBox:", isIconOptionBox);

    return (
      <View>
        {isIconOptionBox
          ? this.renderIconOptionBox(optionIconNameList, isMyLog)
          : null}
        <View style={styles.container}>
          <View
            style={{
              height: "auto",
              height: TextInputHeight,
              backgroundColor: Colors.white,
              borderRadius: 15,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TextInput
              style={{
                width: wp("80%"),
                marginLeft: 10,
                fontSize: 20
              }}
              onChangeText={text => this.setState({ text })}
              value={this.state.text}
              underlineColorAndroid="transparent"
              placeholder="Type your answer"
              placeholderTextColor={Colors.headerGrey}
              autoCapitalize="none"
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                width: wp("15%"),
                height: TextInputHeight,
                backgroundColor: Colors.chatElementGrey,
                borderRadius: 10,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={() => {
                onPress("user", this.state.text);
                // console.log("In TextInputFooter state after onPress:", this.state);
                this.setState({ text: "" });
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  textAlignVertical: "center"
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const IconOptionBoxTitleTextSize = 20;
const IconOptionBoxTitleBoxSize = 2*IconOptionBoxTitleTextSize;
const TextInputBoxHeight = 55;
const TextInputHeight = TextInputBoxHeight * 0.8;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    height: TextInputBoxHeight,
    backgroundColor: Colors.headerGrey,
    alignItems: "center",
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  iconOptionBoxContainer : {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderTopWidth: 2.5,
    borderTopColor: Colors.headerGrey,
    // flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  iconOptionBox: {
    height: 80,
    alignItems: "center",
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  iconOptionBoxText: {
    fontSize: IconOptionBoxTitleTextSize,
    fontWeight: "bold",
    color: Colors.headerGrey,
    height: IconOptionBoxTitleBoxSize,
    textAlignVertical: "center"
  }
});

export default TextInputFooter;
