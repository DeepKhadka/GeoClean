import React, { Component } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Button,
  ImageBackground,
  FlatList,
} from "react-native";

import { Icon } from "react-native-elements";

import ModalSelector from "react-native-modal-selector";

import fire from "../database/firebase";

export default class EventStatus extends Component {
  _isMounted = false;

  state = {
    data_arrived: [],
    data_unarrived: [],
    refreshing: false,
    status: "Arrived",
    loading: false,
  };

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
        this._isMounted &&
          this.setState({
            data_arrived: data,
            refreshing: false,
          });
      })
      .then(() => {
        console.log(this.state.data_arrived);
        this._isMounted && this.getUnarrived();
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  };

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
        this._isMounted &&
          this.setState({
            data_unarrived: data,
            refreshing: false,
            loading: false,
          });
      })
      .then(() => {
        console.log(this.state.data_unarrived);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  };

  onPickerSelect = (value, key) => {
    this._isMounted &&
      this.setState({
        status: value == 1 ? "Arrived" : "Not Arrived",
      });
  };

  componentDidMount() {
    console.log(this.props.route.params.eventID);
    this._isMounted = true;
    this.setState({
      loading: true,
    });
    this.getArrived();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginTop: "7%",
        }}
      >
        <Text style={{ fontSize: 20, fontStyle: "italic", fontWeight: "bold" }}>
          No one here...
        </Text>
      </View>
    );
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,

        data_unarrived: [],
        data_arrived: [],
      },
      () => {
        this.componentDidMount();
      }
    );
  };

  render() {
    const { navigation } = this.props;
    const data = [
      { key: 1, label: "Arrived" },
      { key: 2, label: "Not Arrived" },
    ];
    return (
      <ImageBackground
      source={require("../assets/background.png")}
        style={styles.backgroundStyle}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <ModalSelector
              data={data}
              initValue={this.state.status}
              style={{
                width: "50%",
                margin: "2%",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              }}
              initValueTextStyle={{
                fontWeight: "bold",
                color: "blue",
                padding: "2%",
              }}
              onChange={(option) => {
                this.onPickerSelect(option.key);
              }}
            />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 15, color: "gray" }}>
                Pull to refresh
              </Text>
            </View>
          </View>
          <View style={{ flex: 10 }}>
            <FlatList
              data={
                this.state.status == "Arrived"
                  ? this.state.data_arrived
                  : this.state.data_unarrived
              }
              renderItem={({ item, key }) => (
                <View
                  style={{
                    margin: "5%",
                    padding: "2%",
                    borderRadius: 10,

                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <View>
                    <Text style={styles.headerText}>
                      {item.fName} {item.lName}
                    </Text>
                    <View style={styles.rowView}>
                      <Text style={styles.text}>Status</Text>

                      {item.status == true ? (
                        <Icon
                          name="check-circle"
                          type="font-awesome"
                          color="green"
                          onPress={this.iconPress}
                          size={30}
                          margin="2%"
                        ></Icon>
                      ) : (
                        <Icon
                          name="times-circle"
                          type="font-awesome"
                          color="red"
                          onPress={this.iconPress}
                          size={30}
                          margin="2%"
                        ></Icon>
                      )}

                      <Text style={styles.text}>Leader</Text>
                      {item.leader == true ? (
                        <Icon
                          name="check-circle"
                          type="font-awesome"
                          color="green"
                          onPress={this.iconPress}
                          size={30}
                          margin="2%"
                        ></Icon>
                      ) : (
                        <Icon
                          name="times-circle"
                          type="font-awesome"
                          color="red"
                          onPress={this.iconPress}
                          size={30}
                          margin="2%"
                        ></Icon>
                      )}

                      <Text style={styles.text}>Zone {item.zoneNumber}</Text>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              ListEmptyComponent={this.emptyComponent}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
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
    flexDirection: "row",
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
  text: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: "2%",
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
    justifyContent: "space-between",

    margin: "5%",
  },
  flatView: {
    margin: "5%",
    padding: "2%",
    borderRadius: 10,

    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  backgroundStyle: {
    height: "100%",
    width: "100%",
  },
});
