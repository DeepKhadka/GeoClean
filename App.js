import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import AdminHome from "./screens/adminhome";
import VolunteerHome from "./screens/volunteerhome";
import ForgotPass from './screens/forgotpass';
import fire from "./database/firebase";
import { LogBox } from "react-native";
import _ from "lodash";


LogBox.ignoreLogs(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};


const Stack = createNativeStackNavigator();

function adminhome() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="AdminHome" component={AdminHome} />


      </Stack.Navigator>
    </NavigationContainer>
  )
}

function volunteerhome() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="VolunteerHome" component={VolunteerHome} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function authStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ForgotPassword" component={ForgotPass} />

      </Stack.Navigator>
    </NavigationContainer>
  )

}

export default class App extends Component {

  state = {
    user: {},
    userAdmin: null,

  }

  checkAdmin = (user) => {
    fire.firestore().collection("ADMIN").doc(fire.auth().currentUser.uid).get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          this.setState({ user:user,userAdmin: true })
          console.log("This is an Admin!")
        }
        else {
          this.setState({ user:user,userAdmin: false })
          console.log("This is not an Admin!")
        }
      }).catch((error) => {
        Alert.alert("Error getting document:", error)
      })

  }

  componentDidMount() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {

        this.checkAdmin(user);
        
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    if (this.state.user && this.state.userAdmin == false) {
      return volunteerhome();

    }
    else if (this.state.user && this.state.userAdmin == true) {
      return adminhome();
    }
    else {
      return authStack();
    }
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
