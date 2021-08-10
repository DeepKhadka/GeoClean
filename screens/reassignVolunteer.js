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



export default class ReassignVolunteers extends Component {
  state = {
    userId: "",
    Zone: "",
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
        this.navigation.goBack();
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






iconPress=()=>{

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
      zoneplaceHolder: value.toString(),
    });
  };

  render() {
    const { navigation } = this.props;
    const itemid = this.props.route.params.itemId;
    const fname = this.props.route.params.fname;
    const lname = this.props.route.params.lname;
    const email = this.props.route.params.email;


    return (
      <SafeAreaView style={styles.safeview}>
        <View style={styles.mainView}>
          <View style={styles.card}>
            <View style={{alignItems:'center'}}>
            <Text style={styles.headerText}>{fname}</Text>
            <Text style={styles.headerText}>{lname}</Text>
            <Text style={styles.text}>{email}</Text>
            </View>
            <View style={{ flexDirection: "row",justifyContent:'space-between', marginTop: "5%" ,marginLeft:"2%"}}>
              <Text style={styles.headerText}>Leader</Text>
              <Switch
                trackColor={{ false: "gray", true: "green" }}
                thumbColor={this.state.leader ? "white" : "white"}
                onValueChange={this.toggleSwitch.bind(this)}
                value={this.state.leader}
              />
            </View>
            <View style={styles.rowView}>
              <NativeBaseProvider>
                <Select
                  placeholder={this.state.zoneplaceHolder}
                  placeholderTextColor="black"
                  width={150}
                  
                  onValueChange={(itemValue) => this.onPickerSelect(itemValue)}
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
       
           <Icon name="delete" onPress={this.iconPress}size={50}></Icon>
       
              
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
    flex:1,
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
    alignContent:"center"
  },
  rowView:{
      flexDirection:"row",
      marginVertical:"5 %",
      justifyContent:'space-between',
      marginLeft:"2%"
  


  }
});
