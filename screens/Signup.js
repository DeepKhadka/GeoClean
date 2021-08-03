import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Button,
    TouchableOpacity,
    Pressable,
    TextInput,
    Alert,
    FlatList,
    ScrollView,
    KeyboardAvoidingView,
    Modal,
    Image,
} from "react-native";


import fire from "../database/firebase";
import "firebase/firestore";
import "firebase/storage";

import * as ImagePicker from "expo-image-picker";
import PP from "./profileplaceholder";
import FloatingTextError from "./FloatingTextError";

export default class Signup extends Component {
    state = {
        email: "",
        fName: "",
        lName:"",
        password: "",
        confirmPassword: "",
        errorMessage: "",
        errorUsername: 0,
        avatar: null,
    };

    handlefirebasesignup = () => {
        if (this.state.password != this.state.confirmPassword) {
            this.setState({
                errorMessage: "Passwords do not match!",
            });
        } else if (
            this.state.email == "" ||
            this.state.fName == "" ||
            this.state.lName == "" ||
            this.state.password == "" )
            
         {
            this.setState({
                errorMessage: "Please fill in all the fields!",
            });
        }  else {
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
                            fName:this.state.fName,
                            lName: this.state.lName,
                            admin:false
                            
                            
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

    

    handleSignUp = () => {
        fire
            .firestore()
            .collection("VOLUNTEER")
            .where("email", "==", this.state.email)
            .get()
            .then((snapshot) => {
                if (snapshot.empty) {
                    return this.handlefirebasesignup();
                } else {
                    return this.setState({
                        errorMessage: "Email already registered!",
                    });
                }
            })
            .catch((err) => {
                // Alert.alert(err.toString());
                console.error(err);
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
                    <View style={{ flex: 1 }}>
                        
                        <View
                            style={{
                                flex: 6,
                            }}
                        >
                            <View style={{ height: 10 }}></View>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "flex-end",

                                    alignItems: "center",
                                }}
                            >
                                <View style={{ width: "80%" }}>
                                    <Text style={{ color: "red", fontSize: 15 }}>
                                        {this.state.errorMessage}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ height: 10 }}></View>
                            <View
                                style={{
                                    flex: 10,

                                    alignItems: "center",
                                }}
                            >
                                <FloatingTextError
                                    label="Email"
                                    placeholderTextColor="gray"
                                    keyboardType="email-address"
                                    onChangeText={(val) => {
                                        this.setState({ email: val });
                                    }}
                                    autoCapitalize="none"
                                    test={this.state.email}
                                ></FloatingTextError>
                                <View style={{ height: 40 }}></View>
                                <FloatingTextError
                                    label="First Name"
                                    placeholderTextColor="gray"
                                    onChangeText={(val) => {
                                        this.setState({ fName: val });
                                    }}
                                    autoCapitalize="none"
                                    test={this.state.fName}
                                ></FloatingTextError>
                                <View style={{ height: 40 }}></View>
                                <FloatingTextError
                                    label="Last Name"
                                    placeholderTextColor="gray"
                                    onChangeText={(val) => {
                                        this.setState({ lName: val });
                                    }}
                                    autoCapitalize="none"
                                    test={this.state.lName}
                                ></FloatingTextError>
                                <View style={{ height: 40 }}></View>
                                <FloatingTextError
                                    label="Password"
                                    placeholderTextColor="gray"
                                    secureTextEntry={true}
                                    onChangeText={(val) => {
                                        this.setState({ password: val });
                                    }}
                                    autoCapitalize="none"
                                    test={this.state.password}
                                ></FloatingTextError>
                                <View style={{ height: 40 }}></View>
                                <FloatingTextError
                                    label="Confirm Password"
                                    placeholderTextColor="gray"
                                    secureTextEntry={true}
                                    onChangeText={(val) => {
                                        this.setState({ confirmPassword: val });
                                    }}
                                    autoCapitalize="none"
                                    test={this.state.confirmPassword}
                                ></FloatingTextError>
                                <View style={{ height: 40 }}></View>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#BB86FC",
                                        borderRadius: 5,
                                        height: "8%",
                                        width: "80%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginVertical: "7%",
                                    }}
                                    onPress={this.handleSignUp}
                                >
                                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                        SIGN UP
                                    </Text>
                                </TouchableOpacity>
                                <View style={{ height: 40 }}></View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    image: {
        width: 140,
        height: 140,
        borderRadius: 140 / 2,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "white",
        marginTop: 20,
    },
});