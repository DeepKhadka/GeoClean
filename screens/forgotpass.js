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
} from "react-native";
import fire from "../database/firebase";
import FloatingTextBox from "./FloatingScan";

export default class ForgotPassword extends Component {
  state = {
    email: "",
  };

  handleReset = () => {
    fire
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(() => {
        ToastAndroid.show(
          "Password reset email sent successfully.",
          ToastAndroid.LONG
        );
        this.props.navigation.goBack();
      })
      .catch((err) => {
        Alert.alert(err.toString());
      });
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: "black",
        }}
        enabled={true}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ flex: 1 }}
          enabled={true}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={{ height: 30 }}></View>
            <View style={{ width: "80%" }}>
              <Text style={{ fontSize: 17, color: "white" }}>
                Please enter the email associated with your account
              </Text>
            </View>
            <View style={{ height: 30 }}></View>
            <FloatingTextBox
              label="Email Address"
              placeholderTextColor="gray"
              keyboardType="email-address"
              onChangeText={(val) => {
                this.setState({ email: val });
              }}
              autoCapitalize="none"
              test={this.state.email}
            ></FloatingTextBox>
            <View style={{ height: 30 }}></View>
            <TouchableOpacity
              style={{
                backgroundColor: "#BB86FC",
                borderRadius: 5,
                height: 50,
                width: "80%",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: "5%",
              }}
              onPress={this.handleReset}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  1;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});