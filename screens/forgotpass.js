import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
  TextInput,
  ImageBackground,
} from "react-native";
import fire from "../database/firebase";

import { Icon } from "react-native-elements";
import { isMoment } from "moment";

export default class ForgotPassword extends Component {
  _isMounted = false;

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
  }
  state = {
    email: "",
  };

  handleReset = () => {
    this._isMounted
      ? fire
          .auth()
          .sendPasswordResetEmail(this.state.email)
          .then(() => {
            alert("Password reset email sent!");
            this.props.navigation.goBack();
          })
          .catch((err) => {
            Alert.alert(err.toString());
          })
      : null;
  };

  render() {
    return (
      
      <ImageBackground
      source={require("../assets/background.png")}
        style={styles.backgroundStyle}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
          }}
          enabled={true}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={styles.defaultPlace}>
              <Icon name="envelope" type="font-awesome" size={30}></Icon>
              <TextInput
                placeholder="Email Address"
                style={styles.textInput}
                placeholderTextColor="black"
                autoCapitalize="none"
                onChangeText={(val) => {
                  this.setState({ email: val });
                }}
                test={this.state.eventName}
              />
            </View>
            <TouchableOpacity
              style={{
                margin: "5%",
                padding: "2%",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                width: "50%",

                backgroundColor: " rgba(0, 100, 0, 0.8)",
                borderBottom: 2,
              }}
              onPress={this.handleReset}
            >
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>Reset</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
     
    );
  }
  1;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  backgroundStyle: {
   
    flex:1,
    
  },
  textInput: {
    height: "100%",
    width: "80%",

    justifyContent: "center",
    borderRadius: 20,
    alignContent: "center",
    marginLeft: "5%",
    fontWeight: "bold",
    fontSize: 15,
  },

  defaultPlace: {
    flexDirection: "row",
    backgroundColor: " rgba(0, 115, 189, 0.3);",
    height: "10%",
    marginTop: "5%",
    justifyContent: "center",
    alignItems: "center",
    padding: "2%",
    borderRadius: 10,
  },
});
