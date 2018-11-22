import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Colors from "./../../assets/Colors";
import ImageButton from "./../ImageButton";

class TextInputFooter extends Component {
  state = {
    text: "",
    optionIconNameList: [
      "nothing_option_unclicked",
      "joy_option_unclicked",
      "trust_option_unclicked",
      "fear_option_unclicked",
      "surprise_option_unclicked",
      "anticipation_option_unclicked",
      "anger_option_unclicked",
      "disgust_option_unclicked",
      "sadness_option_unclicked"
    ],
    selectedIconName: "",
    height: 0
  };

  handleOptionSelect = selectedImageName => {
    const optionIconNameListOrigin = [
      "nothing",
      "joy",
      "trust",
      "fear",
      "surprise",
      "anticipation",
      "anger",
      "disgust",
      "sadness"
    ];
    const newList = optionIconNameListOrigin.map(iconName =>
      iconName == selectedImageName.split("_")[0]
        ? `${iconName}_option_clicked`
        : `${iconName}_option_unclicked`
    );
    this.setState({
      optionIconNameList: newList,
      selectedIconName: `${selectedImageName.split("_")[0]}_option_clicked`
    });
  };

  renderIconOptionBox = isMyLog => (
    <View style={styles.iconOptionBoxContainer}>
      <Text style={styles.iconOptionBoxText}>
        {isMyLog
          ? "Choose your emotion"
          : "당신이 위의 상황이라면 어떤 감정을 느꼈을까요?"}
      </Text>
      <View style={styles.iconOptionBox}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between"
          }}
          horizontal={true}
        >
          {this.state.optionIconNameList.map((iconName, index) => (
            <ImageButton
              key={index}
              boxWidth={"18"}
              imageWidth={"14"}
              imageName={iconName}
              onPress={this.handleOptionSelect}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );

  render() {
    const { onPress, isIconOptionBox, isMyLog } = this.props;
    const textInputBoxOffset = 10;
    const textInputMaxHeight = hp("15%");
    const textInputMinHeight = TextInputHeight;
    const height = this.state.height;
    // console.log("In TextInputFooter height:", height);
    console.log("TextInput: ", Dimensions.get("window").height, hp("100%"));
    return (
      <View
        onLayout={event => {
          var { x, y, width, height } = event.nativeEvent.layout;
          console.log(
            "ref={ref => (this.scrollView = ref): ",
            x,
            y,
            width,
            height
          );
        }}
      >
        {isIconOptionBox ? this.renderIconOptionBox(isMyLog) : null}
        <View
          style={{
            maxHeight: textInputMaxHeight + textInputBoxOffset,
            minHeight: textInputMinHeight + textInputBoxOffset
          }}
        >
          <View
            style={{
              width: wp("100%"),
              height: height + textInputBoxOffset,
              minHeight: textInputMinHeight + textInputBoxOffset,
              maxHeight: textInputMaxHeight + textInputBoxOffset,
              backgroundColor: Colors.headerGrey,
              alignItems: "center",
              // flex: 1,
              flexDirection: "row",
              justifyContent: "space-around"
            }}
          >
            <View
              style={{
                width: wp("80%"),
                height: height,
                minHeight: textInputMinHeight,
                backgroundColor: Colors.white,
                maxHeight: textInputMaxHeight,
                marginLeft: wp("1%"),
                borderRadius: 15,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TextInput
                style={{
                  width: wp("75%"),
                  height: height,
                  minHeight: textInputMinHeight,
                  paddingRight: 10,
                  borderRadius: 15,
                  maxHeight: textInputMaxHeight,
                  marginLeft: 10,
                  fontSize: 15
                }}
                multiline={true}
                onChangeText={text => this.setState({ text })}
                onContentSizeChange={event => {
                  this.setState({
                    height: event.nativeEvent.contentSize.height
                  });
                }}
                value={this.state.text}
                underlineColorAndroid="transparent"
                placeholder="내용을 입력해주세요."
                placeholderTextColor={Colors.headerGrey}
                autoCapitalize="none"
              />
            </View>
            <View style={{ opacity: this.state.text ? 1 : 0.5 }}>
              <TouchableOpacity
                disabled={this.state.text ? false : true}
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
                  // console.log("In TextInputFooter state before onPress:", this.state);
                  onPress(
                    "user",
                    this.state.text,
                    this.state.selectedIconName,
                    isMyLog
                  );
                  // console.log("In TextInputFooter state after onPress:", this.state);
                  this.setState({
                    text: "",
                    optionIconNameList: [
                      "nothing_option_unclicked",
                      "joy_option_unclicked",
                      "trust_option_unclicked",
                      "fear_option_unclicked",
                      "surprise_option_unclicked",
                      "anticipation_option_unclicked",
                      "anger_option_unclicked",
                      "disgust_option_unclicked",
                      "sadness_option_unclicked"
                    ],
                    selectedIconName: ""
                  });
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: "bold",
                    textAlign: "center",
                    textAlignVertical: "center"
                  }}
                >
                  전송
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const IconOptionBoxTitleTextSize = 16;
const IconOptionBoxTitleBoxSize = 2 * IconOptionBoxTitleTextSize;
const TextInputBoxHeight = 44;
const TextInputHeight = TextInputBoxHeight * 0.8;

const styles = StyleSheet.create({
  container: {},
  iconOptionBoxContainer: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderTopWidth: 2.5,
    borderTopColor: Colors.headerGrey,
    // flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  iconOptionBox: {
    width: wp("100%"),
    height: 60,
    marginTop: 8
    // alignItems: "center",
    // // flex: 1,
    // flexDirection: "row",
    // justifyContent: "space-between"
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
