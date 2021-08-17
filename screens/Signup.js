import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import { Icon } from "react-native-elements";

import fire from "../database/firebase";
import "firebase/firestore";
import "firebase/storage";

export default class Signup extends Component {
  _isMounted = false;
  state = {
    email: "",
    fName: "",
    lName: "",
    password: "",
    confirmPassword: "",
    errorMessage: "",
    errorUsername: 0,
    avatar: null,
    passwordVisibility: false,
    confirmpasswordVisibility: false,
  };

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
  }

  handlefirebasesignup = () => {
    if (this.state.password != this.state.confirmPassword) {
      this._isMounted && alert("Passwords do not match!");
    } else if (
      this.state.email == "" ||
      this.state.fName == "" ||
      this.state.lName == "" ||
      this.state.password == ""
    ) {
      alert("Please fill in all the fields!");
    } else {
      this._isMounted &&
        fire
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => {
            fire
              .firestore()
              .collection("VOLUNTEER")
              .doc(fire.auth().currentUser.uid.toString())
              .set({
                email: this.state.email,
                fName: this.state.fName,
                lName: this.state.lName,
                admin: false,
              });
          })
          .then(() => {
            fire.auth().currentUser.sendEmailVerification();
          })

          .catch((err) => {
            Alert.alert(err.toString());
            console.error(err);
          });
    }
  };
  handleConfirmPasswordVisibility = () => {
    console.log("here");
    this._isMounted &&
      this.setState({
        confirmpasswordVisibility: !this.state.confirmpasswordVisibility,
      });
  };
  handlePasswordVisibility = () => {
    this._isMounted &&
      this.setState({
        passwordVisibility: !this.state.passwordVisibility,
      });
  };

  handleSignUp = () => {
    this._isMounted &&
      fire
        .firestore()
        .collection("VOLUNTEER")
        .where("email", "==", this.state.email)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            return this.handlefirebasesignup();
          } else {
            return alert("Email already registered!");
          }
        })
        .catch((err) => {
          console.error(err);
        });
  };

  render() {
    return (
      <ImageBackground
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/geoclean-d8fa8.appspot.com/o/loginBackground.png?alt=media&token=42816f1f-8ecb-4ae5-9dd4-3d9c7f4ce377",
        }}
        style={styles.backgroundStyle}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
          }}
          enabled={true}
        >
          <SafeAreaView style={styles.safeview}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                marginTop: "2%",
                marginLeft: "2%",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Let's Start{" "}
              </Text>
            </View>

            <View style={{ alignItems: "center", flex: 9 }}>
              <View style={styles.defaultPlace}>
                <Icon name="user" type="font-awesome" size={30}></Icon>
                <TextInput
                  placeholder="First Name"
                  style={styles.textInput}
                  placeholderTextColor="black"
                  onChangeText={(val) => {
                    this.setState({ fName: val });
                  }}
                  test={this.state.fName}
                />
              </View>
              <View style={styles.defaultPlace}>
                <Icon name="user" type="font-awesome" size={30}></Icon>
                <TextInput
                  placeholder="Last Name"
                  style={styles.textInput}
                  placeholderTextColor="black"
                  onChangeText={(val) => {
                    this.setState({ lName: val });
                  }}
                  test={this.state.lName}
                />
              </View>
              <View style={styles.defaultPlace}>
                <Icon name="envelope" type="font-awesome" size={30}></Icon>
                <TextInput
                  placeholder="Email"
                  style={styles.textInput}
                  placeholderTextColor="black"
                  onChangeText={(val) => {
                    this.setState({ email: val });
                  }}
                  test={this.state.email}
                />
              </View>
              <View style={styles.defaultPlace}>
                <Icon name="lock" type="font-awesome" size={30}></Icon>
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!this.state.passwordVisibility}
                  style={styles.textInput}
                  placeholderTextColor="black"
                  onChangeText={(val) => {
                    this.setState({ password: val });
                  }}
                  test={this.state.password}
                />
                {this.state.passwordVisibility ? (
                  <Icon
                    name="eye"
                    type="font-awesome"
                    size={25}
                    onPress={this.handlePasswordVisibility}
                  />
                ) : (
                  <Icon
                    name="eye-slash"
                    type="font-awesome"
                    size={25}
                    onPress={this.handlePasswordVisibility}
                  />
                )}
              </View>
              <View style={styles.defaultPlace}>
                <Icon name="lock" type="font-awesome" size={30}></Icon>
                <TextInput
                  placeholder=" Confirm Password"
                  secureTextEntry={!this.state.confirmpasswordVisibility}
                  style={styles.textInput}
                  placeholderTextColor="black"
                  onChangeText={(val) => {
                    this.setState({ confirmPassword: val });
                  }}
                  test={this.state.confirmPassword}
                />
                {this.state.confirmpasswordVisibility ? (
                  <Icon
                    name="eye"
                    type="font-awesome"
                    size={25}
                    onPress={this.handleConfirmPasswordVisibility}
                  />
                ) : (
                  <Icon
                    name="eye-slash"
                    type="font-awesome"
                    size={25}
                    onPress={this.handleConfirmPasswordVisibility}
                  />
                )}
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
                onPress={this.handlefirebasesignup}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  safeview: {
    height: "100%",
    width: "100%",
    flex: 1,
  },
  button: {
    backgroundColor: "lightyellow",
    marginTop: "20%",
    height: "10%",
    width: "40%",
    alignItems: "center",
    borderRadius: 10,
  },
  backgroundStyle: {
    height: "100%",
    width: "100%",
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
  desInput: {
    flexDirection: "row",

    backgroundColor: " rgba(0, 115, 189, 0.3);",
    height: "15%",
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
    padding: "2%",
    borderRadius: 10,
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
  headerView: {
    flexDirection: "row",
    backgroundColor: " rgba(0, 115, 189, 0.3);",
    height: "10%",
    marginTop: "5%",
    justifyContent: "space-between",
  },
});
