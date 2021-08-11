import React, { Component } from "react";
import { View, SafeAreaView, TouchableOpacity, Text, Button, Alert } from "react-native";
import fire from "../database/firebase";

export default class CurrentEvent extends Component {


    state = {

        eventID: "",

    }

    //start the event
    handleStart = () => {


        fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .doc(this.state.eventID)
            .update({
                eventStatus: "current"
            })
            .then(() => {
                Alert.alert("Event started!")

            })
            .catch((err) => {
                console.log(err.toString())
            })

    }

    //pause the event
    handlePause = () => {

        fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .doc(this.state.eventID)
            .update({
                eventStatus: "paused"
            })
            .then(() => {
                Alert.alert("Event Paused!")

            })
            .catch((err) => {
                console.log(err.toString())
            })


    }


    //handles event status to completed
    handleCompleted = () => {

        fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .doc(this.state.eventID)
            .update({
                eventStatus: "completed"
            })
            .then(() => {
                Alert.alert("Event completed!")

            })
            .catch((err) => {
                console.log(err.toString())
            })

    }

    handleCancel = () =>{
        fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .doc(this.state.eventID)
            .update({
                eventStatus: "canceled"
            })
            .then(() => {
                Alert.alert("Event canceled!")

            })
            .catch((err) => {
                console.log(err.toString())
            })

    }









    //gets the event ID of current/paused event
    getCurrentEvent = () => {

        var eventID;

        fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .where("eventStatus", "==", "current")
            .get()
            .then(async (sub) => {


                if (sub.docs.length > 0) {


                    const data = [];
                    sub.forEach((doc) => {
                        eventID = doc.id.toString();
                    });
                    this.setState({
                        eventID: eventID,
                    });
                } else {

                    await fire
                        .firestore()
                        .collection("ADMIN")
                        .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
                        .collection("EVENT MANAGEMENT")
                        .where("eventStatus", "==", "paused")
                        .get()
                        .then((subdoc) => {

                            if (subdoc.docs.length > 0) {

                                const data_1 = []
                                subdoc.forEach((doc_1) => {
                                    eventID = doc_1.id.toString();
                                });
                                this.setState({
                                    eventID: eventID
                                })
                            }
                        })
                        .catch((err) => {
                            console.log(err.toString() + " error")
                        });



                }
            })
            .then(() => {
                console.log(this.state.eventID)

            })
            .catch((err) => {
                console.log(err.toString());
            });
    };

    emptyComponent = () => {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 20, fontStyle: "italic", fontWeight: "bold" }}>
                   No current event...
                </Text>
            </View>
        );
    };

    componentDidMount() {
        this.getCurrentEvent()
    }


    render() {
        const { navigation } = this.props;
        {
            return this.state.eventID == "" ? this.emptyComponent() :

                <SafeAreaView style={{ flex: 1 }}>
                    <View>

                        <Text>Current Event Admin</Text>

                    </View>
                </SafeAreaView>


        }




    }
}