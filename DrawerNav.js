import { createDrawerNavigator } from 'react-navigation';
import MyLog from "./components/MyLog";
import Story from "./components/Story";
import ChatRoom from "./components/ChatRoom";

export default DrawerNav = createDrawerNavigator({
	Story : {
		screen: Story,
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