import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableHighlight,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { createStackNavigator, createDrawerNavigator, DrawerItems, NavigationActions, StackActions } from "react-navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import Icons from "./assets/Icons";

import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";

import Splash from "./components/Splash";
import Loading from "./components/Loading";

import MyLog from "./components/MyLog";
import MyChat from "./components/MyChat";
import Story from "./components/Story";
import ChatRoom from "./components/ChatRoom";
import OtherChat from "./components/OtherChat";

import fb from "./utils/firebaseWrapper";

class MidTitle extends React.Component {
  state = {
    user: fb.getUser(),
    recommandationList: [],
    isAppBooted : true,
  }

	componentWillMount() {
		this.autoLogin()
  }
  
  componentDidMount() {
    this.getUser()
  }

  middleWare = (resetAction) => {
      this.state.isAppBooted ? this.props.navigation.dispatch(resetAction) : null
      this.setState({isAppBooted:false})
  }
	
	autoLogin = async function () {
		const user = await fb.getUserInfo()
    const resetAction1 = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Story'})
      ]
    })
    const resetAction2 = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login'})
      ]
    })

		if (user) {
      this.middleWare(resetAction1)
      this.setState({user})
    } else {
      this.middleWare(resetAction2)
    }
  }

  getUser = async function () {
    const user = this.state.user || await fb.getUserInfo();
    const recommandationList = await fb.recommandStories(user.userId);
    this.setState({user, recommandationList});
  }
  
  toShort = (text) => {
    if (text.length > 20) {
      return text.slice(0, 18) + '...'
    }
    return text
  }
	
  render() {
    const {recommandationList} = this.state;
    const recommandations = recommandationList.map((recommandation) => (
      <TouchableOpacity
        key={recommandation.chatId}
        style={styles.button}
        onPress={() => this.props.navigation.navigate("OtherChat", {chatId: recommandation.chatId})}
      >
        <Image style={styles.icon} source={Icons("emphaty")} />
        <Text style={styles.title}>{this.toShort(recommandation.summary)}</Text>
      </TouchableOpacity>
    ))

    return (
      <SafeAreaView style={{ flex: 1, width: wp("65%")}}>
        <View
          style={{
            height: 150,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Image
            source={Icons(this.state.user? this.state.user.usericon : "Logo")}
            style={{
              height: 120,
              width: 120,
              borderRadius: 60,
              paddingTop: 20
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("ChatRoom", {isNewChat:true})}
        >
          <Image style={styles.icon} source={Icons("chat")} />
          <Text style={styles.title}>새로운 이야기 시작하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("MyLog")}
        >
          <Image style={styles.icon} source={Icons("MyLog")} />
          <Text style={styles.title}>내 이야기 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("Story")}
        >
          <Image style={styles.icon} source={Icons("Story")} />
          <Text style={styles.title}>다른 사람들의 이야기 보기</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <View style={styles.menubox}>
          <Text style={{ color: "#616161", paddingLeft: 20 }}>
            답변이 필요한 이야기들
          </Text>
        </View>
        <ScrollView>
          {recommandations}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const drawer = createStackNavigator({
  ChatRoom: {screen: ChatRoom},
  MyLog: {screen: MyLog},
  Story: {screen: Story},
  OtherChat: {screen:OtherChat},
  Login: {screen: Login},
  Signup: {screen: Signup},
  MyChat: {screen: MyChat},
  Splash: {screen: Splash},
  Loading: {screen: Loading}
},{
  initialRouteName: "Splash",  
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
}
);

const DrawerNav = createDrawerNavigator({
  drawer: {
    screen: drawer
  }
},
{
  contentComponent: MidTitle,
});

const styles = StyleSheet.create({
  menubox: {
    height: 60,
    backgroundColor: "white",
    justifyContent: "center",
    flexDirection: "column"
  },
  nestedview: {
    flexDirection: "row"
  },
  button: {
    paddingLeft: 8,
    height: 60,
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    paddingLeft: 15,
    textAlignVertical: "center"
  },
  title2: {
    color: "rgba(255,255,255,0.70)",
    fontWeight: "bold",
    fontSize: 14
  },
  icon: {
    width: 24,
    height: 24,
    paddingLeft: 20
  },
  line: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: "#757575",
    borderBottomWidth: 1
  }
});

export default DrawerNav;
