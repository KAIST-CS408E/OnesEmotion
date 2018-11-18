import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import Form from './Form';

export default class Login extends React.Component {
  render() {
    const { navigate } = this.props.navigation;

    return (
      <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
        <ImageBackground style={styles.container} source={require('../img/bg.jpg')}>
          <Text style={styles.header}>OnesEmotion</Text>
          <Form />
          <TouchableOpacity onPress={() => navigate('Signup1')} style={styles.button2}>
            <Text style={styles.btntext}>Sign up</Text>
          </TouchableOpacity>
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
  },
  button2: {
    alignSelf: 'stretch',
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    padding: 20,
  }
});
