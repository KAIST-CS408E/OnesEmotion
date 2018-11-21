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

export default class Login extends React.Component {

  // signup() {
  //   Actions.signup()
  // }

  state = {
    email: '',
    password: ''
  }

  login = async () => {

    try {
      const {email, password} = this.state;
      const {error} = await fb.login(email, password);
      if (error) {
        let message;
        switch (error) {
          case 'auth/invalid-email':
          message = "유효하지 않은 이메일 입니다.";
          break;
          case 'auth/user-disabled':
          message = "비활성화된 계정입니다.";
          break;
          case 'auth/user-not-found':
          message = "존재 하지 않는 계정입니다.";
          break;
          case 'auth/wrong-password':
          message = "비밀번호가 다릅니다.";
          break;
          default:
          message = "유효하지 않은 계정입니다.";
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
    const {email, password} = this.state;
		return(
				<View style={styles.container}>
					<Logo/>
					<Form type="Login" handleTextChange={this.handleTextChange} form={{email, password}}/>
          <TouchableOpacity style={styles.button} onPress={this.login}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
					<View style={styles.signupTextCont}>
						<Text style={styles.signupText}>Don't have an account yet? </Text>
						<TouchableOpacity onPress={()=>this.props.navigation.navigate('Signup')}>
              <Text style={styles.signupButton}>Signup</Text>
            </TouchableOpacity>
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