import React, { Component } from "react";
import { View, SafeAreaView, TouchableOpacity, Text, Button, Alert } from "react-native";
import fire from "../database/firebase";
import FloatingTextBox from "../assets/textEntry";
import DateTimePickerModal from "react-native-modal-datetime-picker";




function formatDate(date) {

    var MM = date.getMonth() + 1;
    var DD = date.getDate();
    var YYYY = date.getFullYear();


    return (MM + "-" + DD + "-" + YYYY)
}
function formateTime(date){
    var HH= date.getHours();
    var MM= date.getMinutes();
    return(HH+":"+MM)
}


export default class StartEvent extends Component {

    state = {

        eventName: "",
        eventDate: "",
        eventAddress: "",
        volunteers: "",
        eventTime: "",
        eventDescription: "",
        visibility:false,



    }
  showDatePicker = () => {
        this.setState({visibility: true})
      }
    
     hideDatePicker = () => {
       this.setState({visibility:false})
      }
    
     handleConfirm = (datetime) => {
        this.setState({eventDate:datetime.toString()})
        this.setState({eventTime:formateTime(datetime)})
       this. hideDatePicker();
       console.log(this.state.eventDate)
       console.log(this.state.eventTime)
      }



    startevent = () => {

        console.log("Got here!")

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
                eventDate: "09-01-2021",
                eventTime: Number("10"),
                eventDescription: this.state.eventDescription


            })
            .then(() => {
                Alert.alert("Event Created!");
                this.props.navigation.goBack();


            })

    }

    checkCurrentEvent = () => {

        if (this.state.eventName == "" || this.state.eventDate == "" || this.state.eventAddress == "" || this.state.volunteers == "" || this.state.eventTime== "" || this.state.eventDate=="" || this.state.eventDescription==""|| this.state.volunteers==0) {
            Alert.alert("Please fill all the fields!")
        } else {

            fire.firestore().collection("ADMIN").doc(fire.auth().currentUser.uid.toString()).collection("EVENT MANAGEMENT").where("eventStatus", "==", "current")
                .get()
                .then((snapshot) => {
                    if (snapshot.empty) {
                        return this.startevent();

                    }
                    else {
                        Alert.alert("Ongoing Event!")
                    }
                })
                .catch((err) => {
                    console.log(err.toString())
                    //Alert.alert(err.toString())

                })


        }

    }



    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ alignItems: "center", justifyContent:"space-between" }}>
                 
                    <FloatingTextBox
                        label="Event Name"
                        autoCapitalize="none"
                        placeholderTextColor="gray"

                        onChangeText={(val) => {
                            this.setState({ eventName: val });
                        }}
                        test={this.state.eventName}
                    ></FloatingTextBox>
            
      <DateTimePickerModal
        isVisible={this.state.visibility}
        mode="datetime"
        onConfirm={this.handleConfirm}
        onCancel={this.hideDatePicker}
        minimumDate={new Date()}
        
      />

                    
                    <FloatingTextBox
                        label="Event Address"
                        autoCapitalize="none"
                        placeholderTextColor="gray"

                        onChangeText={(val) => {
                            this.setState({ eventAddress: val });
                        }}
                        test={this.state.eventAddress}
                    ></FloatingTextBox>
                    <FloatingTextBox
                        label="No.of Volunteers"
                        autoCapitalize="none"
                        placeholderTextColor="gray"
                        keyboardType="number-pad"
                        onChangeText={(val) => {
                            this.setState({ volunteers: val });
                        }}
                        test={this.state.volunteers}
                    ></FloatingTextBox>
                    <FloatingTextBox
                        label="Description"
                        autoCapitalize="none"
                        placeholderTextColor="gray"
                      
                        onChangeText={(val) => {
                            this.setState({ eventDescription: val });
                        }}
                        test={this.state.eventDescription}
                    ></FloatingTextBox>
                   
                      <TouchableOpacity onPress={this.showDatePicker} style={{width:"30%",marginTop:"10%",backgroundColor:"lightblue",borderRadius:10,padding:"2%"}}><Text>Date and Time</Text></TouchableOpacity>
                       {this.state.eventDate != "" ? <Text style={{marginTop:"10%", fontWeight:"bold"}}>{this.state.eventDate}</Text> : null}             
                    <TouchableOpacity style={{ backgroundColor: "red", marginTop: "20%", height: "10%", width: "80%", alignItems: "center" }}
                        onPress={this.checkCurrentEvent}
                    >
                        <Text style={{ padding: 10, fontSize: 20, fontWeight: "bold" }}>Finish</Text>
                    </TouchableOpacity>

                </View>





            </SafeAreaView>
        )

    }
}