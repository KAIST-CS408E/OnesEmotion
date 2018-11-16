import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableHighlight,
  Button,
  TouchableOpacity
} from "react-native";
import { createDrawerNavigator, DrawerItems } from "react-navigation";
import Icons from "./assets/Icons";

import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";

import MyLog from "./components/MyLog";
import MyChat from "./components/MyChat";
import Story from "./components/Story";
import ChatRoom from "./components/ChatRoom";
import OtherChat from "./components/OtherChat";

import fb from "./utils/firebaseWrapper";

class Hidden extends React.Component {
  render() {
    return null;
  }
}
// const MidTitle = (props) => (
// 	<SafeAreaView style={{ flex: 1}}>
// 		<View style={{ height: 150, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' }}>
// 			<Image
//         source={Icons("MyLog")}
//         style={{height: 120, width: 120, borderRadius: 60}}
// 			/>
// 		</View>
// 		<View>
// 			<DrawerItems {...props} />
// 		</View>
// 	</SafeAreaView>
// )

class MidTitle extends React.Component {

	componentWillMount() {
		this.autoLogin()
	}
	
	autoLogin = async function () {
		const isLoggedIn = await fb.isUserLoggedIn()
		if (isLoggedIn) {
			this.props.navigation.navigate('Story')
		}
	}
	
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            height: 150,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Image
            source={Icons("MyLog")}
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
          onPress={() => this.props.navigation.navigate("ChatRoom")}
        >
          <Image style={styles.icon} source={Icons("chat")} />
          <Text style={styles.title}>새로운 이야기 추가하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("MyLog")}
        >
          <Image style={styles.icon} source={Icons("MyLog")} />
          <Text style={styles.title}>나의 이야기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("Story")}
        >
          <Image style={styles.icon} source={Icons("Story")} />
          <Text style={styles.title}>다른 사람들의 이야기</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <View style={styles.menubox}>
          <Text style={{ color: "#616161", paddingLeft: 20 }}>
            답변이 필요한 이야기
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("OtherChat")}
        >
          <Image style={styles.icon} source={Icons("emphaty")} />
          <Text style={styles.title}>Title 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("OtherChat")}
        >
          <Image style={styles.icon} source={Icons("emphaty")} />
          <Text style={styles.title}>Title 2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("OtherChat")}
        >
          <Image style={styles.icon} source={Icons("emphaty")} />
          <Text style={styles.title}>Title 3</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("OtherChat")}
        >
          <Image style={styles.icon} source={Icons("emphaty")} />
          <Text style={styles.title}>Title 4</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("OtherChat")}
        >
          <Image style={styles.icon} source={Icons("emphaty")} />
          <Text style={styles.title}>Title 5</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

export default (DrawerNav = createDrawerNavigator(
  {
    ChatRoom: {
      screen: ChatRoom
    },
    MyLog: {
      screen: MyLog,
    },
    Story: {
      screen: Story,
    },
    OtherChat: {
      screen: OtherChat,
      navigationOptions: {
        drawerLabel: <Hidden />
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        drawerLabel: <Hidden />
      }
    },
    Signup: {
      screen: Signup,
      navigationOptions: {
        drawerLabel: <Hidden />
      }
    },
    MyChat: {
      screen: MyChat,
      navigationOptions: {
        drawerLabel: <Hidden />
      }
    }
  },
  {
    contentComponent: MidTitle,
    initialRouteName: "Login"
  }
));

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
