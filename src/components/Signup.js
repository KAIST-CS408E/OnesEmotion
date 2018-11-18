import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  KeyboardAvoidingView,
  ImageBackground,
  Navigator
} from 'react-native';

import Form from './Form';

export default class Signup extends React.Component {
  render() {
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
        <ImageBackground style={styles.container} source={require('../img/bg.jpg')}>
          <Text style={styles.header}>Signup</Text>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
    width: null,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 38,
    color: '#212121',
    fontWeight: 'bold',
    marginBottom: 60,
  }
});
