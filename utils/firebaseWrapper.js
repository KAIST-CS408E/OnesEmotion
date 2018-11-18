// import * as firebase from 'firebase';
const firebase = require("firebase");
require("firebase/firestore");

import { FIREBASE_APP_NAME, FIREBASE_API_KEY, FIREBASE_SENDER_ID } from '../configs/firebaseConfigs';
console.ignoredYellowBox = ['Warning:'];
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
  if (user) {
    arrived = true
    userObject = user;
  }
})

// 'api' functions (e.g. api.logout())
// For all functions, if they fail to run, return 'null'
export default api = {
  signup: async function (name, email, password) {
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
        name: user.displayName
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
  createChat: async function (userId, backgroundImage) {
    // INPUT
    // userId: user's identifier
    // OUTPUT
    // chatId: chatroom's identifier
    try {
      if (!userId) {
        console.log("creatChat(): No userId")
        return null;
      }
      const chat = await db.collection('chats').add({
        userId: userId,
        totalComments: 0,
        createdAt: new Date(),
        backgroundImage: backgroundImage
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
  createMessage: async function (userId, chatId, content, caching) {
    // INPUT
    // userId: user's identifier
    // chatId: chatroom's identifier
    // content: content of the message
    // OUTPUT
    // messageId : message's identifier
    try {
      if (caching) {
        db.collection('chats').doc(chatId).update({
          summary: content
        });
      }
      const doc = await db.collection('chats').doc(chatId).collection('msgs').add({
        userId: userId,
        content: content,
        createdAt: new Date()
      });
      return doc.id
    } catch (e) {
      console.log(e.toString());
      return null
    }
  },
  removeMessage: async function (chatId, messageId) {
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
  createEmotion: async function (userId, chatId, emotion) {
    // INPUT
    // userId: user's identifier
    // chatId: chatroom's identifier
    // emotion: unique name of the emotion
    // OUTPUT
    // Object {}
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
      const allChatIds = [];
      const chatList = await db.collection('users').doc(userId).collection('chats').get()
      chatList.forEach((chat) => {
        allChatIds.push(chat.id);
      })
      const allChats = await Promise.all(allChatIds.map(async (chatId) => {
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
        // msgList.sort(this.orderByCreatedAtDesc)
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
          createdAt: chatInfo.createdAt,
          // messages: msgList
        }
      }));
      allChats = allChats.filter((chat) => chat !== null);
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
      const msgs = await db.collection('chats').doc(chatId).collection('msgs').get()
      const msgList = [];
      msgs.forEach((msg) => {
        message = msg.data()
        msgList.push({
          messageId: msg.id,
          userId: message.userId,
          createdAt: message.createdAt,
          content: message.content
        })
      });
      msgList.sort(this.orderByCreatedAtDesc);
      const chatInfoDoc = await db.collection('chats').doc(chatId).get()
      const chatInfo = chatInfoDoc.data();
      return {
        chatId: chatId,
        userId: chatInfo.userId,
        userEmotion: chatInfo.userEmotion,
        othersEmotion: chatInfo.othersEmotion,
        createdAt: chatInfo.createdAt,
        messages: msgList
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
      const allStoryIds = [];
      const storyList = await db.collection('chats').get()
      storyList.forEach((chat) => {
        const chatInfo = chat.data()
        if (chatInfo.userId == userId) {
          return;
        }
        allStoryIds.push(chat.id);
      })
      let allStories = await Promise.all(allStoryIds.map(async (chatId) => {
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
        // msgList.sort(this.orderByCreatedAtDesc);
        // const comments = await db.collection('chats').doc(chatId).collection('comments').get()
        // const commentList = [];
        // comments.forEach((comment) => {
        //   cmnt = comment.data()
        //   commentList.push({
        //     commentId: cmnt.id,
        //     userId: cmnt.userId,
        //     content: cmnt.content,
        //     emotion: cmnt.emotion,
        //     like: cmnt.like,
        //     report: cmnt.report,
        //     createdAt: cmnt.createdAt
        //   })
        // });
        // commentList.sort(this.orderByCreatedAtDesc);
        // caching comment length(totalComments)
        // await db.collection('chats').doc(chatId).update({
        //   totalComments: commentList.length 
        // })
        const chatInfoDoc = await db.collection('chats').doc(chatId).get()
        const chatInfo = chatInfoDoc.data();
        return {
          chatId: chatId,
          userId: chatInfo.userId,
          summary: chatInfo.summary,
          backgroundImage: chatInfo.backgroundImage,
          createdAt: chatInfo.createdAt,
          // messages: msgList,
          // comments: commentList
        }
      }));
      allStories = allStories.filter((chat) => chat !== null);
      allStories.sort(this.orderByCreatedAt);
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
    //            }, ...]
    // }
    try {
      const msgs = await db.collection('chats').doc(chatId).collection('msgs').get()
      const msgList = [];
      msgs.forEach((msg) => {
        message = msg.data()
        msgList.push({
          messageId: msg.id,
          userId: message.userId,
          createdAt: message.createdAt,
          content: message.content
        })
      });
      msgList.sort(this.orderByCreatedAtDesc);
      const comments = await db.collection('chats').doc(chatId).collection('comments').get()
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
          createdAt: cmnt.createdAt
        })
      });
      commentList.sort(this.orderByCreatedAtDesc);
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
    const allStoryIds = [];
    const storyList = await db.collection('chats').get()
    storyList.forEach((chat) => {
      if (chat.totalComments > 1) {
        return;
      }
      allStoryIds.push(chat.id);
    })
    let allStories = await Promise.all(allStoryIds.map(async (chatId) => {
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
      // msgList.sort(this.orderByCreatedAtDesc)
      // const comments = await db.collection('chats').doc(chatId).collection('comments').get()
      // const commentList = [];
      // comments.forEach((comment) => {
      //   cmnt = comment.data()
      //   commentList.push({
      //     commentId: cmnt.id,
      //     userId: cmnt.userId,
      //     content: cmnt.content,
      //     emotion: cmnt.emotion,
      //     like: cmnt.like,
      //     report: cmnt.report,
      //     createdAt: cmnt.createdAt
      //   })
      // });
      // commentList.sort(this.orderByCreatedAtDesc);
      // // caching comment length(totalComments)
      // await db.collection('chats').doc(chatId).update({
      //   totalComments: commentList.length 
      // })
      const chatInfoDoc = await db.collection('chats').doc(chatId).get()
      const chatInfo = chatInfoDoc.data();
      return {
        chatId: chatId,
        userId: chatInfo.userId,
        backgroundImage: chatInfo.backgroundImage,
        createdAt: chatInfo.createdAt,
        // messages: msgList,
        // comments: commentList
      }
    }));
    allStories = allStories.filter((chat) => chat !== null);
    allStories.sort(this.orderByCreatedAt);
    return allStories
  },
  createComment: async function (userId, chatId, content, emotion) {
    // INPUT
    // userId: user's identifier
    // chatId: chatroom's identifier
    // content: content of the comment
    // emotion: emotion of the comment
    // OUTPUT
    // commentId
    try {
      await db.collection('chats').doc(chatId).update({
        othersEmotion: emotion
      });
      const doc = await db.collection('chats').doc(chatId).collection('comments').add({
        userId: userId,
        content: content,
        emotion: emotion,
        like: 0,
        report: 0,
        createdAt: new Date()
      });
      return doc.id
    } catch (e) {
      console.log(e.toString());
      return [];
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
  orderByCreatedAt: function (a, b) {
    if (!a.createdAt) {
      return true
    }
    if (!b.createdAt) {
      return false
    }
    return a.createdAt.toDate() <= b.createdAt.toDate()
  },
  orderByCreatedAtDesc: function (a, b) {
    if (!a.createdAt) {
      return false
    }
    if (!b.createdAt) {
      return true
    }
    return a.createdAt.toDate() >= b.createdAt.toDate()
  }
}