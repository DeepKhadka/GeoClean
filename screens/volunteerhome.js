import React, { Component } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Button,
} from "react-native";
import fire from "../database/firebase";

export default class VolunteerHome extends Component {
  state = {
    data: null,
    eventID: "",
    status: false,
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
        console.log(this.state.data);
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
          this.setState({
            status: true,
          });
        }
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
        <View>
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate("JoinEvent");
            }}
          >
            <Text style={styles.text}>Join Event</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate("CurrentEvent");
            }}
          >
            <Text style={styles.text}>Current Event</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate("ZONE");
            }}
          >
            <Text style={styles.text}>View Zones</Text>
          </TouchableOpacity>
        </View>
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
  mainView: {
    height: "100%",
    width: "100%",

    flex: 1,
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
    fontWeight: "bold",
  },
});
