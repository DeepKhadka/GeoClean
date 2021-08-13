import React, { Component } from "react";
import { View, SafeAreaView, TouchableOpacity, StyleSheet, Text, Button, Alert } from "react-native";
import fire from "../database/firebase";

export default class CurrentEvent extends Component {


    state = {

        eventID: "",
        eventStatus: "",
        data: null

    }


    //Start the event
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


    handleCancel = () => {
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
        var eventStatus;

        fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .where("eventStatus", "==", "current")
            .get()
            .then(async (sub) => {


                if (sub.docs.length > 0) {



                    sub.forEach((doc) => {
                        eventStatus = doc.data().eventStatus;
                        eventID = doc.id.toString();
                    });
                    this.setState({
                        eventID: eventID,
                        eventStatus: eventStatus
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


                                subdoc.forEach((doc_1) => {
                                    eventID = doc_1.id.toString();
                                    eventStatus = doc_1.data().eventStatus;
                                });
                                this.setState({
                                    eventID: eventID,
                                    eventStatus: eventStatus
                                })
                            }
                        })
                        .catch((err) => {
                            console.log(err.toString() + " error")
                        });


                }
            })
            .then(() => {
                console.log(this.state.eventID + " - " + this.state.eventStatus)

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

    display = () => {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    {this.state.eventStatus == "current" ?

                        <TouchableOpacity style={styles.card} onPress={this.handlePause} >
                            <Text style={styles.text}>Pause</Text>

                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.card} onPress={this.handleStart} >
                            <Text style={styles.text}>Start</Text>

                        </TouchableOpacity>

                    }

                    <TouchableOpacity style={styles.card} onPress={this.handleCompleted} >
                        <Text style={styles.text}>Mark Complete</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={this.handleCancel} >
                        <Text style={styles.text}>Cancel Event</Text>

                    </TouchableOpacity>
                </View>
            </SafeAreaView>

        );
    }



    render() {
        const { navigation } = this.props;
        {
            return this.state.eventID == "" ? this.emptyComponent() : this.display()

        }




    }
}
const styles = StyleSheet.create({


    card: {
        margin: "5%",
        backgroundColor: "#D9ACEA",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,

    },
    text: {
        padding: "10%",
        fontSize: 20,
        fontWeight: 'bold'


    },





});