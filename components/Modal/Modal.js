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

class NoticeBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: true
    };
  }

  // _showModal = () => this.setState({ isModalVisible: true });

  // _hideModal = () => this.setState({ isModalVisible: false });

  render() {
    const { onYes, handleModalVisible } = this.props;
    return (
      <View>
        <Modal isVisible={true}>
          <View style={styles.modalcontainer}>
            <View style={styles.testcontainer}>
              <View
                style={{
                  marginTop: 15
                }}
              >
                <View style={styles.buttonContent}>
                  <Text style={{ fontSize: 13 }}>
                    {"이 대화를 삭제하시겠습니까?"}
                  </Text>
                </View>
                <View style={styles.buttonContent}>
                  <Text style={{ fontSize: 13 }}>
                    {"삭제는 되돌릴 수 없습니다."}
                  </Text>
                </View>
                <View style={styles.buttonContent}>
                  <Text style={{ fontSize: 13 }}>
                    {"신중하게 결정해주세요!"}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonView}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <View style={{ width: 120 }}>
                    <Button
                      title="예"
                      color="#616161"
                      onPress={() => {
                        handleModalVisible();
                        onYes();
                      }}
                    />
                  </View>
                  <View style={{ width: 120 }}>
                    <Button
                      title="아니오"
                      color="#616161"
                      onPress={() => handleModalVisible()}
                      style={{ marginTop: 10 }}
                    />
                  </View>
                </View>
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
    height: 160,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderRadius: 15
  },
  buttonView: {
    width: 250,
    position: "absolute",
    bottom: 15
  },
  buttonTitle: {
    width: 300,
    height: 40,
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30
  },
  buttonContent: {
    width: 300,
    height: 25,
    alignItems: "center"
  }
});

export default NoticeBox;
