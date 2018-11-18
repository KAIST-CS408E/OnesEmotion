import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { white } from "../../node_modules/ansi-colors";

class NoticeBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: true
    };
  }

  //   _showModal = () => this.setState({ isModalVisible: true });

  _hideModal = () => this.setState({ isModalVisible: false });

  render() {
    const { onYes, onNo } = this.props;

    return (
      <View>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.modalcontainer}>
            <View style={styles.testcontainer}>
              <View style={styles.buttonView}>
                <Button
                  title="예"
                  color="#616161"
				  onPress={this._hideModal}
				  style={styles.button}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

// <TouchableOpacity
// onPress={this._hideModal}
// style={styles.button}
// >
// <Text style={styles.buttonText}>예</Text>
// </TouchableOpacity>
// <TouchableOpacity
// onPress={this._hideModal}
// style={styles.button}
// >
// <Text style={styles.buttonText}>아니오</Text>
// </TouchableOpacity>

var styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECEFF1"
  },
  modalcontainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  testcontainer: {
    width: wp("75%"),
    height: 300,
    backgroundColor: "#FFFFFF",
    alignItems: "center"
  },
  buttonView: {
    bottom: 20,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  button: {
    position: "absolute",
    width: 250,
    backgroundColor: "#616161",
    alignItems: "center"
  },
});

export default NoticeBox;
