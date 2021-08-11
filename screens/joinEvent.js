import React, { Component } from "react";
import { View, FlatList, ListItem, StyleSheet, SafeAreaView, TouchableOpacity, Text, Button, Alert } from "react-native";
import fire from "../database/firebase";
import {
    Spinner,
    HStack,
    useColorModeValue,
    Center,
    NativeBaseProvider,
    Select,
} from "native-base";

export default class JoinEvent extends Component {

    state = {
        data: null,
        loading: true,
        refreshing: false,
        eventID: ""
    }

    handleRefresh = () => {
        this.setState(
          {
            refreshing: true,
          },
          () => {
            this.componentDidMount();
          }
        );
      };

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
                        eventID = doc.id.toString();
                        data.push(x);

                    });
                    this.setState({
                        data: data,
                        eventID: eventID,
                        refreshing:false
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

        fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .doc(this.state.eventID)
            .collection("VOLUNTEERS")
            .where("volunteerID", "==", fire.auth().currentUser.uid.toString())
            .get()
            .then((sub) => {
                if (sub.docs.length > 0) {
                    return Alert.alert("Already a volunteer!")
                }
                else {
                    fire
                        .firestore()
                        .collection("ADMIN")
                        .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
                        .collection("EVENT MANAGEMENT")
                        .doc(this.state.eventID)
                        .collection("VOLUNTEERS")
                        .doc(fire.auth().currentUser.uid.toString())
                        .set({
                            volunteerID: fire.auth().currentUser.uid.toString(),
                            status: "active",
                            leader: false,
                            zoneNumber: 0

                        })
                        .then(() => {
                            Alert.alert("Event Joined Successfully!")
                            this.props.navigation.goBack();
                        })
                        .catch((err) => {
                            console.log(err.toString())
                        })


                }


            })
            .catch((err) => {
                console.log(err.toString())
            })




    }



    componentDidMount() {
        this.getCurrentEvent();
    }

    emptyComponent = () => {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 20, fontStyle: "italic", fontWeight: "bold" }}>
                    No Volunteers Signed Up Yet...
                </Text>
            </View>
        );
    };



    render() {
        const { navigation } = this.props;


        return (
            <SafeAreaView style={{ flex: 1 }}>
             


                  {
                      this.state.data ? (
                        <FlatList
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.card} onPress={this.joinEvent}>
                                <View style={{ padding: "5%" }}>
                                    <Text style={styles.headerText} >
                                        {item.eventName}
                                    </Text>

                                    <Text style={styles.text}>
                                        Time :{item.eventTime}
                                    </Text>
                                    <Text style={styles.text}>
                                        Date :{item.eventDate}
                                    </Text>
                                    <Text style={styles.text}>
                                        Description:  {item.eventDescription}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.eventDate}
                        ListEmptyComponent={this.emptyComponent}
                        refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}

                    />
                      ):(
                        <NativeBaseProvider>
                        <Center flex={1}>
                          <Spinner color="blue.500" />
                        </Center>
                      </NativeBaseProvider>
                      )
                  }





            </SafeAreaView>
        );





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

        fontSize: 15,
        fontWeight: 'bold',
        marginTop: "2%"


    },
    headerText: {

        fontSize: 20,
        fontWeight: 'bold',


    },




});