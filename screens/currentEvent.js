import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Button, Alert } from "react-native";
import fire from "../database/firebase";


export default class CurrentEvent extends Component {

    state = {
        eventID: ""
    }

    reportArrival = () => {
        fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .doc(this.state.eventID)
            .collection("VOLUNTEERS")
            .doc(fire.auth().currentUser.uid.toString())
            .update({
                arrived: true
            })
            .then(() => {
                Alert.alert("Arrival reported!")
            })
            .catch((err) => {
                console.log(err.toString())
            })
    }




    removeVolunteer = () => {

        fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .doc(this.state.eventID.toString())
            .collection("VOLUNTEERS")
            .doc(fire.auth().currentUser.uid.toString())
            .delete()
            .then(() => {
                Alert.alert("You are removed as a volunteer!");

            })
            .catch((err) => {
                console.log(err.toString())
            })

    }




    getCurrentEvent = () => {
        var eventID = "";

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
                                console.log("else bhitra")
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
                    No Ongoing event...
                </Text>
            </View>
        );
    };


    componentDidMount() {

        this.getCurrentEvent();


    }

    render() {
        const { navigation } = this.props;

        {
            return this.state.eventID != "" ? (
                <SafeAreaView style={{ flex: 1 }}>
                    <View>
                        <TouchableOpacity style={styles.card} onPress={() => {
                            navigation.navigate("ReportObject", {
                                ID: this.state.eventID
                            });
                        }} >
                            <Text style={styles.text}>Report Object</Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card} onPress={this.reportArrival}>
                            <Text style={styles.text}>Report Arrival</Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card} onPress={this.removeVolunteer}>
                            <Text style={styles.text}>Remove as Volunteer</Text>

                        </TouchableOpacity>

                    </View>
                </SafeAreaView>
            ) : (

                this.emptyComponent()

            )
        }



    }
}
const styles = StyleSheet.create({

    safeview: {
        backgroundColor: "#a09fdf",
        height: "100%",
        width: "100%"

    },
    mainView: {

        height: "100%",
        width: "100%",

        flex: 1

    },
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