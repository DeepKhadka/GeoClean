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

export default class ReassignVolunteers extends Component {
  state = {
    userId: "",
    Zone: "",
    zoneplaceHolder: "Select Zone",
    leader: false,
    status: true,
    statusLabel:"Active"
  };

  onPressUpdate = (val) => {
    //handle updating data base shit

    console.log(val);
  };

  handlesignout = () => {
    fire.auth().signOut();
  };

  toggleSwitch() {
    this.setState({
      leader: !this.state.leader,
     
    });
  }

  statusSwitch=()=>{
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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainView}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.headerText}>{fname}</Text>
            <Text style={styles.headerText}>{lname}</Text>
            <Text style={styles.text}>{email}</Text>
            <View style={{ flexDirection: "row", marginTop: "10%" }}>
              <Text style={styles.headerText}>Leader</Text>
              <Switch
                trackColor={{ false: "yellow", true: "green" }}
                thumbColor={this.state.leader ? "white" : "red"}
                onValueChange={this.toggleSwitch.bind(this)}
                value={this.state.leader}
              />
            </View>
            <View style={{ flexDirection: "row", marginTop: "5%" }}>
              <NativeBaseProvider>
                <Select
                  placeholder={this.state.zoneplaceHolder}
                  placeholderTextColor="black"
                  width={150}
                  margin="5%"
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
            <View>
                <Text style={styles.headerText}>Status</Text>
            <Switch
                placeholder="Status"
                trackColor={{ false: "red", true: "green" }}
                thumbColor={this.state.status ? "white" : "black"}
                onValueChange={this.statusSwitch.bind(this)}
                value={this.state.status}
              />
            </View>
           
          </TouchableOpacity>
          <Button title="Update" onPress={this.onPressUpdate}></Button>
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
    fontSize: 15,
    fontWeight: "bold",
    marginTop: "2%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
