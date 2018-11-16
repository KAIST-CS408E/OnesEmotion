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

export default class Signup extends React.Component {

  goBack(){
    Actions.pop();
  }

  state = {
    username: '',
    email: '',
    password: ''
  }

  signup = () => {
    try {
      const {username, email, password} = this.state;
      fb.signup(username, email, password);
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
    const {username, email, password} = this.state;
		return(
				<View style={styles.container}>
					<Logo/>
					<Form type="Signup" handleTextChange={this.handleTextChange} form={{username, email, password}}/>
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