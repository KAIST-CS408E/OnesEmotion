import * as firebase from 'firebase';

import { FIREBASE_APP_NAME, FIREBASE_API_KEY, FIREBASE_SENDER_ID } from '../config';

auth = firebase.auth()
db = firebase.database()

export default fb = {
  init: function () {
    firebase.initializeApp({
      apiKey: FIREBASE_API_KEY,
      authDomain: `${FIREBASE_APP_NAME}.firebaseapp.com`,
      databaseURL: `https://${FIREBASE_APP_NAME}.firebaseio.com`,
      projectId: FIREBASE_APP_NAME,
      storageBucket: `${FIREBASE_APP_NAME}.appspot.com`,
      messagingSenderId: FIREBASE_SENDER_ID
    });
  },
  signup: async function (name, email, password) {
    try {
      const user = await auth.createUserWithEmailAndPassword(email, password);
      await db.ref(`/users/${user.uid}`).set({
        chats: []
      })
      console.log('user', user);
      await user.updateProfile({
        name: name
      });
      return {
        userId: user.uid,
        name: name
      }
    } catch (e) {
      console.log(e.toString());
    }
  },
  login: async function (email, password) {
    try {
      const user = await auth.signInWithEmailAndPassword(email, password);
      console.log('user', user);
      if (!user) {
        return null
      }
      return {
        userId: user.uid,
        name: user.name
      }
    } catch (e) {
      console.log(e.toString());
    }
  },
  logout: async function () {
    try {
      return auth.signOut();
    } catch (e) {
      console.log(e.toString());
    }
  },
  getUser: async function () {
    try {
      const user = auth.currentUser;
      console.log('user', user);
      return {
        userId: user.uid,
        name: user.name
      }
    } catch (e) {
      console.log(e.toString());
    }
  },
  createChat: async function (userId) {
    try {
      const chatObj = db.ref(`/chats`).push();
      const chatId = chatObj.key();
      await chatObj.set({
        userId: userId,
        datetime: new Date(),
        msgs: []
      })
      await db.ref(`/users/${userId}/chats`).push(chatId)
      return chatId
    } catch (e) {
      console.log(e.toString());
    }
  },
  sendMsg: async function (userId, chatId, content) {
    try {
      return db.ref(`/chats/${chatId}/msgs`).push().set({
        userId: userId,
        content: content,
        datetime: new Date()
      });
    } catch (e) {
      console.log(e.toString());
    }
  },
  getAllChats: async function (userId) {
    try {
      const allChats = [];
      const chatList = await db.ref(`/users/${userId}/chats`).once('value');
      chatList.forEach((chat) => {
        allChats.push(chat.val());
      });
      return allChats;
    } catch (e) {
      console.log(e.toString());
    }
  },
  getAChat: async function (chatId) {
    try {
      return db.ref(`/chats/${chatId}`).once('value');
    } catch (e) {
      console.log(e.toString());
    }
  },
  getAllStories: async function (userId) {
    try {
      const allStories = [];
      return db.ref(`/chats`).once('value');
      allStories.forEach((story) => {
        allStories.push(story.val());
      });
      return allStories;
    } catch (e) {
      console.log(e.toSring());
    }
  },
  getAStory: async function (chatId) {
    try {
      return db.ref(`/chats/${chatId}`).once('value');
    } catch (e) {
      console.log(e.toString());
    }
  },
  leaveACmnt: async function (userId, chatId, content) {
    try {
      return db.ref(`/chats/${chatId}/msgs`).push().set({
        userId: userId,
        content: content,
        datetime: new Date()
      });
    } catch (e) {
      console.log(e.toString());
    }
  }
}