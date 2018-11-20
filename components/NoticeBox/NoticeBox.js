import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Modal from 'react-native-modal'

class NoticeBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible: false
		}
	}

	_showModal = () => this.setState({ isModalVisible: true })

	_hideModal = () => this.setState({ isModalVisible: false })

	render() {
		const { notice } = this.props;

		return(
			<View style={{width: wp("100%"), height: 40, justifyContent: 'center', alignItems: 'center',}}>
				<TouchableOpacity style={styles.container} onPress={this._showModal}>
					<Text style={{fontWeight: 'bold'}}>이곳에서 무엇을 할 수 있나요?</Text>
				</TouchableOpacity>
				<Modal isVisible={this.state.isModalVisible}>
					<View style={styles.modalcontainer}>
						<View style={styles.testcontainer}>
							<View style={styles.buttonTitle}><Text style={{color: '#0D47A1', fontSize: 20, fontWeight:'bold'}}>{notice[0]}</Text></View>
							<View style={styles.buttonContent}><Text style={{fontSize: 13}}>{notice[1]}</Text></View>
							<View style={styles.buttonContent}><Text style={{fontSize: 13}}>{notice[2]}</Text></View>
							<View style={styles.buttonContent}><Text style={{fontSize: 13}}>{notice[3]}</Text></View>
							<View style={styles.buttonContent}><Text style={{fontSize: 13}}>{notice[4]}</Text></View>
						<View style={styles.buttonView}>
							<Button
								title ="닫기"
								color ="#616161"
								onPress={this._hideModal} />
						</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	container: {
    width: wp("100%"),
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
	backgroundColor: '#ECEFF1',
  },
  modalcontainer: {
		flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  testcontainer: {
  	width: wp("75%"),
  	height: 300,
  	backgroundColor: '#FFFFFF',
	alignItems: 'center',
	borderRadius: 15
  },
  buttonView: {
  	width: 250,
  	position: 'absolute',
  	bottom: 20
  },
  buttonTitle: {
  	width: 300,
  	height: 40,
  	alignItems: 'center',
  	marginTop: 40,
  	marginBottom: 30
  },
  buttonContent: {
  	width: 300,
  	height: 25,
  	alignItems: 'center',
  }
});


export default NoticeBox;
