import React, { Component } from "react";
import { ImageBackground } from "react-native";
import { FlatList } from "react-native";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Button,
  Alert,
} from "react-native";
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';

import fire from "../database/firebase";
import DefaultCard from "../assets/Defaultcardview";
import { Icon } from "react-native-elements";

const TIME_NOW_IN_UTC = moment.utc();

export default class VolunteerHome extends Component {
  _isMounted = false;
  state = {
    data: [],
    eventID: "",
    status: false,
    arrivalStatus: false,
    volunteerCompletedEvents: [],
  eventName:""
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
 addEventToCalendar(title,description,date) {
    const eventConfig = {
      title: title,
      startDate: date,
      endDate: date,
      notes: description
    };
  
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
        alert(JSON.stringify(eventInfo));
      })
      .catch(error => {
        alert('Error ', error);
      });
  }
  

  handleDelete = () => {
    Alert.alert(
      "Remove",
      "Are you sure ? This will remove you from this event ",

      [
        {
          text: "No",
          onPress: () => {
            console.log("No");
          },
        },
        {
          text: "Yes",
          onPress: () => {
            this.removeVolunteer();
          },
        },
      ]
    );
  };

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
        arrived: true,
      })
      .then(() => {
        Alert.alert("Arrival reported!");
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };
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
          return Alert.alert("Already a volunteer!");
        } else {
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
              zoneNumber: 0,
              arrived: false,
            })
            .then(() => {
              Alert.alert("Event Joined Successfully!");
            })
            .catch((err) => {
              console.log(err.toString());
            });
        }
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

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
        console.log(err.toString());
      });
  };

  getCompletedEvents = async () => {
    await fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .where("eventStatus", "==", "completed")
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          var results = [];
          var data = [];
          querySnapshot.forEach((doc) => {
            var docRef = fire
              .firestore()
              .collection("ADMIN")
              .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
              .collection("EVENT MANAGEMENT")
              .doc(doc.id)
              .collection("VOLUNTEERS")
              .doc(fire.auth().currentUser.uid.toString())
              .get()
              .then((doc_1) => {
                if (doc_1.exists) {
                  data.push(doc.data());
                }
              });
            results.push(docRef);
          });

          this.setState({
            volunteerCompletedEvents: data,
          });
          return Promise.all(results);
        }
      })

      .then(() => {
        console.log(this.state.volunteerCompletedEvents);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  };

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
            const x = doc.data();
            x.id = doc.id;
            eventID = doc.id.toString();
            data.push(x);
          });
          this.setState({
            eventID: eventID,

            data: data,
            refreshing: false,
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
                console.log("else bhitra");
                const data_1 = [];
                subdoc.forEach((doc_1) => {
                  const x = doc_1.data();
                  x.id = doc_1.id;
                  eventID = doc_1.id.toString();
                  data_1.push(x);
                });
                this.setState({
                  eventID: eventID,
                  data: data_1,
                });
              }
            })
            .catch((err) => {
              console.log(err.toString() + " error");
            });
        }
      })
      .then(() => {
        // console.log(this.state.eventID);
        if (this.state.eventID != "") {
          this.statusCheck();
        } else {
          this.getCompletedEvents();
        }
      })

      .catch((err) => {
        console.log(err.toString());
      });
  };

  statusCheck = () => {
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
          var arrived = false;
          sub.forEach((doc) => {
            arrived = doc.data().arrived;
          });

          this.setState({
            status: true,
            arrivalStatus: arrived,
            refreshing: false,
          });
        }
      })
      .then(() => {
        this.getCompletedEvents();
      })

      .catch((err) => {
        console.log(err.toString());
      });
  };

  componentDidMount() {
    this._isMounted = true;
    this.getCurrentEvent();
  }

  render() {
    const { navigation } = this.props;
    return (
      <ImageBackground
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/geoclean-d8fa8.appspot.com/o/loginBackground.png?alt=media&token=42816f1f-8ecb-4ae5-9dd4-3d9c7f4ce377",
        }}
        style={styles.backgroundStyle}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.headerText}>Ongoing Event</Text>
          </View>
          <View style={{ flex: 1, padding: 10 }}>
            <FlatList
              data={this.state.data}
              ListEmptyComponent={this.emptyComponent}
              renderItem={({ item, key }) => (
                <TouchableOpacity style={styles.flatView}>
                  <View style={styles.rowView}>
                    <Text style={styles.headerText}>{item.eventDate}</Text>
                    <Text style={styles.headerText}>{item.eventTime}</Text>
                  </View>
                  <View>
                    <Text style={styles.headerText}>{item.address}</Text>
                  </View>
                  <View>
                    <Text style={styles.headerText}>{item.eventName}</Text>
                  </View>
                  <View style={{ marginLeft: 20, marginBottom: 15 }}>
                    <Text>{item.eventDescription}</Text>
                  </View>

                  <View>
                    {this.state.arrivalStatus && this.state.status ? (
                      <View style={{ margin: "5%", flexDirection: "row" }}>
                        <View
                          style={{ flexDirection: "row", marginLeft: "5%" }}
                        >
                          <Text style={styles.headerText}>Checked In</Text>
                          <Icon
                            name="check-circle"
                            type="font-awesome"
                            color="green"
                            onPress={this.iconPress}
                            size={30}
                            margin="2%"
                          ></Icon>
                        </View>
                        <TouchableOpacity
                          style={styles.reportButton}
                          onPress={() => {
                            navigation.navigate("ReportObject", {
                              ID: this.state.eventID,
                            });
                          }}
                        >
                          <Text style={styles.headerText}>Report</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ marginLeft: "10%" }}
                          onPress={this.handleDelete}
                        >
                          <Icon
                            name="delete"
                            color="rgba(255, 96, 92,0.9)"
                            size={50}
                          ></Icon>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View>
                        {!this.state.status ? (
                          <TouchableOpacity
                            style={styles.button}
                            onPress={this.joinEvent}
                          >
                            <Text style={styles.headerText}>Join</Text>
                          </TouchableOpacity>
                        ) : (
                          
                            <TouchableOpacity
                            style={styles.button}
                    
                            onPress={this.reportArrival}
                          >
                            <Text style={styles.headerText}>Check In</Text>
                          </TouchableOpacity>
                         
                          
                       
                        )}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            ></FlatList>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  safeview: {
    backgroundColor: "#a09fdf",
    height: "100%",
    width: "100%",
  },
  rowView: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  flatView: {
    backgroundColor: "lightblue",
    borderRadius: 20,
    height: "100%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    margin: "2%",
  },
  backgroundStyle: {
    height: "100%",
    width: "100%",
  },
  button: {
    margin: "2%",

    alignItems: "center",
    backgroundColor: "rgba(0, 202, 78,0.8)",

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius:10
  },
  reportButton: {
    margin: "2%",

    alignItems: "center",
    backgroundColor: "rgba(255, 189, 68,0.7)",

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 10,
  },
});
