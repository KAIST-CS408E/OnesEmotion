// import * as firebase from 'firebase';
const firebase = require("firebase");
require("firebase/firestore");

import { FIREBASE_APP_NAME, FIREBASE_API_KEY, FIREBASE_SENDER_ID } from './firebaseConfigs';

firebase.initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: `${FIREBASE_APP_NAME}.firebaseapp.com`,
  databaseURL: `https://${FIREBASE_APP_NAME}.firebaseio.com`,
  projectId: FIREBASE_APP_NAME,
  storageBucket: `${FIREBASE_APP_NAME}.appspot.com`,
  messagingSenderId: FIREBASE_SENDER_ID
});
const auth = firebase.auth()
const db = firebase.firestore()
db.settings({
  timestampsInSnapshots: true
})

export default api = {
  signup: async function (name, email, password) {
    try {
      const user = await auth.createUserWithEmailAndPassword(email, password);
      await user.updateProfile({
        displayName: name
      })
      await db.collection('users').doc(user.uid).set({
        email: email,
        name: name,
        createdAt: new Date()
      })
      return {
        userId: user.uid,
        name: name
      }
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  login: async function (email, password) {
    try {
      const user = await auth.signInWithEmailAndPassword(email, password);
      if (!user) {
        return null
      }
      return {
        userId: user.uid,
        name: user.displayName
      }
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  logout: async function () {
    try {
      return auth.signOut();
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  getUser: async function () {
    try {
      const user = auth.currentUser;
      return {
        userId: user.uid,
        name: user.displayName
      }
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  createChat: async function (userId) {
    try {
      const chat = await db.collection('chats').add({
        userId: userId,
        createdAt: new Date()
      });
      const chatId = chat.id;
      await db.collection('users').doc(userId).collection('chats').doc(chatId).set({})
      return chatId
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  removeChat: async function (chatId) {
    try {
      return db.collection('chats').doc(chatId).delete()
    } catch (e) {
      console.log(e.toString())
      return null
    }
  },
  sendMsg: async function (userId, chatId, content) {
    try {
      return db.collection('chats').doc(chatId).collection('msgs').add({
        userId: userId,
        content: content,
        createdAt: new Date()
      });
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  sendEmotion: async function (userId, chatId, emotion) {
    try {
      await db.collection('chats').doc(chatId).update({
        userEmotion: emotion
      });
      return db.collection('chats').doc(chatId).collection('msgs').add({
        userId: userId,
        content: emotion,
        createdAt: new Date()
      });
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  getAllChats: async function (userId) {
    try {
      const allChatIds = [];
      const chatList = await db.collection('users').doc(userId).collection('chats').get()
      chatList.forEach((chat) => {
        allChatIds.push(chat.id);
      })
      const allChats = [];
      await Promise.all(allChatIds.map(async (chatId) => {
        const msgs = await db.collection('chats').doc(chatId).collection('msgs').get()
        const msgList = [];
        msgs.forEach((msg) => {
          msgList.push(msg.data())
        });
        const chatInfoDoc = await db.collection('chats').doc(chatId).get()
        const chatInfo = chatInfoDoc.data();
        allChats.push({
          chatId: chatId,
          userId: chatInfo.userId,
          createdAt: chatInfo.createdAt,
          messages: msgList
        });
      }));
      return allChats;
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  getAChat: async function (chatId) {
    try {
      const msgs = await db.collection('chats').doc(chatId).collection('msgs').get()
      const msgList = [];
      msgs.forEach((msg) => {
        msgList.push(msg.data())
      });
      const chatInfoDoc = await db.collection('chats').doc(chatId).get()
      const chatInfo = chatInfoDoc.data();
      return {
        chatId: chatId,
        userId: chatInfo.userId,
        createdAt: chatInfo.createdAt,
        messages: msgList
      }
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  getAllStories: async function (userId) {
    try {
      const allStoryIds = [];
      const storyList = await db.collection('chats').get()
      storyList.forEach((chat) => {
        allStoryIds.push(chat.id);
      })
      const allStories = [];
      await Promise.all(allStoryIds.map(async (chatId) => {
        const msgs = await db.collection('chats').doc(chatId).collection('msgs').get()
        const msgList = [];
        msgs.forEach((msg) => {
          msgList.push(msg.data())
        });
        const comments = await db.collection('chats').doc(chatId).collection('comments').get()
        const commentList = [];
        comments.forEach((comment) => {
          commentList.push(comment.data())
        });
        const chatInfoDoc = await db.collection('chats').doc(chatId).get()
        const chatInfo = chatInfoDoc.data();
        allStories.push({
          chatId: chatId,
          userId: chatInfo.userId,
          createdAt: chatInfo.createdAt,
          messages: msgList,
          comments: commentList
        });
      }));
      return allStories;
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  getAStory: async function (chatId) {
    try {
      const msgs = await db.collection('chats').doc(chatId).collection('msgs').get()
      const msgList = [];
      msgs.forEach((msg) => {
        msgList.push(msg.data())
      });
      const comments = await db.collection('chats').doc(chatId).collection('comments').get()
      const commentList = [];
      comments.forEach((comment) => {
        commentList.push(comment.data())
      });
      const chatInfoDoc = await db.collection('chats').doc(chatId).get()
      const chatInfo = chatInfoDoc.data();
      return {
        chatId: chatId,
        userId: chatInfo.userId,
        createdAt: chatInfo.createdAt,
        messages: msgList,
        comments: commentList
      }
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  leaveAComment: async function (userId, chatId, content, emotion) {
    try {
      return db.collection('chats').doc(chatId).collection('comments').add({
        userId: userId,
        content: content,
        emotion: emotion,
        like: 0,
        report: 0,
        createdAt: new Date()
      });
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  }
}