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
                        <TouchableOpacity style={styles.card}onPress={()=>{navigation.navigate("EventManagement");}} >
                            <Text style={styles.text}>Event Management</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{navigation.navigate("VolunteerManagement");}} >
                            <Text style={styles.text}>Volunteer Management</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{navigation.navigate("ZoneManagement");}} >
                            <Text style={styles.text}>Zone Management</Text>
                            
                        </TouchableOpacity>
                          <Button title="signout" onPress={this.handlesignout}></Button>
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