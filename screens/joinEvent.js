import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Button } from "react-native";
import fire from "../database/firebase";

export default class JoinEvent extends Component {

    state = {
        data: null,
        loading: true,
    }


    getCurrentEvent = () => {

        var eventID;



        fire.firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .where("eventStatus", "==", "current")
            .get()
            .then((sub) => {
                if (sub.docs.length > 0) {

                    const data = []
                    sub.forEach((doc) => {
                        const x = doc.data();
                        x.id = doc.id.toString();
                        data.push(x);

                    });
                    this.setState({
                        data: data
                    })

                }

            })
            .then(() => {

                console.log(this.state.data)
                this.setState({
                    loading: false
                })


            })
            .catch((err) => {

                console.log(err.toString())
            })


    }

    joinEvent = () => {

    }



    componentDidMount() {
        this.getCurrentEvent();
    }



    render() {
        const { navigation } = this.props;


        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View>


                    <TouchableOpacity style={styles.card} onPress={() => { navigation.navigate("CurrentEvent"); }} >

                        <Text>Rush Creek Park</Text>

                    </TouchableOpacity>


                </View>
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