import React, { Component } from "react";
import { View, SafeAreaView, TouchableOpacity,Text,Button } from "react-native";
import fire from "../database/firebase";
import FloatingTextBox from "../assets/textEntry";
export default class StartEvent extends Component {

    state={
        eventName:"",
        eventDate:"",
        eventAddress:"",
        volunteers:"",

    }
    
   
        
            render() {
                const { navigation } = this.props;
                return (
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={{alignItems:"center"}}>
                        <FloatingTextBox
                            label="Event Name"
                            autoCapitalize="none"
                            placeholderTextColor="gray"
                         
                            onChangeText={(val) => {
                              this.setState({ eventName: val });
                             }}
                            test={this.state.eventName}
                        ></FloatingTextBox>
                         <FloatingTextBox
                            label="Event Date"
                            autoCapitalize="none"
                            placeholderTextColor="gray"
                         
                            onChangeText={(val) => {
                              this.setState({ eventDate: val });
                             }}
                            test={this.state.eventDate}
                        ></FloatingTextBox>
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
                         
                            onChangeText={(val) => {
                              this.setState({ volunteers: val });
                             }}
                            test={this.state.volunteers}
                        ></FloatingTextBox>
                        
                        <TouchableOpacity style={{backgroundColor:"red",marginTop:"20%",height:"10%",width:"80%",alignItems:"center"}}>
                            <Text style={{padding:10,fontSize:20,fontWeight:"bold"}}>Finish</Text>
                        </TouchableOpacity>
                       
                        </View>
    
                        
                            
                    
                        
                    </SafeAreaView>
                )
        
            }
}