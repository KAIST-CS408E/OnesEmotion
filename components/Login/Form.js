import React from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  TextInput,
  TouchableOpacity,
  Picker
} from 'react-native';

export default class Form extends React.Component {

	render() {

    if (this.props.type == "Signup") {
      name_button = <TextInput style={styles.inputBox} 
        underlineColorAndroid= 'rgba(0, 0, 0, 0)'
        placeholder= "Name"
        placeholderTextColor= "#E0E0E0"
        selectionColor='#fff'
        onChangeText={(value) => this.props.handleTextChange('username', value)}
        value={this.props.form.username}
        onSubmitEditing= {()=> this.email.focus()}
        />
      gender_button = <View style={styles.calendarFilterContainer}>
      <Picker
        selectedValue={this.props.form.gender}
        placeholder= "Gender"
        onValueChange={(itemValue, itemIndex) => this.props.handleTextChange('gender', itemValue)}
        style={{ color:'white', height: 50, width: 260}}
        itemStyle={{ backgroundColor: "grey", color: "blue", fontSize:17 }}>
        <Picker.Item label="Choose your gender" value='basic' />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>
      </View>
    } else {
      name_button = null
      gender_button = null
    }

		return(
			<View style={styles.container}>
        {name_button}
        <TextInput style={styles.inputBox} 
          underlineColorAndroid= 'rgba(0, 0, 0, 0)'
          placeholder= "Email"
          placeholderTextColor= "#ffffff"
          selectionColor='#fff'
          keyboardType="email-address"
          ref={(input) => this.email = input}
          onChangeText={(value) => this.props.handleTextChange('email', value)}
          value={this.props.form.email}
          onSubmitEditing= {()=> this.password.focus()}
          />
        <TextInput style={styles.inputBox} 
          underlineColorAndroid= 'rgba(0, 0, 0, 0)'
          placeholder= "Password"
          secureTextEntry={true}
          placeholderTextColor= "#ffffff"
          ref={(input) => this.password = input}
          onChangeText={(value) => this.props.handleTextChange('password', value)}
          value={this.props.form.password}
          />
        {gender_button}
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center',
  },
  inputBox: {
    width: 300,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#ffffff',
    marginVertical: 10
  },
  button: {
    width: 300,
    backgroundColor: '#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: '#ffffff',
    textAlign: 'center'
  },
  calendarFilterContainer: {
    marginVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
    width: 300,
    backgroundColor: '#757575',
    borderRadius: 25,
  },
});