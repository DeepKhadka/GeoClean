import React, { Component } from "react";
import { View, SafeAreaView, TouchableOpacity,Text,Button } from "react-native";
import fire from "../database/firebase";

export default class VolunteerHome extends Component {


    handlesignout = ()=>{
fire.auth().signOut();
    }

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View>
                    <Text>Volunteer Home page</Text>
                    <Button
                    title="SIGNOUT"
                    onPress={this.handlesignout}
                    ></Button>
                </View>
            </SafeAreaView>
        )

    }
}