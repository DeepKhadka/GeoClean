import React, { Component } from "react";
import { BlurView } from "@react-native-community/blur";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Button,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import fire from "../database/firebase";
import DefaultCard from "../assets/Defaultcardview";
import {
  Spinner,
  Center,
  NativeBaseProvider,
  Select,
  Box,
  Progress,
  VStack,
  Heading,
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
    switch: false,
    refreshing: false,
    past_pressed: false,
    noOfZoneCompleted: 0,
  };

  getZoneCompleted = async () => {
    this._isMounted &&
      (await fire
        .firestore()
        .collection("ADMIN")
        .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
        .collection("EVENT MANAGEMENT")
        .doc(this.state.currenteventID)
        .collection("VOLUNTEERS")
        .where("zoneCompletion", "==", true)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length > 0 && this._isMounted) {
            this._isMounted &&
              this.setState({
                noOfZoneCompleted: querySnapshot.docs.length,
                loading: false,
                refreshing: false,
              });
          } else {
            this._isMounted &&
              this.setState({
                loading: false,
                refreshing: false,
              });
          }
        }));
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
            this._isMounted && this.handleCancel();
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
            this._isMounted && this.releaseAllVolunteers();
          },
        },
      ]
    );
  };

  handleCompletedCheck = () => {
    if (this.state.noOfZoneCompleted == 6) {
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
              this._isMounted && this.handleCompleted();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Complete",
        "Are you sure? Some zones have not been marked complete.",

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
              this._isMounted && this.handleCompleted();
            },
          },
        ]
      );
    }
  };

  releaseAllVolunteers = async () => {
    this._isMounted &&
      (await fire
        .firestore()
        .collection("ADMIN")
        .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
        .collection("EVENT MANAGEMENT")
        .doc(this.state.currenteventID)
        .collection("VOLUNTEERS")
        .get()
        .then((sub) => {
          if (sub.docs.length > 0 && this._isMounted) {
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
        }));
  };

  getArrived = async () => {
    this._isMounted &&
      (await fire
        .firestore()
        .collection("ADMIN")
        .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
        .collection("EVENT MANAGEMENT")
        .doc(this.state.currenteventID)
        .collection("VOLUNTEERS")
        .where("arrived", "==", true)
        .get()
        .then((sub) => {
          if (sub.docs.length > 0 && this._isMounted) {
            this._isMounted &&
              this.setState({
                arrived: sub.docs.length,
              });
          }
        })
        .then(() => {
          console.log(this.state.arrived);
          this._isMounted && this.getUnArrived();
        })
        .catch((err) => {
          console.log(err.toString());
        }));
  };

  getUnArrived = async () => {
    this._isMounted &&
      (await fire
        .firestore()
        .collection("ADMIN")
        .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
        .collection("EVENT MANAGEMENT")
        .doc(this.state.currenteventID)
        .collection("VOLUNTEERS")
        .where("arrived", "==", false)
        .get()
        .then((sub) => {
          if (sub.docs.length > 0 && this._isMounted) {
            this.setState({
              unarrived: sub.docs.length,
              loading: false,
              refreshing: false,
            });
          } else {
            this._isMounted &&
              this.setState({
                unarrived: 0,
                refreshing: false,
              });
          }
        })
        .then(() => {
          console.log(this.state.unarrived);
          this._isMounted && this.getZoneCompleted();
        })
        .catch((err) => {
          console.log(err.toString());
        }));
  };

  //Start the event
  handleStart = () => {
    this._isMounted &&
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
          this._isMounted &&
            this.setState({
              currenteventStatus: "current",
            });
          this._isMounted && this.componentDidMount();
        })
        .catch((err) => {
          console.log(err.toString());
        });
  };

  //pause the event
  handlePause = () => {
    this._isMounted &&
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
          this._isMounted &&
            this.setState({
              currenteventStatus: "paused",
            });
          this._isMounted && this.componentDidMount();
        })
        .catch((err) => {
          console.log(err.toString());
        });
  };

  //handles event status to completed
  handleCompleted = () => {
    this._isMounted &&
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
          this._isMounted &&
            this.setState({
              data_current: null,
              data_completed: null,
              currenteventStatus: "",
              currenteventID: "",
              arrived: 0,
              notarrived: 0,
              arrived_past: 0,
              notarrived_past: 0,
            });
          this._isMounted && this.componentDidMount();
        })
        .catch((err) => {
          console.log(err.toString());
        });
  };

  handleCancel = () => {
    this._isMounted &&
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
          this._isMounted &&
            this.setState({
              data_current: null,
              data_completed: null,
              currenteventStatus: "",
              currenteventID: "",
              arrived: 0,
              notarrived: 0,
              arrived_past: 0,
              notarrived_past: 0,
              loading: true,
              switch: false,
              refreshing: false,
            });
          this._isMounted && this.componentDidMount();
        })
        .catch((err) => {
          console.log(err.toString());
        });
  };

  //gets the event ID of current/paused event
  getCurrentEvent = async () => {
    var eventID;
    var eventStatus;

    this._isMounted &&
      (await fire
        .firestore()
        .collection("ADMIN")
        .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
        .collection("EVENT MANAGEMENT")
        .where("eventStatus", "==", "current")
        .get()
        .then(async (sub) => {
          if (sub.docs.length > 0 && this._isMounted) {
            const data = [];
            sub.forEach((doc) => {
              const x = doc.data();
              x.eventID = doc.id;
              eventStatus = doc.data().eventStatus;
              eventID = doc.id.toString();
              data.push(x);
            });
            this._isMounted &&
              this.setState({
                currenteventID: eventID,
                currenteventStatus: eventStatus,
                data_current: data,
                loading: false,
              });
          } else {
            this._isMounted &&
              (await fire
                .firestore()
                .collection("ADMIN")
                .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
                .collection("EVENT MANAGEMENT")
                .where("eventStatus", "==", "paused")
                .get()
                .then((subdoc) => {
                  if (subdoc.docs.length > 0 && this._isMounted) {
                    const data = [];
                    subdoc.forEach((doc_1) => {
                      const x = doc_1.data();
                      x.eventID = doc_1.id;
                      eventID = doc_1.id.toString();
                      eventStatus = doc_1.data().eventStatus;
                      data.push(x);
                    });
                    this._isMounted &&
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
                }));
          }
        })
        .then(() => {
          console.log(this.state.data_current);
          this._isMounted && this.getCompleted();
        })
        .catch((err) => {
          console.log(err.toString());
        }));
  };

  async getCompleted() {
    this._isMounted &&
      (await fire
        .firestore()
        .collection("ADMIN")
        .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
        .collection("EVENT MANAGEMENT")
        .where("eventStatus", "==", "completed")
        .get()
        .then((sub) => {
          if (sub.docs.length > 0 && this._isMounted) {
            const data = [];
            sub.forEach((doc) => {
              const x = doc.data();
              x.eventID = doc.id;
              data.push(x);
            });
            this._isMounted &&
              this.setState({
                data_completed: data,
                loading: false,
              });
          }
        })
        .then(() => {
          console.log(this.state.data_completed);
          if ((this.state.currenteventID == "") & this._isMounted) {
            this._isMounted &&
              this.setState({
                loading: false,
                refreshing: false,
              });
          } else {
            this._isMounted && this.getArrived();
          }
        })
        .catch((err) => {
          console.log(err.toString());
        }));
  }

  emptyComponent = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20, fontStyle: "italic", fontWeight: "bold" }}>
          No events...
        </Text>
      </View>
    );
  };

  componentDidMount() {
    this._isMounted = true;
    this.getCurrentEvent();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleRefresh = () => {
    this._isMounted &&
      this.setState(
        {
          refreshing: true,

          data_current: null,
          data_completed: null,
          currenteventStatus: "",
          currenteventID: "",
          arrived: 0,
          notarrived: 0,
          arrived_past: 0,
          notarrived_past: 0,
          past_pressed: false,
        },
        () => {
          this.componentDidMount();
        }
      );
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={require("../assets/background.png")}
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
                {this.state.currenteventID == "" ? null : (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      backgroundColor: "lightblue",
                      margin: "2%",
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      this.setState({
                        currenteventID: "",
                        past_pressed: true,
                      });
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

                {!this.state.past_pressed ? null : (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      backgroundColor: "lightblue",
                      margin: "2%",
                      borderRadius: 5,
                    }}
                    onPress={this.handleRefresh}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        padding: "2%",
                      }}
                    >
                      Show Ongoing Events
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text
                style={{
                  fontSize: 15,
                  color: "gray",
                  alignSelf: "center",
                  margin: "2%",
                }}
              >
                Pull to Refresh
              </Text>

              <View style={{ flex: 14 }}>
                {this.state.currenteventID == "" ? (
                  <FlatList
                    data={this.state.data_completed}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          margin: "2%",
                          padding: "2%",
                          borderRadius: 10,

                          backgroundColor: "rgba(0, 0, 0, 0.2)",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.1,
                          shadowRadius: 2,
                        }}
                      >
                        <View
                          style={{
                            borderBottomWidth: 1,
                            padding: "3%",
                            backgroundColor: "transparent",
                          }}
                        >
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

                          <View
                            style={{
                              justifyContent: "space-between",
                              marginTop: "5%",
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                borderRadius: 10,
                                marginTop: "3%",
                                alignItems: "center",
                                backgroundColor: "rgba(36,160,237,0.5)",
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
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    ListEmptyComponent={this.emptyComponent}
                  />
                ) : (
                  <FlatList
                    data={this.state.data_current}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          margin: "5%",
                          padding: "2%",
                          borderRadius: 10,
                          backgroundColor: "rgba(0, 0, 0, 0.2)",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.1,
                          shadowRadius: 2,
                        }}
                      >
                        <View style={{ padding: "2%" }}>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "flex-end",
                              alignItems: "center",
                            }}
                          >
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                              ONGOING EVENT
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              marginTop: "3%",
                            }}
                          >
                            <NativeBaseProvider>
                              <Center flex={1}>
                                <Box w="100%">
                                  <VStack mx={4} space="md">
                                    <Progress
                                      colorScheme="emerald"
                                      value={
                                        (this.state.noOfZoneCompleted / 6) * 100
                                      }
                                    />
                                  </VStack>
                                </Box>
                              </Center>
                            </NativeBaseProvider>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                              {this.state.noOfZoneCompleted} / 6
                            </Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={{ alignItems: "center" }}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: "bold",
                                  marginTop: "1%",
                                }}
                              >
                                Zone Completion Status
                              </Text>
                            </View>
                          </View>

                          {this.state.noOfZoneCompleted == 6 ? (
                            <View style={{ flex: 1 }}>
                              {" "}
                              <View style={{ flexDirection: "row" }}>
                                <Image
                                  source={require("../assets/start.png")}
                                  style={{
                                    transform: [{ scale: 1 }],
                                  }}
                                />
                                <Text
                                  style={{
                                    fontSize: 15,
                                    fontWeight: "bold",
                                    marginLeft: "3%",
                                  }}
                                >
                                  All Zone leaders have marked complete
                                </Text>
                              </View>
                              <View style={{ alignItems: "center" }}>
                                <Text
                                  style={{
                                    fontSize: 15,
                                    fontWeight: "bold",
                                    marginLeft: "3%",
                                  }}
                                >
                                  You can close the event now
                                </Text>
                              </View>
                            </View>
                          ) : null}
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
                                style={{
                                  borderRadius: 20,
                                  flexDirection: "row",
                                  justifyContent: "space-evenly",
                                  alignItems: "center",
                                  backgroundColor: "rgba(0, 202, 78,0.6)",
                                  paddingHorizontal: "2%",
                                  shadowOffset: {
                                    width: 0,
                                    height: 2,
                                  },
                                  shadowOpacity: 0.1,
                                  shadowRadius: 2,
                                  elevation: 10,
                                }}
                                onPress={this.handleStart}
                              >
                                <Image
                                  source={require("../assets/start.png")}
                                  style={{
                                    transform: [{ scale: 1 }],
                                  }}
                                />
                                <Text
                                  style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    marginLeft: "3%",
                                  }}
                                >
                                  Start
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={{
                                  borderRadius: 20,
                                  flexDirection: "row",
                                  justifyContent: "space-evenly",
                                  alignItems: "center",
                                  backgroundColor: "rgba(255, 189, 68,0.7)",
                                  paddingHorizontal: "2%",
                                  shadowOffset: {
                                    width: 0,
                                    height: 2,
                                  },
                                  shadowOpacity: 0.1,
                                  shadowRadius: 2,
                                  elevation: 10,
                                }}
                                onPress={this.handlePause}
                              >
                                <Image
                                  source={require("../assets/pause.png")}
                                  style={{
                                    opacity: 0.7,
                                    transform: [{ scale: 1 }],
                                  }}
                                />

                                <Text
                                  style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    marginLeft: "3%",
                                  }}
                                >
                                  Pause
                                </Text>
                              </TouchableOpacity>
                            )}

                            <TouchableOpacity
                              style={{
                                borderRadius: 20,
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                backgroundColor: "rgba(0, 202, 78,0.6)",
                                paddingHorizontal: "2%",
                                shadowOffset: {
                                  width: 0,
                                  height: 2,
                                },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 10,
                              }}
                              onPress={this.handleCompletedCheck}
                            >
                              <Image
                                source={require("../assets/complete.png")}
                                style={{
                                  transform: [{ scale: 1 }],
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: "bold",

                                  marginLeft: "3%",
                                }}
                              >
                                Complete
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                borderRadius: 20,
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                backgroundColor: "rgba(255, 96, 92,0.8)",
                                padding: "2%",
                                shadowOffset: {
                                  width: 0,
                                  height: 2,
                                },
                                shadowOpacity: 0.1,
                                shadowRadius: 2,
                                elevation: 10,
                              }}
                              onPress={this.handleCancelCheck}
                            >
                              <Image
                                source={require("../assets/cancel.png")}
                                style={{
                                  transform: [{ scale: 1 }],
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: "bold",
                                  marginLeft: "3%",
                                }}
                              >
                                Cancel
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
                                borderRadius: 10,
                                alignItems: "center",
                                backgroundColor: "rgba(36,160,237,0.5)",
                              }}
                              onPress={() => {
                                this.props.navigation.navigate(
                                  "AssignVolunteer",
                                  {
                                    eventName: item.eventName,
                                  }
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
                                borderRadius: 10,
                                marginTop: "3%",
                                alignItems: "center",
                                backgroundColor: "rgba(36,160,237,0.5)",
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
                                borderRadius: 10,
                                marginTop: "3%",
                                alignItems: "center",
                                backgroundColor: "rgba(36,160,237,0.5)",
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
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    ListEmptyComponent={this.emptyComponent}
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
