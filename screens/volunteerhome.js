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

import fire from "../database/firebase";
import DefaultCard from "../assets/Defaultcardview";
import { Icon } from "react-native-elements";

export default class VolunteerHome extends Component {
  state = {
    data: null,
    eventID: "",
    status: false,
    arrivalStatus: false,
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
        console.log(this.state.eventID);
        if (this.state.eventID != "") {
          this.statusCheck();
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
          });
        }
      })
      .then(() => {
        console.log(this.state.zone_info);
      })

      .catch((err) => {
        console.log(err.toString());
      });
  };

  componentDidMount() {
    this.getCurrentEvent();
  }

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/geoclean-d8fa8.appspot.com/o/loginBackground.png?alt=media&token=42816f1f-8ecb-4ae5-9dd4-3d9c7f4ce377",
          }}
          style={styles.backgroundStyle}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.headerText}>Ongoing Event</Text>
          </View>
          <View style={{ padding: 10 }}>
            <FlatList
              data={this.state.data}
              renderItem={({ item, key }) => (
                <TouchableOpacity
                  style={styles.flatView}
                  onPress={this.joinEvent}
                >
                  <View style={styles.rowView}>
                    <Text style={styles.headerText}>{item.eventDate}</Text>
                    <Text style={styles.headerText}>{item.eventTime}</Text>
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
                        <Button
                          title="Report"
                          onPress={() => {
                            navigation.navigate("ReportObject", {
                              ID: this.state.eventID,
                            });
                          }}
                        ></Button>
                      </View>
                    ) : (
                      <View>
                        {!this.state.status ? (
                          <Button
                            title="Join"
                            style={styles.button}
                            onPress={this.joinEvent}
                          ></Button>
                        ) : (
                          <Button
                            title="Check In"
                            style={styles.button}
                            onPress={this.reportArrival}
                          ></Button>
                        )}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            ></FlatList>
          </View>
        </ImageBackground>
      </SafeAreaView>
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
    height: "30%",
    width: "50%",
  },
});
