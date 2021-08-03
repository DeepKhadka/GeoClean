import React, { Component } from "react";
import { View, StyleSheet,SafeAreaView, TouchableOpacity,Text,Button } from "react-native";
import fire from "../database/firebase";

export default class EventStatus extends Component {
    
    handlesignout = ()=>{
        fire.auth().signOut();
            }
        
            render() {
                const { navigation } = this.props;
                return (
                    <SafeAreaView style={{ flex: 1 }}>
                        <View>
                        <TouchableOpacity style={styles.card}onPress={()=>{alert("Pressed");}} >
                            <Text style={styles.text}>Start/Pause</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{alert("Pressed");}} >
                            <Text style={styles.text}>Post Pone</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{alert("Pressed");}} >
                            <Text style={styles.text}>Cancel Event</Text>
                            
                        </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                )
        
            }
}
const styles = StyleSheet.create({

    
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