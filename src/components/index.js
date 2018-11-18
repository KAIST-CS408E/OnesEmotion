import React, {Component} from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native';

import {StackNavigator} from 'react-navigation';
import Login from './Login';
import Signup from './Signup';

const Screens = StackNavigator({
	Login1: {screen: Login},
	Signup1: {screen: Signup},
});

export default Screens;