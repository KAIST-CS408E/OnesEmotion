// import * as firebase from 'firebase';
const firebase = require("firebase");
require("firebase/firestore");

import { FIREBASE_APP_NAME, FIREBASE_API_KEY, FIREBASE_SENDER_ID } from '../configs/firebaseConfigs2';

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

var arrived = false
var userObject = null;
auth.onAuthStateChanged((user) => {
  console.log("READ");
  if (user) {
    arrived = true
    userObject = user;
  }
})

const chatIndexStore = {};

// 'api' functions (e.g. api.logout())
// For all functions, if they fail to run, return 'null'
export default api = {
  signup: async function (name, email, password, gender, usericon) {
    // INPUT
    // name: user's name
    // email: user's email
    // password: user's password
    // OUTPUT
    // Object {
    //   userId: user's identifier
    //   name: user's name
    // }
    try {
      const user = await auth.createUserWithEmailAndPassword(email, password);
      await user.updateProfile({
        displayName: name
      })
      console.log("READ");
      await db.collection('users').doc(user.uid).set({
        userId: user.uid,
        email: email,
        name: name,
        gender: gender,
        userIcon: usericon,
        createdAt: new Date()
      })
      userObject.uid = user.uid
      userObject.displayName = name
      userObject.gender = gender
      userObject.userIcon = usericon
      return {
        userId: user.uid,
        name: name
      }
    } catch (e) {
      console.log(e.toString());
      return {error: e.code};
    }
  },
  login: async function (email, password) {
    // INPUT
    // email: user's email
    // password: user's password
    // OUTPUT
    // Object {
    //   userId: user's identifier
    //   name: user's name
    // }
    try {
      const user = await auth.signInWithEmailAndPassword(email, password);
      if (!user) {
        return null
      }
      console.log("READ");
      const userDoc = await db.collection('users').doc(user.userId).get();
      const userInfo = userDoc.data()
      userObject.uid = userInfo.userId
      userObject.displayName = userInfo.name
      userObject.gender = userInfo.gender
      userObject.userIcon = userInfo.userIcon
      return {
        userId: user.uid,
        name: user.displayName
      }
    } catch (e) {
      console.log(e.toString());
      return {error: e.code};
    }
  },
  logout: async function () {
    // INPUT
    // null
    // OUTPUT
    // Object {}
    try {
      return auth.signOut();
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  getUser: function () {
    // INPUT
    // null
    // OUTPUT
    // Object {
    //   userId: user's identifier
    //   name: user's name
    // }
    try {
      const user = auth.currentUser;
      if (!user) {
        return null;
      }
      return {
        userId: user.uid,
        name: user.displayName,
        gender: userObject.gender,
        usericon: userObject.userIcon
      }
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  getUserInfo: async function () {
    try {
      const user = await this.isUserLoggedIn();
      if (!user) {
        return null;
      }
      const userDoc = await db.collection('users').doc(user.userId).get();
      const userInfo = userDoc.data()
      userObject.gender = userInfo.gender;
      userObject.userIcon = userInfo.userIcon;
      return {
        userId: userInfo.userId,
        name: userInfo.name,
        gender: userInfo.gender,
        usericon: userInfo.userIcon
      }
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  isUserLoggedIn: function () {
    return new Promise(function(resolve, reject) {
      setInterval(function() {
        if (arrived) {
          if (userObject) {
            resolve({
              userId: userObject.uid,
              name: userObject.displayName
            })
          } else {
            resolve(false)
          }
          return
        }
      }, 10);
    });
  },
  createChat: async function (userId, backgroundImage, state) {
    // INPUT
    // userId: user's identifier
    // OUTPUT
    // chatId: chatroom's identifier
    try {
      if (!userId) {
        userId = userObject.uid
      }
      let summary;
      if (state && state.currentDialog && state.currentDialog.length > 1) {
        summary = state.currentDialog[1].text;
      }
      let userEmotion;
      if (state && state.listOfEmotion) {
        userEmotion = state.listOfEmotion[state.listOfEmotion.length - 1] || null
      }
      const chat = await db.collection('chats').add({
        userId: userId,
        totalComments: 0,
        createdAt: new Date(),
        backgroundImage: backgroundImage,
        state,
        summary,
        userEmotion
      });
      const chatId = chat.id;
      // chatIndexStore[chatId] = 0;
      await db.collection('users').doc(userId).collection('chats').doc(chatId).set({})
      return chatId
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  updateChat: function (chatId, state) {
    return db.collection('chats').doc(chatId).update({
      state
    });
  },
  closeChat: function (chatId) {
    try {
      delete chatIndexStore[chatId];
      return db.collection('chats').doc(chatId).update({
        isFinished: true
      });
    } catch (e) {
      console.log(e.toString())
      return null;
    }
  },
  removeChat: function (chatId) {
    // INPUT
    // chatId: chatroom's identifier
    // OUTPUT
    // Object {}
    try {
      return db.collection('chats').doc(chatId).delete()
    } catch (e) {
      console.log(e.toString())
      return null
    }
  },
  createMessage: async function (userId, chatId, content, caching, state) {
    // INPUT
    // userId: user's identifier
    // chatId: chatroom's identifier
    // content: content of the message
    // OUTPUT
    // messageId : message's identifier
    try {
      // const stateObject = !state ? {summary} : {
      //   summary,
      //   currentQuestion: state.currentQuestion,
      //   nextQuestion: state.nextQuestion,
      //   listOfEmotion: state.listOfEmotion,
      //   isCrowdBox: state.isCrowdBox,
      //   isTextInput: state.isTextInput,
      //   isIconInput: state.isIconInput,
      //   isFinished: state.isFinished,
      //   isOnceAgained: state.isOnceAgained,
      //   visibleHeight: state.visibleHeight
      // };
      const stateObject = caching ? {summary:content} : {};
      if (state) {
        for (let key in state) {
          if (!state.hasOwnProperty(key))
            continue;
          stateObject[key] = state[key];
        }
      }
      await db.collection('chats').doc(chatId).update(stateObject);
      const doc = await db.collection('chats').doc(chatId).collection('msgs').add({
        userId: userId,
        index: chatIndexStore[chatId],
        content: content,
        createdAt: new Date()
      });
      chatIndexStore[chatId]++;
      return doc.id
    } catch (e) {
      console.log(e.toString());
      return null
    }
  },
  removeMessage: function (chatId, messageId) {
    // INPUT
    // chatId: chatroom's identifier
    // messageId: message's identifier
    // OUTPUT
    // Object {}
    try {
      return db.collection('chats').doc(chatId).collection('msgs').doc(messageId).delete()
    } catch (e) {
      console.log(e.toString());
      return null
    }
  },
  createEmotion: async function (userId, chatId, emotion, state) {
    // INPUT
    // userId: user's identifier
    // chatId: chatroom's identifier
    // emotion: unique name of the emotion
    // OUTPUT
    // Object {}
    try {
      const stateObject = {userEmotion: emotion};
      if (state) {
        for (let key in state) {
          if (!state.hasOwnProperty(key))
            continue;
          stateObject[key] = state[key];
        }
      }
      await db.collection('chats').doc(chatId).update(stateObject);
      const doc = await db.collection('chats').doc(chatId).collection('msgs').add({
        userId: userId,
        index: chatIndexStore[chatId],
        content: emotion,
        createdAt: new Date()
      });
      chatIndexStore[chatId]++;
      return doc.id
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  getAllChats: async function (userId) {
    // INPUT
    // userId: user's identifier
    // OUTPUT
    // Array [ Object {
    //  chatId: chatroom's identifier
    //  userId: user's identifier
    //  createdAt: chatroom's created datetime
    //  messages: Array [ Object {
    //              messageId: message's identifier
    //              userId: user's identifier
    //              content: content of the message
    //              createdAt: message's created datetime
    //            }, ...]
    // }, ...]
    try {
      if (!userId) {
        userId = userObject.uid
      }
      const allChatIds = [];
      console.log("READ");
      const chatList = await db.collection('users').doc(userId).collection('chats').get()
      chatList.forEach((chat) => {
        allChatIds.push(chat.id);
      })
      const allChats = await Promise.all(allChatIds.map(async (chatId) => {
        console.log("READ");
        const chatInfoDoc = await db.collection('chats').doc(chatId).get()
        const chatInfo = chatInfoDoc.data();
        if (!chatInfo) {
          return null;
        }
        return {
          chatId: chatId,
          userId: chatInfo.userId,
          summary: chatInfo.summary,
          userEmotion: chatInfo.userEmotion,
          othersEmotion: chatInfo.othersEmotion,
          backgroundImage: chatInfo.backgroundImage,
          createdAt: chatInfo.createdAt
        }
      }));
      allChats = allChats.filter((chat) => (chat !== null) && chat.userId);
      allChats.sort(this.orderByCreatedAt)
      return allChats;
    } catch (e) {
      console.log(e.toString());
      return [];
    }
  },
  getAChat: async function (chatId) {
    // INPUT
    // chatId: chatroom's identifier
    // OUTPUT
    // Object {
    //   chatId: chatroom's identifier
    //   userId: user's identifier
    //   createdAt: chatroom's created datetime
    //   messages: Array [ Object {
    //               messageId: message's identifier
    //               userId: user's identifier
    //               content: content of the message
    //               createdAt: message's created datetime
    //             }, ...]
    // }
    try {
      if (!chatId) {
        return null;
      }
      // console.log("READ");
      // const msgs = await db.collection('chats').doc(chatId).collection('msgs').get()
      // const msgList = [];
      // msgs.forEach((msg) => {
      //   message = msg.data()
      //   msgList.push({
      //     messageId: msg.id,
      //     userId: message.userId,
      //     createdAt: message.createdAt,
      //     content: message.content
      //   })
      // });
      // msgList.sort(this.orderByIndex);
      console.log("READ");
      const comments = await db.collection('chats').doc(chatId).collection('comments').orderBy("createdAt").get()
      const commentList = [];
      comments.forEach((comment) => {
        cmnt = comment.data()
        commentList.push({
          commentId: cmnt.id,
          userId: cmnt.userId,
          content: cmnt.content,
          emotion: cmnt.emotion,
          like: cmnt.like,
          report: cmnt.report,
          createdAt: cmnt.createdAt,
          profileImageName: cmnt.profileImageName,
        })
      });
      db.collection('chats').doc(chatId).update({
        totalComments: commentList.length
      });
      console.log("READ");
      const chatInfoDoc = await db.collection('chats').doc(chatId).get()
      const chatInfo = chatInfoDoc.data();
      return {
        chatId: chatId,
        userId: chatInfo.userId,
        userEmotion: chatInfo.userEmotion,
        othersEmotion: chatInfo.othersEmotion,
        state: chatInfo.state,
        createdAt: chatInfo.createdAt,
        comments: commentList
        // messages: msgList
      }
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  getAllStories: async function (userId) {
    // INPUT
    // userId: user's identifier
    // OUTPUT
    // Array [ Object {
    //  chatId: chatroom's identifier
    //  userId: user's identifier
    //  createdAt: chatroom's created datetime
    //  messages: Array [ Object {
    //              messageId: message's identifier
    //              userId: user's identifier
    //              content: content of the message
    //              createdAt: message's created datetime
    //            }, ...]
    //  comments: Array [ Object {
    //              commentId: comment's identifier
    //              userId: user's identifier
    //              content: content of the comment
    //              emotion: emotion of the comment
    //              like: like count
    //              report: report count
    //              createdAt: comment's created datetime
    //            }, ...]
    // }, ...]
    try {
      if (!userId) {
        userId = userObject.uid
      }
      const allStoryIds = [];
      console.log("READ");
      const storyList = await db.collection('chats').orderBy("createdAt", "desc").get()
      storyList.forEach((chat) => {
        const chatInfo = chat.data()
        if (chatInfo.userId == userId) {
          return;
        }
        if (chatInfo.state && !chatInfo.state.isFinished) {
          return;
        }
        if (chatInfo.state && chatInfo.state.buttonInputAns === "아니 괜찮아") {
          return;
        }
        allStoryIds.push(chat.id);
      })
      let allStories = await Promise.all(allStoryIds.map(async (chatId) => {
        console.log("READ");
        const chatInfoDoc = await db.collection('chats').doc(chatId).get()
        const chatInfo = chatInfoDoc.data();
        if (!chatInfo) {
          return null;
        }
        return {
          chatId: chatId,
          userId: chatInfo.userId,
          summary: chatInfo.summary,
          totalComments: chatInfo.totalComments,
          backgroundImage: chatInfo.backgroundImage,
          createdAt: chatInfo.createdAt
        }
      }));
      allStories = allStories.filter((chat) => (chat !== null) && chat.userId);
      // allStories.sort(this.orderByCreatedAt);
      return allStories;
    } catch (e) {
      console.log(e.toString());
      return [];
    }
  },
  getAStory: async function (chatId) {
    // INPUT
    // chatId: chatroom's identifier
    // OUTPUT
    // Object {
    //  chatId: chatroom's identifier
    //  userId: user's identifier
    //  createdAt: chatroom's created datetime
    //  messages: Array [ Object {
    //              messageId: message's identifier
    //              userId: user's identifier
    //              content: content of the message
    //              createdAt: message's created datetime
    //            }, ...]
    //  comments: Array [ Object {
    //              commentId: comment's identifier
    //              userId: user's identifier
    //              content: content of the comment
    //              emotion: emotion of the comment
    //              like: like count
    //              report: report count
    //              createdAt: comment's created datetime
    //              profileImageName: name of user's profile image
    //            }, ...]
    // }
    try {
      if (!chatId) {
        return null;
      }
      // console.log("READ");
      // const msgs = await db.collection('chats').doc(chatId).collection('msgs').get()
      // const msgList = [];
      // msgs.forEach((msg) => {
      //   message = msg.data()
      //   msgList.push({
      //     messageId: msg.id,
      //     userId: message.userId,
      //     createdAt: message.createdAt,
      //     content: message.content
      //   })
      // });
      // msgList.sort(this.orderByIndex);
      console.log("READ");
      const comments = await db.collection('chats').doc(chatId).collection('comments').orderBy("createdAt").get()
      const commentList = [];
      comments.forEach((comment) => {
        cmnt = comment.data()
        commentList.push({
          commentId: cmnt.id,
          userId: cmnt.userId,
          content: cmnt.content,
          emotion: cmnt.emotion,
          like: cmnt.like,
          report: cmnt.report,
          createdAt: cmnt.createdAt,
          profileImageName: cmnt.profileImageName,
        })
      });
      db.collection('chats').doc(chatId).update({
        totalComments: commentList.length
      });
      // commentList.sort(this.orderByCreatedAtDesc);
      console.log("READ");
      const chatInfoDoc = await db.collection('chats').doc(chatId).get()
      const chatInfo = chatInfoDoc.data();
      return {
        chatId: chatId,
        userId: chatInfo.userId,
        createdAt: chatInfo.createdAt,
        state: chatInfo.state,
        comments: commentList
      }
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  recommandStories: async function (userId) {
    // INPUT
    // userId: user's identifier
    // OUTPUT
    // Array [ Object {
    //  chatId: chatroom's identifier
    //  userId: user's identifier
    //  createdAt: chatroom's created datetime
    //  messages: Array [ Object {
    //              messageId: message's identifier
    //              userId: user's identifier
    //              content: content of the message
    //              createdAt: message's created datetime
    //            }, ...]
    //  comments: Array [ Object {
    //              commentId: comment's identifier
    //              userId: user's identifier
    //              content: content of the comment
    //              emotion: emotion of the comment
    //              like: like count
    //              report: report count
    //              createdAt: comment's created datetime
    //            }, ...]
    // }, ...]
    try {
      if (!userId) {
        userId = userObject.uid
      }
      const allStoryIds = [];
      console.log("READ");
      const storyList = await db.collection('chats').orderBy("createdAt", "desc").limit(20).get()
      storyList.forEach((chat) => {
        const chatInfo = chat.data()
        if (chatInfo.userId == userId) {
          return;
        }
        if (chat.totalComments > 0) {
          return;
        }
        if (chatInfo.state && !chatInfo.state.isFinished) {
          return;
        }
        if (chatInfo.state && chatInfo.state.buttonInputAns === "아니 괜찮아") {
          return;
        }
        allStoryIds.push(chat.id);
      })
      let allStories = await Promise.all(allStoryIds.map(async (chatId) => {
        console.log("READ");
        const chatInfoDoc = await db.collection('chats').doc(chatId).get()
        const chatInfo = chatInfoDoc.data();
        if (!chatInfo) {
          return null;
        }
        return {
          chatId: chatId,
          userId: chatInfo.userId,
          summary: chatInfo.summary,
          backgroundImage: chatInfo.backgroundImage,
          createdAt: chatInfo.createdAt,
        }
      }));
      allStories = allStories.filter((chat) => ((chat !== null) && chat.summary && chat.userId));
      // allStories.sort(this.orderByCreatedAt);
      return allStories.slice(0, 5);
    } catch (e) {
      console.log(e.toString());
      return []
    }
  },
  createComment: async function (userId, chatId, content, emotion, profileImageName) {
    // INPUT
    // userId: user's identifier
    // chatId: chatroom's identifier
    // content: content of the comment
    // emotion: emotion of the comment
    // profileImageName: name of user's profile image
    // OUTPUT
    // commentId
    try {
      if (!chatId) {
        return;
      }
      if (!userId) {
        userId = userObject.uid
      }
      await db.collection('chats').doc(chatId).update({
        othersEmotion: emotion
      });
      const doc = await db.collection('chats').doc(chatId).collection('comments').add({
        userId: userId,
        content: content,
        emotion: emotion,
        like: 0,
        report: 0,
        createdAt: new Date(),
        profileImageName: profileImageName
      });
      return doc.id
    } catch (e) {
      console.log(e.toString());
      return null;
    }
  },
  removeComment: async function (chatId, commentId) {
    // INPUT
    // chatId: chatroom's identifier
    // commentId: comment's identifier
    // OUTPUT
    // Object {}
    try {
      return db.collection('chats').doc(chatId).collection('comments').doc(commentId).delete()
    } catch (e) {
      console.log(e.toString());
      return null
    } 
  },
  likeComment: async function (chatId, commentId) {
    // INPUT
    // chatId: chatroom's identifier
    // commentId: comment's identifier
    // OUTPUT
    // Object {}
    try {
      console.log("READ");
      const commentDoc = await db.collection('chats').doc(chatId).collection('comments').doc(commentId).get()
      const commentInfo = commentDoc.data()
      return db.collection('chats').doc(chatId).collection('comments').doc(commentId).update({
        like: commentInfo.like + 1
      })
    } catch (e) {
      console.log(e.toString());
      return null
    }
  },
  reportComment: async function (chatId, commentId) {
    // INPUT
    // chatId: chatroom's identifier
    // commentId: comment's identifier
    // OUTPUT
    // Object {}
    try {
      const commentDoc = await db.collection('chats').doc(chatId).collection('comments').doc(commentId).get()
      const commentInfo = commentDoc.data()
      return db.collection('chats').doc(chatId).collection('comments').doc(commentId).update({
        report: commentInfo.report + 1
      })
    } catch (e) {
      console.log(e.toString());
      return null
    }
  },
  orderByIndex: function (a, b) {
    if (!a.index || !b.index) {
      // return this.orderByCreatedAtDesc(a,b);
      return true
    }
    return a > b;
  },
  orderByCreatedAt: function (a, b) {
    if (!a.createdAt) {
      return true
    }
    if (!b.createdAt) {
      return false
    }
    return a.createdAt.toString() < b.createdAt.toString();
  },
  orderByCreatedAtDesc: function (a, b) {
    if (!a.createdAt) {
      return false
    }
    if (!b.createdAt) {
      return true
    }
    return a.createdAt.toString() > b.createdAt.toString();
  }
}