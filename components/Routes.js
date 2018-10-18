import React from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';

import LogList from './LogList';
import ChatRoom from './ChatRoom';

export default class Routes extends React.Component {
	render() {
		return(
			<Router>
				<Stack key="root" hideNavBar={true}>
					<Scene key="loglist" component={LogList} title="LogList" initial={true}/>
					<Scene key="chatroom" component={ChatRoom} title="ChatRoom"/>
				</Stack>
			</Router>
		)
	}
}