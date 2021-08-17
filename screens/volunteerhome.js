import React, { Component } from "react";
import { ImageBackground } from "react-native";
import { FlatList } from "react-native";
import {
  Spinner,
  HStack,
  useColorModeValue,
  Center,
  NativeBaseProvider,
  Select,
} from "native-base";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Button,
  Alert,
  Image,
} from "react-native";
import * as AddCalendarEvent from "react-native-add-calendar-event";
import moment from "moment";

import fire from "../database/firebase";

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
    refreshing: false,
    loading: true,
    past_pressed: false,
    eventName: "",
    volunteer_info: [],
  };
  componentWillUnmount() {
    this._isMounted = false;
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
        this._isMounted &&
          this.setState({
            arrivalStatus: true,
          });
        this._isMounted && this.componentDidMount();
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
        if (sub.docs.length > 0 && this._isMounted) {
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
              this._isMounted &&
                this.setState({
                  status: true,
                  arrivalStatus: false,

                  refreshing: false,
                });

              this._isMounted && this.componentDidMount();
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
        this._isMounted &&
          this.setState({
            data: [],
            eventID: "",
            status: false,
            arrivalStatus: false,
            volunteerCompletedEvents: [],
            refreshing: false,
          });
        this._isMounted && this.componentDidMount();
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
        if (querySnapshot.docs.length > 0 && this._isMounted) {
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
                if (doc_1.exists && this._isMounted) {
                  data.push(doc.data());
                }
              });
            results.push(docRef);
          });

          this._isMounted &&
            this.setState({
              volunteerCompletedEvents: data,
            });
          return Promise.all(results);
        }
      })

      .then(() => {
        this._isMounted &&
          this.setState({
            refreshing: false,
            loading: false,
          });
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
        if (sub.docs.length > 0 && this._isMounted) {
          const data = [];
          sub.forEach((doc) => {
            const x = doc.data();
            x.id = doc.id;
            eventID = doc.id.toString();
            data.push(x);
          });
          this._isMounted &&
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
              if (subdoc.docs.length > 0 && this._isMounted) {
                console.log("else bhitra");
                const data_1 = [];
                subdoc.forEach((doc_1) => {
                  const x = doc_1.data();
                  x.id = doc_1.id;
                  eventID = doc_1.id.toString();
                  data_1.push(x);
                });
                this._isMounted &&
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
        if (this.state.eventID != "" && this._isMounted) {
          this.statusCheck();
        } else {
          this.getCompletedEvents();
        }
      })

      .catch((err) => {
        console.log(err.toString());
      });
  };

  emptyComponent = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20, fontStyle: "italic", fontWeight: "bold" }}>
          No events...
        </Text>
      </View>
    );
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
          const data = [];
          var arrived = false;
          sub.forEach((doc) => {
            const x = doc.data();
            data.push(x);
            arrived = doc.data().arrived;
          });

          this.setState({
            volunteer_info: data,
            status: true,
            arrivalStatus: arrived,
          });
        }
      })
      .then(() => {
        console.log(this.state.volunteer_info);
        this.getCompletedEvents();
      })

      .catch((err) => {
        console.log(err.toString());
      });
  };

  handleRefresh = () => {
    this.setState(
      {
        data: [],
        volunteerCompletedEvents: [],
        refreshing: true,
        eventID: "",
        past_pressed: false,
      },
      () => {
        this.componentDidMount();
      }
    );
  };

  componentDidMount() {
    this._isMounted = true;
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
                {this.state.eventID == "" ? null : (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      backgroundColor: "lightblue",
                      margin: "2%",
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      this.setState({
                        eventID: "",
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
                      Past Events
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
                      Show Ongoing Event
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={{ alignItems: "center", marginBottom: "5%" }}>
                <Text style={{ fontSize: 15, color: "gray" }}>
                  Pull to refresh
                </Text>
              </View>

              <View style={{ flex: 14 }}>
                {this.state.eventID == "" ? (
                  <FlatList
                    data={this.state.volunteerCompletedEvents}
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
                        </View>
                      </View>
                    )}
                    keyExtractor={(item) => item.eventName}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    ListEmptyComponent={this.emptyComponent}
                  ></FlatList>
                ) : (
                  <FlatList
                    data={this.state.data}
                    renderItem={({ item, key }) => (
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
                          {this.state.status
                            ? this.state.volunteer_info.map((item) => {
                                return (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      marginTop: "3%",
                                      justifyContent: "space-between",
                                    }}
                                    key={item.volunteerID}
                                  >
                                    <View style={{ flexDirection: "row" }}>
                                      <Text
                                        style={{
                                          fontSize: 20,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Leader
                                      </Text>
                                      {item.leader ? (
                                        <Icon
                                          name="check-circle"
                                          type="font-awesome"
                                          color="green"
                                          size={30}
                                          margin="2%"
                                        ></Icon>
                                      ) : (
                                        <Icon
                                          name="times-circle"
                                          type="font-awesome"
                                          color="red"
                                          size={30}
                                          margin="2%"
                                        ></Icon>
                                      )}
                                    </View>
                                    <View style={{ flexDirection: "row" }}>
                                      <Text
                                        style={{
                                          fontSize: 20,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Status
                                      </Text>

                                      {item.status ? (
                                        <Icon
                                          name="check-circle"
                                          type="font-awesome"
                                          color="green"
                                          size={30}
                                          margin="2%"
                                        ></Icon>
                                      ) : (
                                        <Icon
                                          name="times-circle"
                                          type="font-awesome"
                                          color="red"
                                          size={30}
                                          margin="2%"
                                        ></Icon>
                                      )}
                                    </View>
                                    <View>
                                      <Text
                                        style={{
                                          fontSize: 20,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Zone -{" "}
                                        {item.zoneNumber != 0
                                          ? item.zoneNumber
                                          : "None"}
                                      </Text>
                                    </View>
                                  </View>
                                );
                              })
                            : null}

                          <View
                            style={{
                              justifyContent: "space-between",
                              marginTop: "5%",
                            }}
                          >
                            {this.state.arrivalStatus && this.state.status ? (
                              <View
                                style={{
                                  margin: "5%",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    marginLeft: "5%",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text style={styles.headerText}>
                                    Checked In
                                  </Text>
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
                                    style={styles.button}
                                    onPress={this.reportArrival}
                                  >
                                    <Text style={styles.headerText}>
                                      Check In
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item) => item.eventName}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    ListEmptyComponent={this.emptyComponent}
                  ></FlatList>
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
    borderRadius: 10,
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
