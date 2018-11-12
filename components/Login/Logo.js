import React from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  Image
} from 'react-native';
import Icons from "./../../assets/Icons";

export default class Logo extends React.Component {
	render() {
		return(
			<View style={styles.container}>
				<Image style={{width: 40, height: 70}}
					source={Icons("Logo")}/>
				<Text style={styles.logoText}>One's Emotion</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent:'flex-end',
    alignItems: 'center',
  },
  logoText: {
  	marginVertical: 15,
  	fontSize: 18,
  	color: 'rgba(255, 255, 255, 0.7)'
  }
});