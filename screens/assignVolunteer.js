import React, { Component } from "react";
import { View, SafeAreaView, TouchableOpacity, Text, Button, StyleSheet, FlatList, Switch } from "react-native";
import fire from "../database/firebase";
import {
    Spinner,
    HStack,
    useColorModeValue,
    Center,
    NativeBaseProvider,
} from "native-base";


export default class AssignVolunteer extends Component {

    _isMounted = false;

    state = {
        data: null,
        eventID: "",
        volunteers: null,
        refreshing: false,


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

                        eventID = doc.id.toString();


                    });
                    this.setState({

                        eventID: eventID
                    })

                }

            })
            .then(() => {


                this.getVolunteersInfo();



            })
            .catch((err) => {

                console.log(err.toString())
            })


    }


    async getVolunteersInfo() {
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
                            .collection("VOLUNTEER")
                            .doc(doc.id)
                            .get()
                            .then(
                                function (snap) {
                                    const x = snap.data();
                                    x.id = doc.id;
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
                    // The Promise was rejected.
                    console.log(val);
                }
            )
            .then(() => {
                this.setState({
                    data: data,
                    refreshing: false

                });
            })
            .then(() => {
                console.log(this.state.data)
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    emptyComponent = () => {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 20, fontStyle: "italic", fontWeight: "bold", }}>
                    No Volunteers Signed Up Yet...
                </Text>
            </View>
        );
    };



    componentDidMount() {
        this._isMounted = true;
        this.getCurrentEvent();
    }

    componentWillUnmount() {
        this._isMounted = false
    }




    render() {
        return (
            <SafeAreaView style={{ flex: 1, }}>
                {this.state.data ? (
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <View >
                                <Text>{item.fName}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.email}
                        ListEmptyComponent={this.emptyComponent}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh}
                    />
                ) : (
                    <NativeBaseProvider>
                        <Center flex={1}>
                            <Spinner color="blue.500" />
                        </Center>
                    </NativeBaseProvider>

                )}
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({

});