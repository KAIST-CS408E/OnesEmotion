import React, { Component } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Colors from "./../../assets/Colors";
import Icons from "./../../assets/Icons";

class ImageButton extends Component {
  render() {
    const { boxWidth, imageWidth, imageName, onPress } = this.props;
    const boxWidthApplyed = boxWidth ? boxWidth : "20";
    return (
      <View
        style={{
          width: wp(`${boxWidthApplyed}%`),
          height: "auto",
          alignItems: "center"
        }}
      >
        {onPress ? (
          <TouchableOpacity onPress={onPress}>
            <Image
              style={{
                width: wp(`${imageWidth}`),
                height: wp(`${imageWidth}`)
              }}
              source={Icons(imageName)}
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
                source={Icons(imageName)}
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
