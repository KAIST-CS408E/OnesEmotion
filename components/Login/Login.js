import React from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  StatusBar,
  TouchableOpacity
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

  login = () => {
    try {
      const {email, password} = this.state;
      fb.login(email, password);
      this.props.navigation.navigate("Story")
    } catch (e) {
      console.log(e);
      throw e;
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