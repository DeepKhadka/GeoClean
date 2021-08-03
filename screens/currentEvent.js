import React, { Component } from "react";
import { View,StyleSheet, SafeAreaView, TouchableOpacity,Text,Button } from "react-native";
import fire from "../database/firebase";

export default class CurrentEvent extends Component {
    
    handlesignout = ()=>{
        fire.auth().signOut();
            }
        
            render() {
                const { navigation } = this.props;
                return (
                    <SafeAreaView style={{ flex: 1 }}>
                        <View>
                        <TouchableOpacity style={styles.card}onPress={()=>{navigation.navigate("ReportObject");}} >
                            <Text style={styles.text}>Report Object</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.card}onPress={()=>{navigation.navigate("ReportOther");}} >
                            <Text style={styles.text}>Report Other</Text>
                            
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