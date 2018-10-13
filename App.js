import React from 'react';
import { StyleSheet } from 'react-native';
import fb from './utils/firebase';

export default class App extends React.Component {
  constructor() {
    super();
    fb.init();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
});
