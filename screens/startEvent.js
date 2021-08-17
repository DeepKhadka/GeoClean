import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  Alert,
  ImageBackground,
  TextInput,
} from "react-native";
import fire from "../database/firebase";
import { Icon } from "react-native-elements";
import FloatingTextBox from "./FloatingScan";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Directions } from "react-native-gesture-handler";
import { alignContent, marginLeft } from "styled-system";

function formatDate(date) {
  var MM = date.getMonth() + 1;
  var DD = date.getDate();
  var YYYY = date.getFullYear();
  return MM + "-" + DD + "-" + YYYY;
}
function formateTime(date) {
  var HH = date.getHours();
  var MM = date.getMinutes();
  if (HH > 12) {
    if (MM < 10) {
      HH = HH - 12;
      return HH + ":" + "0" + MM + " PM";
    } else {
      HH = HH - 12;
      return HH + ":" + MM + " PM";
    }
  } else if (HH <= 12) {
    if (MM < 10) {
      return HH + ":" + "0" + MM + " AM";
    } else {
      return HH + ":" + MM + " AM";
    }
  }
}

export default class StartEvent extends Component {
  _isMounted = false;

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  state = {
    eventName: "",
    eventDate: "",
    eventAddress: "",
    volunteers: "",
    eventTime: "",
    eventDescription: "",
    visibility: false,
  };
  showDatePicker = () => {
    this._isMounted && this.setState({ visibility: true });
  };

  hideDatePicker = () => {
    this._isMounted && this.setState({ visibility: false });
  };

  handleConfirm = (datetime) => {
    this._isMounted && this.setState({ eventDate: formatDate(datetime) });
    this._isMounted && this.setState({ eventTime: formateTime(datetime) });
    this._isMounted && this.hideDatePicker();
    console.log(this.state.eventDate);
    console.log(this.state.eventTime);
  };

  startevent = () => {
    console.log("Got here!");

    fire
      .firestore()
      .collection("ADMIN")
      .doc(fire.auth().currentUser.uid.toString())
      .collection("EVENT MANAGEMENT")
      .doc()
      .set({
        eventName: this.state.eventName,
        address: this.state.eventAddress,
        noOfVolunteers: Number(this.state.volunteers),
        eventStatus: "current",
        eventDate: this.state.eventDate,
        eventTime: this.state.eventTime,
        eventDescription: this.state.eventDescription,
      })
      .then(() => {
        Alert.alert("Event Created!");
        this.props.navigation.goBack();
      });
  };

  checkCurrentEvent = () => {
    if (
      this.state.eventName == "" ||
      this.state.eventDate == "" ||
      this.state.eventAddress == "" ||
      this.state.volunteers == "" ||
      this.state.eventTime == "" ||
      this.state.eventDate == "" ||
      this.state.eventDescription == "" ||
      this.state.volunteers == "0"
    ) {
      Alert.alert("Please fill all the fields!");
    } else {
      fire
        .firestore()
        .collection("ADMIN")
        .doc(fire.auth().currentUser.uid.toString())
        .collection("EVENT MANAGEMENT")
        .where("eventStatus", "==", "current")
        .get()
        .then((snapshot) => {
          if (snapshot.empty && this._isMounted) {
            fire
              .firestore()
              .collection("ADMIN")
              .doc(fire.auth().currentUser.uid.toString())
              .collection("EVENT MANAGEMENT")
              .where("eventStatus", "==", "paused")
              .get()
              .then((snap) => {
                if (snap.empty && this._isMounted) {
                  return this.startevent();
                } else {
                  Alert.alert("Ongoing Event!");
                }
              });
          } else {
            Alert.alert("Ongoing Event!");
          }
        })
        .catch((err) => {
          console.log(err.toString());
        });
    }
  };

