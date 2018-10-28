import React, { Component } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Colors from "./../../assets/Colors";
import Icons from "./../../assets/Icons";

class ImageButton extends Component {
  state = {
    clicked: false
  };

  handleOptionClick = () => {
    // console.log(
    //   "In ImageButton handleOptionClick this.state.clicked:",
    //   this.state.clicked
    // );
    this.setState({ clicked: !this.state.clicked });
  };

  render() {
    const { boxWidth, imageWidth, imageName, onPress, isOption } = this.props;
    // console.log("In ImageButton isOption:", isOption);
    // console.log("In ImageButton imageName:", imageName);

    const boxWidthApplyed = boxWidth ? boxWidth : "20";
    const imageNameFixed = isOption
      ? this.state.clicked
        ? `${imageName}_option_clicked`
        : `${imageName}_option_unclicked`
      : imageName;
    // console.log("In ImageButton imageNameFixed:", imageNameFixed);

    return (
      <View
        style={{
          width: wp(`${boxWidthApplyed}%`),
          height: "auto",
          alignItems: "center"
        }}
      >
        {onPress||isOption ? (
          <TouchableOpacity
            onPress={isOption ? this.handleOptionClick : onPress}
          >
            <Image
              style={{
                width: wp(`${imageWidth}`),
                height: wp(`${imageWidth}`)
              }}
              source={Icons(imageNameFixed)}
            />
          </TouchableOpacity>
        ) : (
          <View>
            <View style={styles.imageBox}>
              <Image
                style={{
                  width: wp(`${imageWidth}`),
                  height: wp(`${imageWidth}`)
                }}
                source={Icons(imageNameFixed)}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageBox: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default ImageButton;
