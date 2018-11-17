import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Colors from "./../../assets/Colors";
import ImageButton from "./../ImageButton";

class IconInputFooter extends Component {
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
      "sadness_option_unclicked",
    ],
    selectedIconName: ""
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
      "sadness",
    ];
    const newList = optionIconNameListOrigin.map(
      iconName =>
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
        {isMyLog ? "Choose your emotion" : "How about your thought?"}
      </Text>
      <View style={styles.iconOptionBox}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between"
          }}
          horizontal={true}
        >
          {this.state.optionIconNameList.map(iconName => (
            <ImageButton
              key={iconName}
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
    const { onPress, isMyLog } = this.props;
    // console.log("In IconInputFooter isIconOptionBox:", isIconOptionBox);
    const isDisabled = this.state.selectedIconName == "";

    return (
      <View>
        {this.renderIconOptionBox(isMyLog)}
        <View style={styles.container}>
          <View style={{ opacity: isDisabled ? 0.5 : 1 }}>
            <TouchableOpacity
              disabled={isDisabled ? true : false}
              style={{
                width: wp("99%"),
                height: TextInputHeight,
                backgroundColor: Colors.chatElementGrey,
                borderRadius: 10,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={() => {
                // console.log("In IconInputFooter state before onPress:", this.state);
                onPress("user", this.state.selectedIconName, isMyLog);
                // console.log("In IconInputFooter state after onPress:", this.state);
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
                    "sadness_option_unclicked",
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
const IconOptionBoxTitleBoxSize = 2 * IconOptionBoxTitleTextSize;
const TextInputBoxHeight = 44;
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
    height: 60
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

export default IconInputFooter;
