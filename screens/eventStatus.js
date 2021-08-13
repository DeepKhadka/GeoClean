import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Button } from "react-native";
import fire from "../database/firebase";

export default class EventStatus extends Component {

    state = {
        data_arrived: [],
        data_unarrived: [],
        refreshing: false


    }

    getArrived = async () => {

        var data = [];

        await fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .doc(this.props.route.params.eventID)
            .collection("VOLUNTEERS")
            .where("arrived", "==", true)
            .get()
            .then(
                function (querySnapshot) {
                    var results = [];

                    querySnapshot.forEach(function (doc) {
                        var docRef = fire
                            .firestore()
                            .collection("VOLUNTEER")
                            .doc(doc.id)
                            .get()
                            .then(
                                function (snap) {
                                    const x = snap.data();
                                    x.id = doc.id;
                                    (x.leader = doc.data().leader),
                                        (x.status = doc.data().status),
                                        (x.zoneNumber = doc.data().zoneNumber);

                                    data.push(x);
                                },
                                function (error) {
                                    Alert.alert(error.toString());
                                }
                            );
                        // push promise from get into results
                        results.push(docRef);
                    });
                    // dbPromise.then() resolves to  a single promise that resolves
                    // once all results have resolved
                    return Promise.all(results);
                },
                function (val) {
                    d;
                    // The Promise was rejected.
                    console.log(val);
                }
            )
            .then(() => {
                this.setState({
                    data_arrived: data,
                    refreshing: false,
                });
            })
            .then(() => {
                console.log(this.state.data_arrived);
                this.getUnarrived()
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });




    }

    getUnarrived = async () => {

        var data = [];

        await fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .doc(this.props.route.params.eventID)
            .collection("VOLUNTEERS")
            .where("arrived", "==", false)
            .get()
            .then(
                function (querySnapshot) {
                    var results = [];

                    querySnapshot.forEach(function (doc) {
                        var docRef = fire
                            .firestore()
                            .collection("VOLUNTEER")
                            .doc(doc.id)
                            .get()
                            .then(
                                function (snap) {
                                    const x = snap.data();
                                    x.id = doc.id;
                                    (x.leader = doc.data().leader),
                                        (x.status = doc.data().status),
                                        (x.zoneNumber = doc.data().zoneNumber);

                                    data.push(x);
                                },
                                function (error) {
                                    Alert.alert(error.toString());
                                }
                            );
                        // push promise from get into results
                        results.push(docRef);
                    });
                    // dbPromise.then() resolves to  a single promise that resolves
                    // once all results have resolved
                    return Promise.all(results);
                },
                function (val) {
                    d;
                    // The Promise was rejected.
                    console.log(val);
                }
            )
            .then(() => {
                this.setState({
                    data_unarrived: data,
                    refreshing: false,
                });
            })
            .then(() => {
                console.log(this.state.data_unarrived);

            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });



    }

    componentDidMount() {

        console.log(this.props.route.params.eventID)
        this.getArrived()

    }

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <TouchableOpacity style={styles.card} onPress={() => { alert("Pressed"); }} >
                        <Text style={styles.text}>Start/Pause</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => { alert("Pressed"); }} >
                        <Text style={styles.text}>Post Pone</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => { alert("Pressed"); }} >
                        <Text style={styles.text}>Cancel Event</Text>

                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )

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