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
import VolunteerManagement from './screens/volunteerManage';
import CurrentEvent from './screens/currentEvent';
import CurrentEventAdmin from './screens/currentEventAdmin';
import EventManagement from './screens/eventManage';
import EventReport from './screens/eventReport';
import EventStatus from './screens/eventStatus';
import AsssignVolunteer from './screens/assignVolunteer';
import RemoveVolunteer from './screens/removeVolunteer';
import ReportObject from './screens/reportObject';
import ReportOther from './screens/reportOther';
import StartEvent from './screens/startEvent';
import ZoneDetail from './screens/zoneDetail';
import ZoneManagement from './screens/zoneManage';
import LastEvent from './screens/lastEvent';
import JoinEvent from './screens/joinEvent';
import ReassignVolunteers from './screens/reassignVolunteer';


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
        <Stack.Screen name="VolunteerManagement" component={VolunteerManagement} />
        <Stack.Screen name="ZoneManagement" component={ZoneManagement} />
        <Stack.Screen name="EventManagement" component={EventManagement} />
        <Stack.Screen name="StartEvent" component={StartEvent} />
        <Stack.Screen name="EventReport" component={EventReport} />
        <Stack.Screen name="EventStatus" component={EventStatus} />
        <Stack.Screen name="LastEvent" component={LastEvent} />
        <Stack.Screen name="AssignVolunteer" component={AsssignVolunteer} />
        <Stack.Screen name="RemoveVolunteer" component={RemoveVolunteer} />
        <Stack.Screen name="ZoneDetail" component={ZoneDetail} />
        <Stack.Screen name="CurrentEventAdmin" component={CurrentEventAdmin}/>
        <Stack.Screen name="ReassignVolunteers" component={ReassignVolunteers}/>


     

      </Stack.Navigator>
    </NavigationContainer>
  )
}

function volunteerhome() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="VolunteerHome" component={VolunteerHome} />
        <Stack.Screen name="JoinEvent" component={JoinEvent}/>
        <Stack.Screen name="CurrentEvent" component={CurrentEvent}/>
        <Stack.Screen name="ReportOther" component={ReportOther}/>
        <Stack.Screen name="ReportObject" component={ReportObject}/>

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
