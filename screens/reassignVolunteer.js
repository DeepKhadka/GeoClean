import { VStack } from "native-base";
import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  Switch,
  Alert,
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
import { Icon } from 'react-native-elements';

import ModalSelector from 'react-native-modal-selector'

export default class ReassignVolunteers extends Component {
  state = {
    userId: "",
    Zone: 0,
    zoneplaceHolder: "Select Zone",
    leader: false,
    status: true,
    statusLabel: "Active",

  };


  removeVolunteer = () => {

    fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(this.props.route.params.currentEventID.toString())
      .collection("VOLUNTEERS")
      .doc(this.props.route.params.itemId.toString())
      .delete()
      .then(() => {
        Alert.alert("Volunteer removed!");
        this.props.navigation.goBack();
      })
      .catch((err) => {
        console.log(err.toString())
      })

  }

  checkLeaderStatus = () => {

    if (this.state.Zone == "") {
      Alert.alert("Please asign a Zone to the Volunteer!");

    } else if (this.state.status == false && this.state.leader == true) {

      Alert.alert("A leader cannot be inactive!")

    }
    else if (this.state.leader == true) {


      fire
        .firestore()
        .collection("ADMIN")
        .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
        .collection("EVENT MANAGEMENT")
        .doc(this.props.route.params.currentEventID.toString())
        .collection("VOLUNTEERS")
        .where("leader", "==", true)
        .where("zoneNumber", "==", this.state.Zone)
        .get()
        .then((sub) => {
          if (sub.docs.length > 0) {
            Alert.alert("Leader already assigned!");
          } else {
            this.onPressUpdate()
          }
        })
        .catch((err) => {
          console.log(err.toString())
        })


    } else {
      this.onPressUpdate()
    }
  }

  onPressUpdate = () => {
    fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(this.props.route.params.currentEventID.toString())
      .collection("VOLUNTEERS")
      .doc(this.props.route.params.itemId.toString())
      .update({
        leader: this.state.leader,
        status: this.state.status,
        zoneNumber: this.state.Zone
      })
      .then(() => {
        Alert.alert("Assignment completed!")
      })
      .catch((err) => {
        console.log(err.toString())
      })

  }






  iconPress = () => {

    Alert.alert(
      "Are you sure?",
      "Are you sure you want do delete ?",
      [
        {
          text: "Yes",
          onPress: () => {
            // console.log("Ask me later pressed")

            this.removeVolunteer();
          }
        },
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }

      ]
    );
  }

  handlesignout = () => {
    fire.auth().signOut();
  };

  toggleSwitch() {
    this.setState({
      leader: !this.state.leader,

    });
  }

  statusSwitch = () => {
    this.setState({
      status: !this.state.status,
    })

  }


  onPickerSelect = (value) => {
    this.setState({
      Zone: value,
      zoneplaceHolder: 'Zone '+value,
    });
  };
  componentDidMount() {
    this.setState({
      leader: this.props.route.params.leader,
      status: this.props.route.params.status,
      Zone: this.props.route.params.zone,


    },
      () => {
        this.setState({
          zoneplaceHolder: "Zone " + this.state.Zone
        })
      }
    )

  }

  render() {
    const { navigation } = this.props;
    const itemid = this.props.route.params.itemId;
    const fname = this.props.route.params.fname;
    const lname = this.props.route.params.lname;
    const email = this.props.route.params.email;
    const data = [
      { key: 1, section: true, label: 'Zone 1' },
      { key: 2, label: 'Zone 2' },
      { key: 3, label: 'Zone 3' },
      { key: 4, label: 'Zone 4'},
      { key: 5, label: 'Zone 5'},
      { key: 6, label: 'Zone 6'},
    ]



    return (
      <SafeAreaView style={styles.safeview}>
        <View style={styles.mainView}>
          <View style={styles.card}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.headerText}>{fname}</Text>
              <Text style={styles.headerText}>{lname}</Text>
              <Text style={styles.text}>{email}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: "5%", marginLeft: "2%" }}>
              <Text style={styles.headerText}>Leader</Text>
              <Switch
                trackColor={{ false: "gray", true: "green" }}
                thumbColor={this.state.leader ? "white" : "white"}
                onValueChange={this.toggleSwitch.bind(this)}
                value={this.state.leader}
              />
            </View>
            <View style={styles.rowView}>
            <ModalSelector
                    data={data}
                    initValue={this.state.zoneplaceHolder}
                    style={{width:"50%"}}
                    initValueTextStyle={{color:"black"}}
                    onChange={(option)=>{ this.onPickerSelect(option.key) }} />

            </View>
            <View style={styles.rowView}>
              <View style={styles.rowView}>
                <Text style={styles.headerText}>Status</Text>
                <Switch
                  placeholder="Status"
                  marginLeft="5%"
                  trackColor={{ false: "gray", true: "green" }}
                  thumbColor={this.state.status ? "white" : "white"}
                  onValueChange={this.statusSwitch.bind(this)}
                  value={this.state.status}
                />
              </View>

              <Icon name="delete" onPress={this.iconPress} size={50}></Icon>


            </View>

          </View>
          <Button title="Update" onPress={this.checkLeaderStatus}></Button>
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
    flex: 1,
  },
  mainView: {
    height: "100%",
    width: "100%",

    flex: 1,
  },
  card: {
    margin: "5%",
    backgroundColor: "lightblue",
    justifyContent: "center",

    borderRadius: 20,
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: "2%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    alignContent: "center"
  },
  rowView: {
    flexDirection: "row",
    marginVertical: "5 %",
    justifyContent: 'space-between',
    marginLeft: "2%"



  }
});
