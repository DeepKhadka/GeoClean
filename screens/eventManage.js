import React, { Component } from "react";
import { View, StyleSheet,SafeAreaView, TouchableOpacity,Text,Button } from "react-native";
import fire from "../database/firebase";
import DefaultCard from '../assets/Defaultcardview';

export default class AssignVolunteer extends Component {
    
    handlesignout = ()=>{
        fire.auth().signOut();
            }

          

        x
            render() {
                const { navigation } = this.props;
                return (
                    <SafeAreaView style={{flex:1} }>
                        <View style={styles.mainView} >
                        <TouchableOpacity style={styles.card}onPress={()=>{navigation.navigate("StartEvent");}} >
                            <Text style={styles.text}>Start Event</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{navigation.navigate("CurrentEventAdmin");}} >
                            <Text style={styles.text}>Current Event</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{navigation.navigate("EventStatus");}} >
                            <Text style={styles.text}>Event Status</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{navigation.navigate("EventReport");}} >
                            <Text style={styles.text}> Event Reports</Text>
                            
                        </TouchableOpacity>
                         
                        </View>
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