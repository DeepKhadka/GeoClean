import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Switch,
  TextInput,
} from "react-native";
import fire from "../database/firebase";
import {
  Spinner,
  HStack,
  useColorModeValue,
  Center,
  NativeBaseProvider,
  Select,
} from "native-base";
import { backgroundColor } from "styled-system";

export default class AssignVolunteer extends Component {
  _isMounted = false;

  state = {
    data: null,
    eventID: "",
    volunteers: null,
    refreshing: false,
    selected: {},
    pickerText: {},
    status: true,
    tempStatus: false,
  };
  toggleSwitch() {
    this.setState({
      status: !this.state.status,
    });
  }
  onPickerSelect(index, idN) {
    /*s
        
        index has the selected item from the list*/
    // console.log(index);
    this.setState({
      selected: { ...this.state.selected, [id]: { zoneNumber: index, id: iN } },
    });

    console.log(this.state.selected.idN.id.toString());
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

  handleChange = (index) => {
    this.setState({
      selected: index,
    });
  };

  getCurrentEvent = () => {
    var eventID;

    fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .where("eventStatus", "==", "current")
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          const data = [];
          sub.forEach((doc) => {
            eventID = doc.id.toString();
          });
          this.setState({
            eventID: eventID,
          });
        }
      })
      .then(() => {
        this.getVolunteersInfo();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

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
          refreshing: false,
        });
      })
      .then(() => {
        console.log(this.state.data);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
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
        {this.state.data ? (
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ReassignVolunteers",{itemId: item.id, fname:item.fName, lname:item.lName, email:item.email,currentEventID:this.state.eventID});
                }}
                style={{
                  margin: "4%",
                  backgroundColor: "lightblue",
                  justifyContent: "space-between",
                  borderRadius: 10,
                }}
              >
                <View>
                  <Text>{item.fName}</Text>
                </View>
                <View>
                  <Text>{item.email}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <NativeBaseProvider>
                      <Select
                        placeholder="Zone"
                        placeholderTextColor="black"
                        width={150}
                        onValueChange={(itemValue) =>
                          this.onPickerSelect(itemValue, item.id)
                        }
                      >
                        <Select.Item label="Zone 1" value={1} />
                        <Select.Item label="Zone 2" value={2} />
                        <Select.Item label="Zone 3" value={3} />
                        <Select.Item label="Zone 4" value={4} />
                        <Select.Item label="Zone 5" value={5} />
                        <Select.Item label="Zone 6" value={6} />
                      </Select>
                    </NativeBaseProvider>
                  </View>

                  <View>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={this.state.status ? "#f5dd4b" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={this.toggleSwitch.bind(this)}
                      value={this.state.status}
                    />
                  </View>
                </View>
              </TouchableOpacity>
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

const styles = StyleSheet.create({});
