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
  ImageBackground,
} from "react-native";
import fire from "../database/firebase";
import openMap from "react-native-open-maps";
import DefaultCard from "../assets/Defaultcardview";

import ModalSelector from "react-native-modal-selector";

export default class EventReport extends Component {
  _isMounted = false;

  state = {
    data_1: [],
    data_2: [],
    data_3: [],
    data_4: [],
    data_5: [],
    data_6: [],
    data: "",
    zone: 1,
    zoneplaceHolder: "Zone 1",
    refreshing: false,
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
        this._isMounted &&
          this.setState({
            data_6: [],
            data_1: [],
            data_2: [],
            data_3: [],
            data_4: [],
            data_5: [],
          });
        this._isMounted && this.handleRefresh();
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
        if (!querySnapshot.empty && this._isMounted) {
          const data = [];
          querySnapshot.forEach((doc) => {
            const x = doc.data();
            x.id = doc.id;
            data.push(x);
          });
          this._isMounted &&
            this._isMounted &&
            this.setState({
              data_1: data,
            });
        }
      })
      .then(() => {
        console.log(this.state.data_1);
        this._isMounted && this.getZone2();
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
        if (!querySnapshot.empty && this._isMounted) {
          const data = [];
          querySnapshot.forEach((doc) => {
            const x = doc.data();
            x.id = doc.id;
            data.push(x);
          });
          this._isMounted &&
            this._isMounted &&
            this.setState({
              data_2: data,
            });
        }
      })
      .then(() => {
        console.log(this.state.data_2);
        this._isMounted && this.getZone3();
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
        if (!querySnapshot.empty && this._isMounted) {
          const data = [];
          querySnapshot.forEach((doc) => {
            const x = doc.data();
            x.id = doc.id;
            data.push(x);
          });
          this._isMounted &&
            this._isMounted &&
            this.setState({
              data_3: data,
            });
        }
      })
      .then(() => {
        console.log(this.state.data_3);
        this._isMounted && this.getZone4();
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
          this._isMounted &&
            this.setState({
              data_4: data,
            });
        }
      })
      .then(() => {
        console.log(this.state.data_4);
        this._isMounted && this.getZone5();
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
        if (!querySnapshot.empty && this._isMounted) {
          const data = [];
          querySnapshot.forEach((doc) => {
            const x = doc.data();
            x.id = doc.id;
            data.push(x);
          });
          this._isMounted &&
            this.setState({
              data_5: data,
            });
        }
      })
      .then(() => {
        console.log(this.state.data_5);
        this._isMounted && this.getZone6();
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
        if (!querySnapshot.empty && this._isMounted) {
          const data = [];
          querySnapshot.forEach((doc) => {
            const x = doc.data();
            x.id = doc.id;
            data.push(x);
          });
          this._isMounted &&
            this.setState({
              data_6: data,
            });
        }
      })
      .then(() => {
        console.log(this.state.data_6);
        this._isMounted &&
          this.setState({
            refreshing: false,
          });
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };
  mapper = (long, lat) => {
    openMap({ latitude: Number(lat), longitude: Number(long) });
  };

  componentDidMount() {
    this._isMounted = true;
    this.getZone1();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onPickerSelect = (value, key) => {
    this._isMounted &&
      this.setState(
        {
          zone: value,
          zoneplaceHolder: "Zone " + value,
        },
        console.log(value)
      );
  };
  emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginTop: "7%",
        }}
      >
        <Text style={{ fontSize: 20, fontStyle: "italic", fontWeight: "bold" }}>
          No reports on this Zone...
        </Text>
      </View>
    );
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,

        data_1: [],
        data_2: [],
        data_3: [],
        data_4: [],
        data_5: [],
        data_6: [],
      },
      () => {
        this.componentDidMount();
      }
    );
  };

  render() {
    const { navigation } = this.props;
    const data = [
      { key: 1, label: "Zone 1" },
      { key: 2, label: "Zone 2" },
      { key: 3, label: "Zone 3" },
      { key: 4, label: "Zone 4" },
      { key: 5, label: "Zone 5" },
      { key: 6, label: "Zone 6" },
    ];

    return (
      <ImageBackground
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/geoclean-d8fa8.appspot.com/o/loginBackground.png?alt=media&token=42816f1f-8ecb-4ae5-9dd4-3d9c7f4ce377",
        }}
        style={styles.backgroundStyle}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <ModalSelector
              data={data}
              initValue={this.state.zoneplaceHolder}
              style={{
                width: "50%",
                margin: "2%",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              }}
              initValueTextStyle={{
                fontWeight: "bold",
                color: "blue",
                padding: "2%",
              }}
              onChange={(option) => {
                this.onPickerSelect(option.key);
              }}
            />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 15, color: "gray" }}>
                Pull to refresh
              </Text>
            </View>
          </View>
          <View style={{ flex: 10 }}>
            {this.state.zone == 0 ? null : (
              <FlatList
                data={this.handleFilter(this.state.zone)}
                renderItem={({ item, key }) => (
                  <View style={styles.flatView}>
                    <Text style={styles.headerText}>{item.description}</Text>
                    <View style={{ alignItems: "center" }}>
                      <Image
                        source={{ uri: item.imageUri }}
                        style={{ height: 300, width: 300, margin: "2%" }}
                      ></Image>
                    </View>
                    <View style={styles.rowView}>
                      <TouchableOpacity
                        style={{
                          margin: "5%",
                          padding: "2%",
                          borderRadius: 10,
                          justifyContent: "center",

                          backgroundColor: "rgba(50, 200, 100,0.5)",
                          borderBottom: 2,
                        }}
                        onPress={() => {
                          this.mapper(item.longitude, item.latitude);
                        }}
                      >
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                          See in Maps
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          margin: "5%",
                          padding: "2%",
                          borderRadius: 10,
                          justifyContent: "center",

                          backgroundColor: "rgba(50, 200, 100,0.5)",
                          borderBottom: 2,
                        }}
                        onPress={() => {
                          this.changeStatus(item.zone, item.id, item.eventID);
                          alert("Report Acknowledged");
                        }}
                      >
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                          Acknowledge
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                ListEmptyComponent={this.emptyComponent}
              />
            )}
          </View>
        </SafeAreaView>
      </ImageBackground>
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
    justifyContent: "space-between",

    margin: "5%",
  },
  flatView: {
    margin: "5%",
    padding: "2%",
    borderRadius: 10,

    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  backgroundStyle: {
    height: "100%",
    width: "100%",
  },
});
