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
} from "react-native";

import fire from "../database/firebase"
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
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ flex: 1, backgroundColor: "black" }}
                >
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                flex: 5,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >

                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <View style={{ width: "50%" }}></View>
                        </View>
                    </View>

                    <View
                        style={{
                            flex: 2,
                            alignItems: "center",
                        }}
                    >
                        <View style={{ marginVertical: "5%" }}>
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 25,
                                    fontWeight: "bold",
                                }}
                            >
                                LOGIN
                            </Text>
                        </View>
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
                        <View style={{ height: 40 }}></View>
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
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>SIGN IN</Text>
                        </TouchableOpacity>
                        <View style={{ height: 30 }}></View>
                      
                        <Text
                            style={{
                                color: "skyblue",
                                fontWeight: "bold",
                                fontSize: 15,
                            }}
                            onPress={() => {
                                this.props.navigation.navigate("ForgotPassword");
                            }}
                        >
                            Forgot Password?
                        </Text>
                        <View style={{ height:"2%" }}></View>
                        <Text
                            style={{
                                color: "skyblue",
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