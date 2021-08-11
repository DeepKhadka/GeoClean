import React, { Component } from "react";
import {
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Button,
  StyleSheet,
  TextInputComponent,
} from "react-native";
import fire from "../database/firebase";
import { NativeBaseProvider, Select } from "native-base";
import { Icon } from "react-native-elements";
import * as Location from 'expo-location';
import FloatingTextBox from "../assets/textEntry";

export default class ReportObject extends Component {
  state = {
    userId: "",
    Zone: "",
    zoneplaceHolder: "Select Zone",
   description:"",
    location:"",
  };
  handlesignout = () => {
    fire.auth().signOut();
  };
  setLocation=(value)=>{
      this.setState({
            location: value
            
      });
  }

  onPickerSelect = (value) => {
    this.setState({
      Zone: value,
      zoneplaceHolder: value.toString(),
    });
  };
handleGeoTag =()=>{
    //handle geo tagging here
}

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView>
        <View>
          <View style={styles.rowView}>
            <NativeBaseProvider>
              <Select
                placeholder={this.state.zoneplaceHolder}
                backgroundColor="lightblue"
                placeholderTextColor="black"
                width={"50%"}
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
         

          <TextInput
        style={styles.input}
        onChangeText={(val)=>{
            this.setState({description:val});
        }}
        value={this.state.description}
        placeholder="Description"
        placeholderTextColor="purple"
       
      />
                   
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              alert("Your location was saved");
            }}
          >
            <Text style={styles.text}>Geo Tag</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              alert("Report Sent");
              navigation.navigate("CurrentEvent");
            }}
          >
            <Text style={styles.text}>Report </Text>
          </TouchableOpacity>
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
    alignContent: "center",
  },
  rowView: {
    flexDirection: "row",
    marginVertical: "5 %",
    justifyContent: "space-between",
    marginLeft: "2%",
  },
  input:{
  height: "20%",
  margin: "2%",
  borderWidth: 1,
  borderRadius:12,
  borderColor:"blue",
  padding: "5%"
  }
});
