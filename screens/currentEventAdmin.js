import React, { Component } from "react";
import { View, SafeAreaView, TouchableOpacity,Text,Button } from "react-native";
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
                            <Text>Current Event</Text>
                            
                        </View>
                    </SafeAreaView>
                )
        
            }
}