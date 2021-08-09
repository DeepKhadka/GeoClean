import React, { Component } from "react";
import { View, SafeAreaView, TouchableOpacity, Text, Button, Alert } from "react-native";
import fire from "../database/firebase";
import FloatingTextBox from "../assets/textEntry";



const today = new Date();

function formatDate(date) {

    var MM = date.getMonth() + 1;
    var DD = date.getDate();
    var YYYY = date.getFullYear();


    return (MM + "-" + DD + "-" + YYYY)
}


export default class StartEvent extends Component {

    state = {

        eventName: "",
        eventDate: "09-01-2021",
        eventAddress: "",
        volunteers: "",
        eventTime: "10",
        eventDescription: "Clean the fucking Park mofos!"


    }



    startevent = () => {

        console.log("Got here!")

        fire
            .firestore()
            .collection("ADMIN")
            .doc(fire.auth().currentUser.uid.toString())
            .collection("EVENT MANAGEMENT")
            .doc()
            .set({
                eventName: this.state.eventName,
                address: this.state.eventAddress,
                noOfVolunteers: Number(this.state.volunteers),
                eventStatus: "current",
                eventDate: "09-01-2021",
                eventTime: Number("10"),
                eventDescription: this.state.eventDescription


            })
            .then(() => {
                Alert.alert("Event Created!");
                this.props.navigation.goBack();


            })

    }

    checkCurrentEvent = () => {

        if (this.state.eventName == "" || this.state.eventDate == "" || this.state.eventAddress == "" || this.state.volunteers == "") {
            Alert.alert("Please fill all the fields!")
        } else {

            fire.firestore().collection("ADMIN").doc(fire.auth().currentUser.uid.toString()).collection("EVENT MANAGEMENT").where("eventStatus", "==", "current")
                .get()
                .then((snapshot) => {
                    if (snapshot.empty) {
                        return this.startevent();

                    }
                    else {
                        Alert.alert("Ongoing Event!")
                    }
                })
                .catch((err) => {
                    console.log(err.toString())
                    //Alert.alert(err.toString())

                })


        }

    }



    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ alignItems: "center" }}>
                    <FloatingTextBox
                        label="Event Name"
                        autoCapitalize="none"
                        placeholderTextColor="gray"

                        onChangeText={(val) => {
                            this.setState({ eventName: val });
                        }}
                        test={this.state.eventName}
                    ></FloatingTextBox>
                    {/* <FloatingTextBox
                        label="Event Date"
                        autoCapitalize="none"
                        placeholderTextColor="gray"

                        onChangeText={(val) => {
                            this.setState({ eventDate: val });
                        }}
                        test={this.state.eventDate}
                    ></FloatingTextBox> */}

                    <FloatingTextBox
                        label="Event Address"
                        autoCapitalize="none"
                        placeholderTextColor="gray"

                        onChangeText={(val) => {
                            this.setState({ eventAddress: val });
                        }}
                        test={this.state.eventAddress}
                    ></FloatingTextBox>
                    <FloatingTextBox
                        label="No.of Volunteers"
                        autoCapitalize="none"
                        placeholderTextColor="gray"
                        keyboardType="number-pad"
                        onChangeText={(val) => {
                            this.setState({ volunteers: val });
                        }}
                        test={this.state.volunteers}
                    ></FloatingTextBox>

                    <TouchableOpacity style={{ backgroundColor: "red", marginTop: "20%", height: "10%", width: "80%", alignItems: "center" }}
                        onPress={this.checkCurrentEvent}
                    >
                        <Text style={{ padding: 10, fontSize: 20, fontWeight: "bold" }}>Finish</Text>
                    </TouchableOpacity>

                </View>





            </SafeAreaView>
        )

    }
}