  render() {
    const { navigation } = this.props;
    return (
      <ImageBackground
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/geoclean-d8fa8.appspot.com/o/loginBackground.png?alt=media&token=42816f1f-8ecb-4ae5-9dd4-3d9c7f4ce377",
        }}
        style={styles.backgroundStyle}
      >
        <SafeAreaView style={styles.safeview}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "2%",
              marginLeft: "2%",
            }}
          >
            <Text
              style={{ fontSize: 25, fontWeight: "bold", alignSelf: "center" }}
            >
              Event Information{" "}
            </Text>
            <TouchableOpacity
              style={{
                margin: "5%",
                padding: "2%",
                borderRadius: 10,
                justifyContent: "center",

                backgroundColor: " rgba(0, 115, 189, 0.3)",
                borderBottom: 2,
              }}
              onPress={this.checkCurrentEvent}
            >
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>Finish</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center", flex: 9 }}>
            <View style={styles.defaultPlace}>
              <Icon name="id-card" type="font-awesome" size={30}></Icon>
              <TextInput
                placeholder="Event Name"
                style={styles.textInput}
                placeholderTextColor="black"
                onChangeText={(val) => {
                  this.setState({ eventName: val });
                }}
                value={this.state.eventName}
              />
            </View>
            <DateTimePickerModal
              isVisible={this.state.visibility}
              mode="datetime"
              backgroundColor=" rgba(0, 115, 189, 0.3)"
              onConfirm={this.handleConfirm}
              onCancel={this.hideDatePicker}
              minimumDate={new Date()}
            />
            <View style={styles.defaultPlace}>
              <Icon name="map-marker" type="font-awesome" size={30}></Icon>
              <TextInput
                placeholder="Event Address"
                style={styles.textInput}
                placeholderTextColor="black"
                onChangeText={(val) => {
                  this.setState({ eventAddress: val });
                }}
                value={this.state.eventAddress}
              />
            </View>
            <View style={styles.defaultPlace}>
              <Icon name="users" type="font-awesome" size={30}></Icon>
              <TextInput
                placeholder="No of Volunteers"
                keyboardType="number-pad"
                style={styles.textInput}
                placeholderTextColor="black"
                onChangeText={(val) => {
                  this.setState({ volunteers: val });
                }}
                value={this.state.volunteers}
              />
            </View>
            <View style={styles.desInput}>
              <Icon name="sticky-note" type="font-awesome" size={30}></Icon>
              <TextInput
                placeholder="Event Description"
                style={styles.textInput}
                placeholderTextColor="black"
                onChangeText={(val) => {
                  this.setState({ eventDescription: val });
                }}
                value={this.state.eventDescription}
              />
            </View>
            <TouchableOpacity
              style={styles.defaultPlace}
              onPress={this.showDatePicker}
            >
              <Icon name="calendar" type="font-awesome" size={30}></Icon>
              <Text style={{ marginLeft: "5%" }}>Date and Time</Text>
            </TouchableOpacity>

            {this.state.eventDate != "" ? (
              <Text style={{ marginTop: "10%", fontWeight: "bold" }}>
                {this.state.eventDate.toString()} {" " + this.state.eventTime}
              </Text>
            ) : null}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  safeview: {
    height: "100%",
    width: "100%",
    flex: 1,
  },
  button: {
    backgroundColor: "lightyellow",
    marginTop: "20%",
    height: "10%",
    width: "40%",
    alignItems: "center",
    borderRadius: 10,
  },
  backgroundStyle: {
    height: "100%",
    width: "100%",
  },
  textInput: {
    height: "100%",
    width: "80%",

    justifyContent: "center",
    borderRadius: 20,
    alignContent: "center",
    marginLeft: "5%",
    fontWeight: "bold",
    fontSize: 15,
  },
  desInput: {
    flexDirection: "row",

    backgroundColor: " rgba(0, 115, 189, 0.3);",
    height: "15%",
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
    padding: "2%",
    borderRadius: 10,
  },
  defaultPlace: {
    flexDirection: "row",
    backgroundColor: " rgba(0, 115, 189, 0.3);",
    height: "10%",
    marginTop: "5%",
    justifyContent: "center",
    alignItems: "center",
    padding: "2%",
    borderRadius: 10,
  },
  headerView: {
    flexDirection: "row",
    backgroundColor: " rgba(0, 115, 189, 0.3);",
    height: "10%",
    marginTop: "5%",
    justifyContent: "space-between",
  },
});
