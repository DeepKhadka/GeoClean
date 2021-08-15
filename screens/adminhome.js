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
import DefaultCard from "../assets/Defaultcardview";
import {
  Spinner,
  HStack,
  useColorModeValue,
  Center,
  NativeBaseProvider,
  Select,
} from "native-base";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class AssignHome extends Component {
  _isMounted = false;
  state = {
    data_current: null,
    data_completed: null,
    currenteventStatus: "",
    currenteventID: "",
    arrived: 0,
    notarrived: 0,
    loading: true,
  };

  getArrived = async () => {
    await fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(this.state.currenteventID)
      .collection("VOLUNTEERS")
      .where("arrived", "==", true)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          this.setState({
            arrived: sub.docs.length,
          });
        }
      })
      .then(() => {
        console.log(this.state.arrived);
        this.getUnArrived();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  getUnArrived = async () => {
    await fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(this.state.currenteventID)
      .collection("VOLUNTEERS")
      .where("arrived", "==", false)
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          this.setState({
            unarrived: sub.docs.length,
            loading: false,
          });
        }
      })
      .then(() => {
        console.log(this.state.unarrived);
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  //Start the event
  handleStart = () => {
    fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(this.state.currenteventID)
      .update({
        eventStatus: "current",
      })
      .then(() => {
        Alert.alert("Event started!");
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  //pause the event
  handlePause = () => {
    fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(this.state.currenteventID)
      .update({
        eventStatus: "paused",
      })
      .then(() => {
        Alert.alert("Event Paused!");
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  //handles event status to completed
  handleCompleted = () => {
    fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(this.state.currenteventID)
      .update({
        eventStatus: "completed",
      })
      .then(() => {
        Alert.alert("Event completed!");
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  handleCancel = () => {
    fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(this.state.currenteventID)
      .update({
        eventStatus: "canceled",
      })
      .then(() => {
        Alert.alert("Event canceled!");
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  //gets the event ID of current/paused event
  getCurrentEvent = async () => {
    var eventID;
    var eventStatus;

    await fire
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
            x.eventID = doc.id;
            eventStatus = doc.data().eventStatus;
            eventID = doc.id.toString();
            data.push(x);
          });
          this.setState({
            currenteventID: eventID,
            currenteventStatus: eventStatus,
            data_current: data,
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
                const data = [];
                subdoc.forEach((doc_1) => {
                  const x = doc_1.data();
                  x.eventID = doc_1.id;
                  eventID = doc_1.id.toString();
                  eventStatus = doc_1.data().eventStatus;
                  data.push(x);
                });
                this.setState({
                  currenteventID: eventID,
                  currenteventStatus: eventStatus,
                  data_current: data,
                });
              }
            })
            .catch((err) => {
              console.log(err.toString() + " error");
            });
        }
      })
      .then(() => {
        console.log(this.state.data_current);
        this.getCompleted();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  async getCompleted() {
    await fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .where("eventStatus", "==", "completed")
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          const data = [];
          sub.forEach((doc) => {
            const x = doc.data();
            x.eventID = doc.id;
            data.push(x);
          });
          this.setState({
            data_completed: data,
          });
        }
      })
      .then(() => {
        console.log(this.state.data_completed);
        this.getArrived();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  }

  componentDidMount() {
    this._isMounted = true;
    this.getCurrentEvent();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.loading ? (
          <NativeBaseProvider>
            <Center flex={1}>
              <Spinner color="blue.500" />
            </Center>
          </NativeBaseProvider>
        ) : (
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  backgroundColor: "lightblue",
                  margin: "2%",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", padding: "2%" }}
                >
                  Start an Event
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  backgroundColor: "lightblue",
                  margin: "2%",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", padding: "2%" }}
                >
                  View Completed Events
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "lightblue",

                  borderRadius: 5,
                  justifyContent:"center",
                  alignItems:"center",
                  margin: "2%",
                  width: "10%",
                }}
                onPress={() => {
                  this.componentDidMount();
                }}
              >
                <Icon name="refresh" size={25}></Icon>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 14 }}></View>
          </View>
        )}
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
