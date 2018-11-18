import React from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  StatusBar,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';

import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerActions
} from "react-navigation";

import Logo from './Logo';
import Form from './Form';
import fb from '../../utils/firebaseWrapper';

import getGirlIcon from "../../assets/Icons/getGirlIcon";
import getManIcon from "../../assets/Icons/getManIcon";

export default class Signup extends React.Component {

  goBack(){
    Actions.pop();
  }

  state = {
    username: '',
    email: '',
    password: '',
    gender: '',
    usericon: ''
  }

  signup = async () => {
    try {
      const {username, email, password, gender} = this.state;
      var usericon;
      if (gender == 'female') {
        usericon = getGirlIcon()
        this.setState({usericon: usericon})
      }else {
        usericon = getManIcon()
        this.setState({usericon: getManIcon()})
      }
      const {error} = await fb.signup(username, email, password, gender, usericon);
      let message;
      if (error) {
        switch (error) {
          case 'auth/email-already-in-use':
          message = "이미 사용 중인 이메일 입니다.";
          break;
          case 'auth/invalid-email':
          message = "유효하지 않은 이메일 입니다.";
          break;
          case 'auth/operation-not-allowed':
          message = "사용할 수 없는 정보입니다.";
          break;
          case 'auth/weak-password':
          message = "위험한 비밀번호입니다. 6자 이상 입력해주세요."
          break;
          default:
          message = "유효하지 않은 정보입니다.";
        }
        ToastAndroid.show(message, ToastAndroid.LONG);
        return;
      }
      this.props.navigation.navigate("Story")
    } catch (e) {
      console.log(e);
      return
    }
  }

  handleTextChange = (field, value) => {
    const obj = {};
    obj[field] = value;
    this.setState(obj);
  }

	render() {
    const {username, email, password, gender} = this.state;
		return(
				<View style={styles.container}>
					<Logo/>
					<Form type="Signup" handleTextChange={this.handleTextChange} form={{username, email, password, gender}}/>
          <TouchableOpacity style={styles.button} onPress={this.signup}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
					<View style={styles.signupTextCont}>
						<Text style={styles.signupText}>Already have an account? </Text>
						<TouchableOpacity onPress={() => this.props.navigation.goBack()}><Text style={styles.signupButton}>Sign in</Text></TouchableOpacity>
					</View>
				</View>
			)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textstyle: {
    color:'#ffffff',
    fontSize:18,
  },
  signupTextCont: {
  	flexGrow: 1,
  	alignItems: 'flex-end',
  	justifyContent: 'center',
  	paddingVertical: 15,
  	flexDirection: 'row'
  },
  signupText: {
  	color: 'rgba(255, 255, 255, 0.7)',
  	fontSize: 16
  },
  signupButton: {
  	color: '#ffffff',
  	fontSize: 16,
  	fontWeight: '500'
  },
  button: {
    width: 300,
    backgroundColor: '#BDBDBD',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: 'black',
    textAlign: 'center'
  }
});




