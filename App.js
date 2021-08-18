import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContent } from "./screens/DrawerContent";
import { DrawerContentV } from "./screens/DrawerContentV";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import AdminHome from "./screens/adminhome";
import VolunteerHome from "./screens/volunteerhome";
import ForgotPass from "./screens/forgotpass";
import fire from "./database/firebase";
import { LogBox } from "react-native";
import _ from "lodash";
import VolunteerManagement from "./screens/volunteerManage";
import CurrentEvent from "./screens/currentEvent";
import CurrentEventAdmin from "./screens/currentEventAdmin";
import EventManagement from "./screens/eventManage";
import EventReport from "./screens/eventReport";
import EventStatus from "./screens/eventStatus";
import AsssignVolunteer from "./screens/assignVolunteer";
import RemoveVolunteer from "./screens/removeVolunteer";
import ReportObject from "./screens/reportObject";
import ReportOther from "./screens/reportOther";
import StartEvent from "./screens/startEvent";
import ZoneDetail from "./screens/zoneDetail";
import ZoneManagement from "./screens/zoneManage";
import LastEvent from "./screens/lastEvent";
import JoinEvent from "./screens/joinEvent";
import ReassignVolunteers from "./screens/reassignVolunteer";
import Map from "./screens/map";

LogBox.ignoreLogs(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

handleSignout = () => {
  fire.auth().signOut();
};

const Stack = createNativeStackNavigator();
const DrawerAdmin = createDrawerNavigator();
const DrawerVolunteer = createDrawerNavigator();
function drawerAdmin() {
  return (
    <DrawerAdmin.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <DrawerAdmin.Screen
        name="AdminHome"
        component={AdminHome}
        options={{
          title: "Dashboard",
          headerStyle: {
            backgroundColor: "rgba(36,160,237,0.6)",
          },
        }}
      ></DrawerAdmin.Screen>
    </DrawerAdmin.Navigator>
  );
}

function drawerVolunteer() {
  return (
    <DrawerVolunteer.Navigator
      drawerContent={(props) => <DrawerContentV {...props} />}
    >
      <DrawerVolunteer.Screen
        name="VolunteerHome"
        component={VolunteerHome}
        options={{
          title: "Dashboard",
          headerStyle: {
            backgroundColor: "rgba(36,160,237,0.6)",
          },
        }}
      ></DrawerVolunteer.Screen>
    </DrawerVolunteer.Navigator>
  );
}

function adminhome() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Drawer"
          children={drawerAdmin}
          options={{
            headerShown: false,
            headerStyle: { backgroundColor: "red" },
          }}
        />
        <Stack.Screen
          name="AdminHome"
          component={AdminHome}
          options={{ title: "DashBoard" }}
        />
        <Stack.Screen
          name="VolunteerManagement"
          component={VolunteerManagement}
        />
        <Stack.Screen
          name="ZoneManagement"
          component={Map}
          options={{
            title: "Zones",
            headerStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
        <Stack.Screen name="EventManagement" component={EventManagement} />
        <Stack.Screen
          name="StartEvent"
          component={StartEvent}
          options={{
            title: "Start An Event",
            headerStyle: {
              backgroundColor: "rgba(36,160,237,0.6)",
            },
          }}
        />
        <Stack.Screen
          name="EventReport"
          component={EventReport}
          options={{
            title: "Objects Reported",
            headerStyle: {
              backgroundColor: "rgba(36,160,237,0.6)",
            },
          }}
        />
        <Stack.Screen
          name="EventStatus"
          component={EventStatus}
          options={{
            title: "Check-In Status",
            headerStyle: {
              backgroundColor: "rgba(36,160,237,0.6)",
            },
          }}
        />
        <Stack.Screen name="LastEvent" component={LastEvent} />
        <Stack.Screen
          name="AssignVolunteer"
          component={AsssignVolunteer}
          options={{
            title: "Make Assignment",
            headerStyle: {
              backgroundColor: "rgba(36,160,237,0.6)",
            },
          }}
        />
        <Stack.Screen name="RemoveVolunteer" component={RemoveVolunteer} />
        <Stack.Screen name="ZoneDetail" component={ZoneDetail} />
        <Stack.Screen name="CurrentEventAdmin" component={CurrentEventAdmin} />
        <Stack.Screen
          name="ReassignVolunteers"
          component={ReassignVolunteers}
          options={{
            title: "Change Assignment",
            headerStyle: {
              backgroundColor: "rgba(36,160,237,0.6)",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function volunteerhome() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="DrawerVolunteer"
          children={drawerVolunteer}
          options={{
            headerShown: false,
            headerStyle: { backgroundColor: "red" },
          }}
        />
        <Stack.Screen name="VolunteerHome" component={VolunteerHome} />
        <Stack.Screen name="JoinEvent" component={JoinEvent} />
        <Stack.Screen name="CurrentEvent" component={CurrentEvent} />
        <Stack.Screen name="ReportOther" component={ReportOther} />
        <Stack.Screen
          name="ReportObject"
          component={ReportObject}
          options={{
            title: "Report an Object",
            headerStyle: {
              backgroundColor: "rgba(36,160,237,0.6)",
            },
          }}
        />
        <Stack.Screen name="ZONE" component={Map} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function authStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            title: "SIGNUP",
            headerStyle: {
              backgroundColor: "rgba(36,160,237,0.6)",
            },
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPass}
          options={{
            title: "Reset Password",
            headerStyle: {
              backgroundColor: "rgba(36,160,237,0.6)",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default class App extends Component {
  state = {
    user: {},
    userAdmin: null,
  };

  checkAdmin = (user) => {
    fire
      .firestore()
      .collection("ADMIN")
      .doc(fire.auth().currentUser.uid)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          this.setState({ user: user, userAdmin: true });
          console.log("This is an Admin!");
        } else {
          this.setState({ user: user, userAdmin: false });
          console.log("This is not an Admin!");
        }
      })
      .catch((error) => {
        Alert.alert("Error getting document:", error);
      });
  };

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
    } else if (this.state.user && this.state.userAdmin == true) {
      return adminhome();
    } else {
      return authStack();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
