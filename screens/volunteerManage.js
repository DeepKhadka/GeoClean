import React, { Component } from "react";
import { View,StyleSheet, SafeAreaView, TouchableOpacity,Text,Button } from "react-native";
import fire from "../database/firebase";

export default class VolunteerManagement extends Component {
    
    handlesignout = ()=>{
        fire.auth().signOut();
            }
        
            render() {
                const { navigation } = this.props;
                return (
                    <SafeAreaView style={{ flex: 1 }}>
                       <TouchableOpacity style={styles.card}onPress={()=>{navigation.navigate("AssignVolunteer");}} >
                            <Text style={styles.text}>Assign Volunteers</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{navigation.navigate("ReassignVolunteers");}} >
                            <Text style={styles.text}>Re-assign Volunteers</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{navigation.navigate("RemoveVolunteer");}} >
                         
                        <Text style={styles.text}>Remove Volunteer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{alert('All Volunteers Released');}} >
                         
                        <Text style={styles.text}>Release All </Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                )
        
            }
}

const styles = StyleSheet.create({

    safeview: {
      backgroundColor:"#a09fdf",
      height:"100%",
      width:"100%"
  
    },
    mainView:{
  
      height:"100%",
      width:"100%",
  
      flex:1
    
    },
    card:{
        margin:"5%",
        backgroundColor:"#D9ACEA" , 
         justifyContent:"center",
        alignItems:"center",
        borderRadius:20,
       
    },
    text:{
        padding:"10%",
        fontSize:20,
       fontWeight:'bold'
      

    },
    
  
   
  
    
  });