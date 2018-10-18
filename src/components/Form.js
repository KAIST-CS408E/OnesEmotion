import React from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { StackNavigator } from 'react-navigation';

export default class Form extends React.Component {

  render() {
    return (
      <View style={styles.formContainer}>
        <TextInput
          placeholder='Eamil'
          placeholderTextColor='#292929'
          style={styles.textInput}
          underlineColorAndroid={'transparent'}/>

        <TextInput
          placeholder='Password'
          placeholderTextColor='#292929'
          secureTextEntry={true}
          style={styles.textInput}
          underlineColorAndroid={'transparent'}/>

        <TouchableOpacity style={styles.button1}>
          <Text style={styles.btntext}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button2}>
          <Text style={styles.btntext}>Sign up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formContainer: {
    alignSelf: 'stretch',
    paddingLeft: 20,
    paddingRight: 20,
  },
  textInput: {
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  button1: {
    alignSelf: 'stretch',
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    padding: 20,
  },
  button2: {
    alignSelf: 'stretch',
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    padding: 20,
  },
  btntext: {
    color: '#fff',
    fontSize: 20,
  }
});
