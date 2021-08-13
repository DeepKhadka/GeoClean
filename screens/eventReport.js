import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Button } from "react-native";
import fire from "../database/firebase";

export default class EventReport extends Component {



    state = {

        data_1: [],
        data_2: [],
        data_3: [],
        data_4: [],
        data_5: [],
        data_6: [],

    }


    changeStatus = (zone, id, eventID) => {





        fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .doc(eventID)
            .collection("ZONE " + zone)
            .doc(id)
            .update({
                status: true
            })
            .then(() => {
                console.log("ACKNOWLEDGED!")
            })
            .catch((err) => {
                console.log(err.toString())
            })









    }


    getZone1 = () => {


        fire
            .firestore()
            .collectionGroup("ZONE 1")
            .where("status", "==", false)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const data = []
                    querySnapshot.forEach((doc) => {

                        const x = doc.data();
                        x.id = doc.id;

                        data.push(x);
                    })
                    this.setState({
                        data_1: data
                    })
                }

            })
            .then(() => {
                console.log(this.state.data_1)
                this.getZone2()
            })
            .catch((err) => {
                console.log(err.toString())
            })

    }

    getZone2 = () => {


        fire
            .firestore()
            .collectionGroup("ZONE 2")
            .where("status", "==", false)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const data = []
                    querySnapshot.forEach((doc) => {

                        const x = doc.data();
                        x.id = doc.id;
                        data.push(x);


                    })
                    this.setState({
                        data_2: data
                    })
                }

            })
            .then(() => {
                console.log(this.state.data_2)
                this.getZone3()
            })
            .catch((err) => {
                console.log(err.toString())
            })

    }

    getZone3 = () => {


        fire
            .firestore()
            .collectionGroup("ZONE 3")
            .where("status", "==", false)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const data = []
                    querySnapshot.forEach((doc) => {

                        const x = doc.data();
                        x.id = doc.id;
                        data.push(x);


                    })
                    this.setState({
                        data_3: data
                    })
                }

            })
            .then(() => {
                console.log(this.state.data_3)
                this.getZone4()
            })
            .catch((err) => {
                console.log(err.toString())
            })

    }

    getZone4 = () => {


        fire
            .firestore()
            .collectionGroup("ZONE 4")
            .where("status", "==", false)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const data = []
                    querySnapshot.forEach((doc) => {

                        const x = doc.data();
                        x.id = doc.id;
                        data.push(x);


                    })
                    this.setState({
                        data_4: data
                    })
                }

            })
            .then(() => {
                console.log(this.state.data_4)
                this.getZone5()
            })
            .catch((err) => {
                console.log(err.toString())
            })

    }

    getZone5 = () => {

        fire
            .firestore()
            .collectionGroup("ZONE 5")
            .where("status", "==", false)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const data = []
                    querySnapshot.forEach((doc) => {

                        const x = doc.data();
                        x.id = doc.id;
                        data.push(x);


                    })
                    this.setState({
                        data_5: data
                    })
                }

            })
            .then(() => {
                console.log(this.state.data_5)
                this.getZone6()
            })
            .catch((err) => {
                console.log(err.toString())
            })

    }

    getZone6 = () => {


        fire
            .firestore()
            .collectionGroup("ZONE 6")
            .where("status", "==", false)
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const data = []
                    querySnapshot.forEach((doc) => {

                        const x = doc.data();
                        x.id = doc.id;
                        data.push(x);


                    })
                    this.setState({
                        data_6: data
                    })
                }

            })
            .then(() => {
                console.log(this.state.data_6)
            })
            .catch((err) => {
                console.log(err.toString())
            })

    }



    componentDidMount() {
        this.getZone1()
    }


    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <Text>Objects</Text>
                    <TouchableOpacity style={styles.card} onPress={() => this.changeStatus(5, "VFU8xVsohmGp2TvE10FK", "FsYtafwHo5Y0bEGvKmmo")} >
                        <Text style={styles.text}>Object 1</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => { alert("Pressed"); }} >
                        <Text style={styles.text}>Object 2</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => { alert("Pressed"); }} >
                        <Text style={styles.text}>Other Report</Text>

                    </TouchableOpacity>
                    <View>
                        <Text>Completion</Text>
                        <Text> Zone Name Progress Bar</Text>

                    </View>
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