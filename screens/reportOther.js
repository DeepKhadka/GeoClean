import React, { Component } from "react";
import { View,StyleSheet,TextInput, SafeAreaView, TouchableOpacity,Text,Button } from "react-native";
import fire from "../database/firebase";

export default class ReportOther extends Component {
    
    handlesignout = ()=>{
        fire.auth().signOut();
            }
        
            render() {
                const { navigation } = this.props;
                return (
                    <SafeAreaView >
                        <View>
                          <TouchableOpacity style={styles.card} onPress={()=>{alert("Choose a Zone");}}>
                              <Text style={styles.text}> Zone</Text>
                          </TouchableOpacity>
                         
                          <TextInput
        style={styles.input}
       
        placeholder="Describe the Object"
     
      />
      <TouchableOpacity style={styles.card} onPress={()=>{alert('Your location was saved')}}><Text style={styles.text}>Geo Tag</Text></TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={()=>{alert('Report Sent');
    navigation.navigate("CurrentEvent");}}><Text style={styles.text}>Report </Text></TouchableOpacity>
                                   
                        </View>

                    </SafeAreaView>
                )
        
            }
}
const styles = StyleSheet.create({

    
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
        width:"50%",
        height:'20%'
       
    },
    text:{
        padding:"10%",
        fontSize:20,
       fontWeight:'bold'
      

    },
    input:{
        height:"15%",
        width:"100%",
        margin:"5%",
        backgroundColor:"#D9ACEA",
        alignItems:"flex-start"
    }
    
  
   
  
    
  });