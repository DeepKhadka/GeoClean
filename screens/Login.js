import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";

import fire from "../database/firebase";
import FloatingTextBox from "./FloatingScan";

export default class Login extends Component {
  state = {
    email: "",
    password: "",
  };

  handleLogin = () => {
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch((err) => {
        Alert.alert(err.toString());
      });
  };

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} enabled={true}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
          <View>
            <ImageBackground
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/geoclean-d8fa8.appspot.com/o/loginBackground.png?alt=media&token=42816f1f-8ecb-4ae5-9dd4-3d9c7f4ce377",
              }}
              style={styles.backgroundStyle}
            >
              <View style={{ flex: 8, transform: [{ scale: 0.8 }] }}>
                <Image
                  style={styles.image}
                  source={{
                    uri: "https://firebasestorage.googleapis.com/v0/b/geoclean-d8fa8.appspot.com/o/logo_geoclean.png?alt=media&token=db4e81ab-333f-4d03-9c5e-73cc13f22ec7",
                  }}
                ></Image>
              </View>
              <View style={{ flex: 2, alignItems: "center", padding: "8%" }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 25,
                    fontWeight: "bold",
                    marginTop: "5%",
                    marginBottom: "5%",
                  }}
                >
                  LOGIN
                </Text>
                <FloatingTextBox
                  label="Email Address"
                  autoCapitalize="none"
                  placeholderTextColor="gray"
                  keyboardType="email-address"
                  onChangeText={(val) => {
                    this.setState({ email: val });
                  }}
                  test={this.state.email}
                ></FloatingTextBox>
                <View style={{ height: "7%" }}></View>
                <FloatingTextBox
                  label="Password"
                  autoCapitalize="none"
                  placeholderTextColor="gray"
                  secureTextEntry={true}
                  onChangeText={(val) => {
                    this.setState({ password: val });
                  }}
                  test={this.state.password}
                ></FloatingTextBox>
                <View style={{ height: 50 }}></View>

                <TouchableOpacity
                  style={{
                    width: "80%",
                    height: 50,
                    backgroundColor: "#BB86FC",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 3,
                  }}
                  onPress={this.handleLogin}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    SIGN IN
                  </Text>
                </TouchableOpacity>
                <View style={{ height: 30 }}></View>

                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                  onPress={() => {
                    this.props.navigation.navigate("ForgotPassword");
                  }}
                >
                  Forgot Password?
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                  onPress={() => {
                    this.props.navigation.navigate("Signup");
                  }}
                >
                  Don't have an account? Signup
                </Text>
              </View>
            </ImageBackground>
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
  backgroundStyle: {
    height: "100%",
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
    marginTop: "10%",
  },
});
