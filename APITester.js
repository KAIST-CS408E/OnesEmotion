import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import api from './utils/firebaseWrapper.js';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      signupResult: {},
      loginResult: {},
      userId: null,
      name: null,
      chatId: null,
      allChats: []
    }
    this.test = this.test.bind(this);
  }

  componentDidMount() {
    this.test()
  }

  test = async () => {
    try {
      // const signupResult = await api.signup("김현수", "kimhsoo02@hotmail.net", "123456");
      const loginResult = await api.login("kimhsoo02@hotmail.net", "123456");
      const {userId, name} = await api.getUser();
      const allStories = await api.getAllStories();
      const {chatId} = allStories[0];
      await api.leaveAComment(userId, chatId, "댓글 테스트", "emotion:sad");
      const story = await api.getAStory(chatId);
      console.log(story);
      this.setState({
        // signupResult,
        // loginResult,
        // userId,
        // name,
        // chatId,
      });
    } catch (e) {
      console.log(e.toString());
    }
  }

  render() {
    const {signupResult, loginResult, userId, name, chatId} = this.state;
    // const testChat = allChats.length > 0 ? allChats[0] : null;
    // let testMsg;
    // if (testChat) {
    //   testMsg = testChat.msgs[0].content
    // } else {
    //   testMsg = "NULL"
    // }
    return (
      <View style={styles.container}>
        <Text>signupResult: {signupResult.toString()}</Text>
        <Text>loginResult: {loginResult.toString()}</Text>
        <Text>userId: {userId}</Text>
        <Text>name: {name}</Text>
        <Text>chatId: {chatId}</Text>
        {/* <Text>msg: {testMsg}</Text> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
});
