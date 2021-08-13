import React, { Component } from "react";
import {
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Text,
  Button,
} from "react-native";
import fire from "../database/firebase";
import openMap from "react-native-open-maps";
import { NativeBaseProvider, Select } from "native-base";

export default class EventReport extends Component {
  state = {
    data_1: [],
    data_2: [],
    data_3: [],
    data_4: [],
    data_5: [],
    data_6: [],
    data: "",
    zone: 0,
    zoneplaceHolder: "Select a Zone",
  };

  handleFilter = (val) => {
    if (val == 0) {
      return this.state.data;
    } else if (val == 1) {
      return this.state.data_1;
    } else if (val == 2) {
      return this.state.data_2;
    } else if (val == 3) {
      return this.state.data_3;
    } else if (val == 4) {
      return this.state.data_4;
    } else if (val == 5) {
      return this.state.data_5;
    } else if (val == 6) {
      return this.state.data_6;
    }
  };
  changeStatus = (zone, id, eventID) => {
    fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(eventID)
      .collection("ZONE " + zone)
      .doc(id)
      .update({
        status: true,
      })
      .then(() => {
        console.log("ACKNOWLEDGED!");
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  getZone1 = () => {
    fire
      .firestore()
      .collectionGroup("ZONE 1")
      .where("status", "==", false)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            const x = doc.data();
            x.id = doc.id;
            data.push(x);
          });
          this.setState({
            data_1: data,
          });
        }
      })
      .then(() => {
        console.log(this.state.data_1);
        this.getZone2();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  getZone2 = () => {
    fire
      .firestore()
      .collectionGroup("ZONE 2")
      .where("status", "==", false)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            const x = doc.data();
            x.id = doc.id;
            data.push(x);
          });
          this.setState({
            data_2: data,
          });
        }
      })
      .then(() => {
        console.log(this.state.data_2);
        this.getZone3();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  getZone3 = () => {
    fire
      .firestore()
      .collectionGroup("ZONE 3")
      .where("status", "==", false)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            const x = doc.data();
            x.id = doc.id;
            data.push(x);
          });
          this.setState({
            data_3: data,
          });
        }
      })
      .then(() => {
        console.log(this.state.data_3);
        this.getZone4();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  getZone4 = () => {
    fire
      .firestore()
      .collectionGroup("ZONE 4")
      .where("status", "==", false)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            const x = doc.data();
            x.id = doc.id;
            data.push(x);
          });
          this.setState({
            data_4: data,
          });
        }
      })
      .then(() => {
        console.log(this.state.data_4);
        this.getZone5();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  getZone5 = () => {
    fire
      .firestore()
      .collectionGroup("ZONE 5")
      .where("status", "==", false)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            const x = doc.data();
            x.id = doc.id;
            data.push(x);
          });
          this.setState({
            data_5: data,
          });
        }
      })
      .then(() => {
        console.log(this.state.data_5);
        this.getZone6();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  getZone6 = () => {
    fire
      .firestore()
      .collectionGroup("ZONE 6")
      .where("status", "==", false)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = [];
          querySnapshot.forEach((doc) => {
            const x = doc.data();
            x.id = doc.id;
            data.push(x);
          });
          this.setState({
            data_6: data,
          });
        }
      })
      .then(() => {
        console.log(this.state.data_6);
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };
  mapper = (long, lat) => {
    openMap({ latitude: Number(lat), longitude: Number(long) });
  };

  componentDidMount() {
    this.getZone1();
  }

  onPickerSelect = (value) => {
    this.setState({
      zone: value,
      zoneplaceHolder: value.toString(),
    });
  };
  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={{ height:"100%",width:"100%"}}>
        <View style={{flex:0.4,backgroundColor:"blue"}}>
          <NativeBaseProvider>
            <Select
              placeholder={this.state.zoneplaceHolder}
              placeholderTextColor="black"
              marginTop="5%"
              mode="dropdown"
              width="60%"
              backgroundColor="lightblue"
              padding="10%"
              
              onValueChange={(itemValue) => this.onPickerSelect(itemValue)}
            >
              <Select.Item label="Zone 1" value={1} />
              <Select.Item label="Zone 2" value={2} />
              <Select.Item label="Zone 3" value={3} />
              <Select.Item label="Zone 4" value={4} />
              <Select.Item label="Zone 5" value={5} />
              <Select.Item label="Zone 6" value={6} />
            </Select>
          </NativeBaseProvider>
        </View>
        <View style={{flex:0.8}}>
        {this.state.zone == 0 ? null : (
          <FlatList
            data={this.handleFilter(this.state.zone)}
            renderItem={({ item }) => (
              <View style={styles.flatView}>
                <Text style={styles.headerText}>{item.description}</Text>
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={{ uri: item.imageUri }}
                    style={{ height: 200, width: 200, margin: "2%" }}
                  ></Image>
                </View>
                <View style={styles.rowView}>
                  <Button
                    title="See on Maps"
                    onPress={() => {
                      this.mapper(item.longitude, item.latitude);
                    }}
                  ></Button>
                  <Button
                    title="Acknowledge "
                    onPress={() => {
                      this.changeStatus(item.zone, item.id, item.eventID);
                      alert("Report Acknowledged")
                    }}
                  ></Button>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.email}
          />
        )}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    margin: "5%",
    backgroundColor: "#D9ACEA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  text: {
    padding: "10%",
    fontSize: 20,
    fontWeight: "bold",
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
    margin: "5%",
  },
  rowView: {
    flexDirection: "row",
    marginVertical: "5 %",

    margin: "5%",
  },
  flatView: {
    margin: "5%",
    backgroundColor: "lightblue",
    borderRadius: 20,
  },
});
