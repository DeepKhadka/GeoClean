import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Button, Alert } from "react-native";
import fire from "../database/firebase";

export default class VolunteerManagement extends Component {

    state = {
        eventID: "",
        data: null
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
                    
          await  fire
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
                        .catch((err)=>{
                            console.log(err.toString()+" error")
                        });



                }
            })
            .then(() => {
                console.log("here1 - " + this.state.eventID)

            })
            .catch((err) => {
                console.log(err.toString());
            });
    };
    handleRelease =()=>{
        Alert.alert(
            "Release",
            "Are you sure ? This will release all volunteers. ",
      
            [
              {
                text: "No",
                onPress: () => {
                  console.log("No")
                },
              },
              {
                text: "Yes",
                onPress: () => {
                  this.releaseAllVolunteers();
                },
              },
            ]
          );
    }



    releaseAllVolunteers = async () => {

        if(this.state.eventID==""){
            Alert.alert("No event in progress!")

        }else{
            await fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .doc(this.state.eventID.toString())
            .collection("VOLUNTEERS")
            .get()
            .then(

                (sub) => {
                    if (sub.docs.length > 0) {
                        var results = []
                        sub.forEach((doc) => {
                            var docRef = fire
                                .firestore()
                                .collection("ADMIN")
                                .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
                                .collection("EVENT MANAGEMENT")
                                .doc(this.state.eventID.toString())
                                .collection("VOLUNTEERS")
                                .doc(doc.id)
                                .update({
                                    leader: false,
                                    status: false
                                })
                                .then(
                                    console.log("Updated - " + doc.id.toString())
                                );
                            results.push(docRef);


                        })
                        return Promise.all(results);



                    }
                }
            )
            .then(() => {
                console.log("Yeta - " + this.state.data)
                Alert.alert("All Volunteers released!")
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

        }


       
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


                <TouchableOpacity style={styles.card} onPress={this.handleRelease} >

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