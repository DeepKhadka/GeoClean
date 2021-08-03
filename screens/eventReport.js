import React, { Component } from "react";
import { View,StyleSheet, SafeAreaView, TouchableOpacity,Text,Button } from "react-native";
import fire from "../database/firebase";

export default class EventReport extends Component {
    
    handlesignout = ()=>{
        fire.auth().signOut();
            }
        
            render() {
                const { navigation } = this.props;
                return (
                    <SafeAreaView style={{ flex: 1 }}>
                        <View>
                            <Text>Objects</Text>
                        <TouchableOpacity style={styles.card}onPress={()=>{alert("Pressed");}} >
                            <Text style={styles.text}>Object 1</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{alert("Pressed");}} >
                            <Text style={styles.text}>Object 2</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{alert("Pressed");}} >
                            <Text style={styles.text}>Other Report</Text>
                            
                        </TouchableOpacity>
                        <View>
                            <Text>Completion</Text>
                            <Text> Zone Name Progress Bar</Text>

                        </View>
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