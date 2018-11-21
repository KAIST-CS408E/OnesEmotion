import React from "react";
import { StyleSheet, View, Image, ImageBackground } from "react-native";
import Images from "./../../assets/Images";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";


class Loading extends React.Component {
	render() {
		return (
			<View style={styles.container}>
        <ImageBackground
          source={Images("Loading")}
          style={styles.backgroundImage}
        >
        </ImageBackground>
      </View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    height: hp("80%"),
    zIndex: 2,
  },
  backgroundImage: {
    width: wp("100%"),
    height: hp("100%"),
  }
});

export default Loading;