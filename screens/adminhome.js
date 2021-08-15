import React, { Component } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Button,
  ImageBackground,
  Alert,
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
import { RectButton } from "react-native-gesture-handler";
import { FlatList } from "react-native";

export default class AssignHome extends Component {
  _isMounted = false;
  state = {
    data_current: null,
    data_completed: null,
    currenteventStatus: "",
    currenteventID: "",
    arrived: 0,
    notarrived: 0,
    arrived_past: 0,
    notarrived_past: 0,
    loading: true,
    switch:false
  };

  handleCancelCheck = () => {
    Alert.alert(
      "Cancel Event",
      "Are you sure ? This will cancel the event. ",

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
            this.handleCancel();
          },
        },
      ]
    );
  };

  handleRelease = () => {
    Alert.alert(
      "Release",
      "Are you sure ? This will release all volunteers. ",

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
            this.releaseAllVolunteers();
          },
        },
      ]
    );
  };

  handleCompletedCheck = () => {
    Alert.alert(
      "Complete",
      "Are you sure ? This will complete the event. ",

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
            this.handleCompleted();
          },
        },
      ]
    );
  };

  releaseAllVolunteers = async () => {
    await fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(this.state.currenteventID)
      .collection("VOLUNTEERS")
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          var results = [];
          sub.forEach((doc) => {
            var docRef = fire
              .firestore()
              .collection("ADMIN")
              .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
              .collection("EVENT MANAGEMENT")
              .doc(this.state.currenteventID.toString())
              .collection("VOLUNTEERS")
              .doc(doc.id)
              .update({
                leader: false,
                status: false,
              })
              .then(console.log("Updated - " + doc.id.toString()));
            results.push(docRef);
          });
          return Promise.all(results);
        }
      })
      .then(() => {
        Alert.alert("All Volunteers released!");
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
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
        } else {
          this.setState({
            unarrived: 0,
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
            loading: false,
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
                  loading: false,
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
            loading: false,
          });
        }
      })
      .then(() => {
        console.log(this.state.data_completed);
        if (this.state.currenteventID == "") {
          this.setState({
            loading: false,
          });
        } else {
          this.getArrived();
        }
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
        <ImageBackground
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/geoclean-d8fa8.appspot.com/o/loginBackground.png?alt=media&token=42816f1f-8ecb-4ae5-9dd4-3d9c7f4ce377",
          }}
          style={{ flex: 1 }}
        >
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
                  onPress={() => {
                    this.props.navigation.navigate("StartEvent");
                  }}
                >
                  <Text
                    style={{ fontSize: 15, fontWeight: "bold", padding: "2%" }}
                  >
                    Start an Event
                  </Text>
                </TouchableOpacity>
                {this.state.currenteventID == "" ? (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      backgroundColor: "lightblue",
                      margin: "2%",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        padding: "2%",
                      }}
                    >
                      Ongoing Event
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      backgroundColor: "lightblue",
                      margin: "2%",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        padding: "2%",
                      }}
                    >
                      View Completed Events
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={{
                    backgroundColor: "lightblue",

                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
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

              <View style={{ flex: 14 }}>
                {this.state.currenteventID == "" ? (
                  <FlatList
                    data={this.state.data_completed}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          margin: "5%",
                          padding: "2%",
                          borderRadius: 10,
                          backgroundColor: "lightblue",
                        }}
                      >
                        <View style={{ borderBottomWidth: 1, padding: "3%" }}>
                          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            COMPLETED EVENT
                          </Text>
                        </View>
                        <View style={{ padding: "2%" }}>
                          <View style={{ marginTop: "1%" }}>
                            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                              {item.eventName}
                            </Text>
                          </View>
                          <View style={{ marginTop: "2%" }}>
                            <Text style={{ fontSize: 16, opacity: 0.6 }}>
                              {item.eventDescription}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: "2%",
                            }}
                          >
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                              >
                                Date :{" "}
                              </Text>
                              <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                              >
                                {item.eventDate}
                              </Text>
                            </View>
                            <View
                              style={{ flexDirection: "row", marginLeft: "5%" }}
                            >
                              <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                              >
                                Time :{" "}
                              </Text>
                              <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                              >
                                {item.eventTime}
                              </Text>
                            </View>
                          </View>

                          <View style={{}}></View>

                          <View
                            style={{
                              justifyContent: "space-between",
                              marginTop: "5%",
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                borderWidth: 1,
                                borderRadius: 10,
                                marginTop: "3%",
                                alignItems: "center",
                              }}
                              onPress={() => {
                                navigation.navigate("EventStatus", {
                                  eventID: item.eventID,
                                });
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: "bold",
                                  padding: "2%",
                                }}
                              >
                                Arrival Checklist
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item) => item.eventID}

                    // refreshing={this.state.refreshing}
                    // onRefresh={this.handleRefresh}
                  />
                ) : (
                  <FlatList
                    data={ this.state.data_current}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          margin: "5%",
                          padding: "2%",
                          borderRadius: 10,
                          backgroundColor: "lightblue",
                        }}
                      >
                        <View style={{ borderBottomWidth: 1, padding: "3%" }}>
                          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            ONGOING EVENT
                          </Text>
                        </View>
                        <View style={{ padding: "2%" }}>
                          <View style={{ marginTop: "1%" }}>
                            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                              {item.eventName}
                            </Text>
                          </View>
                          <View style={{ marginTop: "2%" }}>
                            <Text style={{ fontSize: 16, opacity: 0.6 }}>
                              {item.eventDescription}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: "2%",
                            }}
                          >
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                              >
                                Date :{" "}
                              </Text>
                              <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                              >
                                {item.eventDate}
                              </Text>
                            </View>
                            <View
                              style={{ flexDirection: "row", marginLeft: "5%" }}
                            >
                              <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                              >
                                Time :{" "}
                              </Text>
                              <Text
                                style={{ fontSize: 20, fontWeight: "bold" }}
                              >
                                {item.eventTime}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: "2%",
                            }}
                          >
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{ fontSize: 18, fontWeight: "bold" }}
                              >
                                Checked-in :{" "}
                              </Text>
                              <Text
                                style={{ fontSize: 18, fontWeight: "bold" }}
                              >
                                {this.state.arrived}
                              </Text>
                            </View>
                            <View
                              style={{ flexDirection: "row", marginLeft: "5%" }}
                            >
                              <Text
                                style={{ fontSize: 18, fontWeight: "bold" }}
                              >
                                Not Checked-in :{" "}
                              </Text>
                              <Text
                                style={{ fontSize: 18, fontWeight: "bold" }}
                              >
                                {this.state.unarrived}
                              </Text>
                            </View>
                          </View>
                          <View style={{}}></View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginTop: "3%",
                            }}
                          >
                            {this.state.currenteventStatus != "current" ? (
                              <TouchableOpacity
                                style={{ borderWidth: 1, borderRadius: 20 }}
                                onPress={this.handleStart}
                              >
                                <Text
                                  style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    padding: "2%",
                                  }}
                                >
                                  Start
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={{ borderWidth: 1, borderRadius: 20 }}
                                onPress={this.handlePause}
                              >
                                <Text
                                  style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    padding: "2%",
                                  }}
                                >
                                  Pause
                                </Text>
                              </TouchableOpacity>
                            )}

                            <TouchableOpacity
                              style={{ borderWidth: 1, borderRadius: 20 }}
                              onPress={this.handleCompletedCheck}
                            >
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: "bold",
                                  padding: "2%",
                                }}
                              >
                                Close Event
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{ borderWidth: 1, borderRadius: 20 }}
                              onPress={this.handleCancelCheck}
                            >
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: "bold",
                                  padding: "2%",
                                }}
                              >
                                Cancel Event
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              justifyContent: "space-between",
                              marginTop: "5%",
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                borderWidth: 1,
                                borderRadius: 10,
                                alignItems: "center",
                              }}
                              onPress={() => {
                                this.props.navigation.navigate(
                                  "AssignVolunteer"
                                );
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: "bold",
                                  padding: "2%",
                                }}
                              >
                                Assign Volunteer
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                borderWidth: 1,
                                borderRadius: 10,
                                marginTop: "3%",
                                alignItems: "center",
                              }}
                              onPress={() => {
                                navigation.navigate("EventStatus", {
                                  eventID: item.eventID,
                                });
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: "bold",
                                  padding: "2%",
                                }}
                              >
                                Arrival Checklist
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                borderWidth: 1,
                                borderRadius: 10,
                                marginTop: "3%",
                                alignItems: "center",
                              }}
                              onPress={this.handleRelease}
                            >
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: "bold",
                                  padding: "2%",
                                }}
                              >
                                Release all Volunteer
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item) => item.eventID}

                    // refreshing={this.state.refreshing}
                    // onRefresh={this.handleRefresh}
                  />
                )}
              </View>
            </View>
          )}
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
