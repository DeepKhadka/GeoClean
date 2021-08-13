import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Switch,
  TextInput,
} from "react-native";
import fire from "../database/firebase";
import {
  Spinner,
  HStack,
  useColorModeValue,
  Center,
  NativeBaseProvider,
  Select,
} from "native-base";
import { backgroundColor } from "styled-system";

export default class AssignVolunteer extends Component {
  _isMounted = false;

  state = {
    data: null,
    eventID: "",
    volunteers: null,
    refreshing: false,
    selected: {},
    pickerText: {},
    status: true,
    tempStatus: false,
  };
  toggleSwitch() {
    this.setState({
      status: !this.state.status,
    });
  }
  onPickerSelect(index, idN) {
    /*s
        
        index has the selected item from the list*/
    // console.log(index);
    this.setState({
      selected: { ...this.state.selected, [id]: { zoneNumber: index, id: iN } },
    });

    console.log(this.state.selected.idN.id.toString());
  }

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.componentDidMount();
      }
    );
  };

  handleChange = (index) => {
    this.setState({
      selected: index,
    });
  };

  getCurrentEvent = () => {
    var eventID;
    this.setState({
      eventID:""
    })

    fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .where("eventStatus", "==", "current")
      .get()
      .then(async (sub) => {


        if (sub.docs.length > 0) {

        
          const data = [];
          sub.forEach((doc) => {
            eventID = doc.id.toString();
          });
          this.setState({
            eventID: eventID,
          });
        } else {

          await fire
            .firestore()
            .collection("ADMIN")
            .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
            .collection("EVENT MANAGEMENT")
            .where("eventStatus", "==", "paused")
            .get()
            .then((subdoc) => {

              if (subdoc.docs.length > 0) {
                console.log("else bhitra")
                const data_1 = []
                subdoc.forEach((doc_1) => {
                  eventID = doc_1.id.toString();
                });
                this.setState({
                  eventID: eventID
                })
              }
              
            })
            .catch((err) => {
              console.log(err.toString() + " error")
            });



        }
      })
      .then(() => {
        if(this.state.eventID==""){
          this.setState({
            data:[],
            refreshing:false
          })

        }else{
          this.getVolunteersInfo();
        }
      

      })
      .catch((err) => {
        console.log(err.toString());
      });
  };


  async getVolunteersInfo() {

    

    var data = [];

    return await fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(this.state.eventID)
      .collection("VOLUNTEERS")
      .get()
      .then(
        function (querySnapshot) {
          var results = [];

          querySnapshot.forEach(function (doc) {
            var docRef = fire
              .firestore()
              .collection("VOLUNTEER")
              .doc(doc.id)
              .get()
              .then(
                function (snap) {
                  const x = snap.data();
                  x.id = doc.id;
                  data.push(x);
                },
                function (error) {
                  Alert.alert(error.toString());
                }
              );
            // push promise from get into results
            results.push(docRef);
          });
          // dbPromise.then() resolves to  a single promise that resolves
          // once all results have resolved
          return Promise.all(results);
        },
        function (val) {
          d
          // The Promise was rejected.
          console.log(val);
        }
      )
      .then(() => {
        this.setState({
          data: data,
          refreshing: false,
        });
      })
      .then(() => {
        console.log(this.state.data);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

    }


  

  

  emptyComponent = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20, fontStyle: "italic", fontWeight: "bold" }}>
          No Volunteers Signed Up Yet...
        </Text>
      </View>
    );
  };

  componentDidMount() {
    this._isMounted = true;
    this.getCurrentEvent();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.data ? (
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ReassignVolunteers", { itemId: item.id, fname: item.fName, lname: item.lName, email: item.email, currentEventID: this.state.eventID });
                }}
                style={{
                  margin: "4%",
                  backgroundColor: "lightblue",
                  justifyContent: "space-between",
                  borderRadius: 10,

                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.headerText}>{item.fName} {item.lName}</Text>
                  


                </View>

              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.email}
            ListEmptyComponent={this.emptyComponent}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        ) : (
          <NativeBaseProvider>
            <Center flex={1}>
              <Spinner color="blue.500" />
            </Center>
          </NativeBaseProvider>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeview: {
    backgroundColor: "#a09fdf",
    height: "100%",
    width: "100%",
    flex: 1,
  },
  mainView: {
    height: "100%",
    width: "100%",

    flex: 1,
  },
  card: {
    margin: "5%",
    backgroundColor: "#D9ACEA",
    justifyContent: "center",

    borderRadius: 20,
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: "2%",

  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    alignContent: "center",
    padding: "5%"
  },
  rowView: {
    flexDirection: "row",
    marginVertical: "5 %",
    justifyContent: 'space-between',
    marginLeft: "2%"



  }
});
