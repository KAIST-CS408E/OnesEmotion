import React from "react";
import { createDrawerNavigator } from 'react-navigation';
import MyLog from "./components/MyLog";
import Story from "./components/Story";
import ChatRoom from "./components/ChatRoom";
import OtherChat from "./components/OtherChat";

class Hidden extends React.Component {
  render() {
    return null;
  }
}

export default DrawerNav = createDrawerNavigator({
	Story : {
		screen: Story,
	},
	OtherChat: {
		screen: OtherChat,
    navigationOptions: {
      drawerLabel: <Hidden />
    }
	},
	MyLog : {
		screen: MyLog,
	},
	ChatRoom : {
		screen: ChatRoom,
	}
},{
		initialRouteName: 'Story'
});