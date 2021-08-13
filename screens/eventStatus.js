
import React, { Component } from "react";
import { View, SectionList,StyleSheet, SafeAreaView, TouchableOpacity, Text, Button } from "react-native";

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
        const DATA=[
            {
                title:"Arrived",
                data:this.state.data_arrived

            },
            {
                title:"Not Arrived",
                data:this.state.data_unarrived
            }
        ];
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{flex:1,backgroundColor:"lightblue"}}>
            
                <SectionList
          sections={DATA}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <View style={styles.flatView} >
                
              <Text style={styles.text}>{item.fName} {item.lName}</Text>
              <Text style={styles.text}>Zone {item.zoneNumber}</Text>
              </View>
          
          )}



          renderSectionHeader={({ section: { title } }) => (
              <View><Text style={styles.text}>{title}</Text></View>
           
          )}
        />
               
               </View>
                
            </SafeAreaView>
        )

    }
}
const styles = StyleSheet.create({
    
    
    text: {
      fontSize: 25,
      fontWeight: "bold",
      margin: "5%",
    },
    headerText: {
      fontSize: 20,
      fontWeight: "bold",
      alignContent: "center",
      margin: "5%",
    },
    rowView: {
      flexDirection: "row",
      marginVertical: "5 %",
  
      margin: "5%",
    },
    flatView: {
      margin: "2%",
      backgroundColor: "lightblue",
      borderRadius: 20,
      flexDirection:"row"
    },
  });
  
 