import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Button } from "react-native";
import fire from "../database/firebase";

export default class VolunteerManagement extends Component {

    state = {
        eventID: ""
    }


    getCurrentEvent = () => {
        var eventID;

        fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .where("eventStatus", "==", "current")
            .get()
            .then((sub) => {
                if (sub.docs.length > 0) {
                    const data = [];
                    sub.forEach((doc) => {
                        eventID = doc.id.toString();
                    });
                    this.setState({
                        eventID: eventID,
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



    async releaseAllVolunteers() {
        var data = [];

        return await fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .doc(this.state.eventID)
            .collection("VOLUNTEERS")
            .get()
            .then(
                function (querySnapshot) {
                    var results = [];

                    querySnapshot.forEach(function (doc) {
                        var docRef = fire
                            .firestore()
                            .collection("ADMIN")
                            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
                            .collection("EVENT MANAGEMENT")
                            .doc(this.state.eventID)
                            .collection("VOLUNTEERS")
                            .doc(doc.id)
                            .update({
                                leader: false,
                                satus: false
                            })
                            .then(
                                console.log("Updated!")
                            );
                        // push promise from get into results
                        results.push(docRef);
                    });
                    // dbPromise.then() resolves to  a single promise that resolves
                    // once all results have resolved
                    return Promise.all(results);
                },
                function (val) {
                    // The Promise was rejected.
                    console.log(val);
                }
            )
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }


    componentDidMount() {
        this.getCurrentEvent()
    }


    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <TouchableOpacity style={styles.card} onPress={() => { navigation.navigate("AssignVolunteer"); }} >
                    <Text style={styles.text}>Assign Volunteers</Text>

                </TouchableOpacity>


                <TouchableOpacity style={styles.card} onPress={this.releaseAllVolunteers} >

                    <Text style={styles.text}>Release All </Text>
                </TouchableOpacity>
            </SafeAreaView>
        )

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