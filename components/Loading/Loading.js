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
        <View style={styles.wrapper}>
          <View>
            <ImageBackground
              source={Images("loading")}
              style={styles.backgroundImage}
            >
            </ImageBackground>
          </View>
        </View>
      </View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height:hp("80%")
  },
  wrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: 'center',
  },
  backgroundImage: {
    height: 200,
    width: 200
  }
});

export default Loading;