import React, { Component, useState, useEffect } from "react";
import { Platform } from "react-native";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { StyleSheet, View, Text, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Polygon } from "react-native-maps";
import fire from "../database/firebase";
import {
  locations1,
  locations2,
  locations3,
  locations4,
  locations5,
  locations6,
} from "./data";
import { width } from "styled-system";

const response = [
  {
    id: "1",
    coordinates: {
      latitude: 32.7243643,
      longitude: -97.1724442,
    },
    title: "ZONE-1",
    description: "",
    icon: require("../assets/zone.png"),
  },
  {
    id: "2",
    coordinates: {
      latitude: 32.7194292,
      longitude: -97.1742003,
    },
    title: "ZONE-2",
    description: "",
    category: 1,
    icon: require("../assets/zone.png"),
  },
  {
    id: "3",
    coordinates: {
      latitude: 32.7165527,
      longitude: -97.1726284,
    },
    title: "ZONE-3",
    description: "",
    category: 1,
    icon: require("../assets/zone.png"),
  },
  {
    id: "4",
    coordinates: {
      latitude: 32.712055,
      longitude: -97.174572,
    },
    title: "ZONE-4",
    description: "",
    category: 1,
    icon: require("../assets/zone.png"),
  },
  {
    id: "5",
    coordinates: {
      latitude: 32.7113244,
      longitude: -97.1789864,
    },
    title: "ZONE-5",
    description: "",
    category: 1,
    icon: require("../assets/zone.png"),
  },
  {
    id: "6",
    coordinates: {
      latitude: 32.7087483,
      longitude: -97.1722252,
    },
    title: "ZONE-6",
    description: "",
    category: 1,
    icon: require("../assets/zone.png"),
  },
];

export default class Map extends Component {
  _isMounted = false;

  state = {
    location: {},
    errorMessage: "",
    longitude: "",
    latitude: "",
    data_1: [],
    data_2: [],
    data_3: [],
    data_4: [],
    data_5: [],
    data_6: [],
    dataCheck: false,
    eventID: "",
    volunteer_info: [],
  };
  componentWillUnmount() {
    this._isMounted = false;
  }

  getCurrentEvent = () => {
    var eventID = "";

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
            const x = doc.data();
            x.id = doc.id;
            eventID = doc.id.toString();
            data.push(x);
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
                console.log("else bhitra");
                const data_1 = [];
                subdoc.forEach((doc_1) => {
                  const x = doc_1.data();
                  x.id = doc_1.id;
                  eventID = doc_1.id.toString();
                  data_1.push(x);
                });
                this.setState({
                  eventID: eventID,
                });
              }
            })
            .catch((err) => {
              console.log(err.toString() + " error");
            });
        }
      })
      .then(() => {
        console.log(this.state.eventID);
        if (this.state.eventID != "") {
          this.statusCheck();
        }
      })

      .catch((err) => {
        console.log(err.toString());
      });
  };

  statusCheck = () => {
    fire
      .firestore()
      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(this.state.eventID)
      .collection("VOLUNTEERS")
      .where("volunteerID", "==", fire.auth().currentUser.uid.toString())
      .get()
      .then((sub) => {
        if (sub.docs.length > 0) {
          const data = [];
          sub.forEach((doc) => {
            const x = doc.data();
            data.push(x);
          });

          this.setState({
            volunteer_info: data,
          });
        }
      })
      .then(() => {
        console.log(this.state.volunteer_info);
        this._getLocation();
      })

      .catch((err) => {
        console.log(err.toString());
      });
  };

  componentDidMount() {
    this._isMounted = true;
    if (this.props.route.params.admin && this.state.dataCheck == false) {
      this.getZone1();
    } else if (
      this.props.route.params.volunteer &&
      this.state.dataCheck == false
    ) {
      this.getCurrentEvent();
    } else {
      this._getLocation();
    }
  }

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
        this._getLocation();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  _getLocation = async () => {
    (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        this.setState({
          errorMessage:
            "Oops, this will not work on Snack in an Android emulator. Try it on your device!",
        });

        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        this.setState({
          errorMessage: "Permission to access location was denied",
        });

        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      this.setState(
        {
          location: location,
          latitude: location.coords.latitude.toString(),
          longitude: location.coords.longitude.toString(),
          dataCheck: true,
        },
        () => {
          this.componentDidMount();
        }
      );
    })();
  };

  render() {
    var squarez = [];
    for (let i = 0; i < locations1.length; i += 5) {
      squarez.push({
        coordinates: [
          {
            latitude: locations1[i].latitude,
            longitude: locations1[i].longitude,
          },
          {
            latitude: locations1[i + 1].latitude,
            longitude: locations1[i + 1].longitude,
          },
          {
            latitude: locations1[i + 2].latitude,
            longitude: locations1[i + 2].longitude,
          },
          {
            latitude: locations1[i + 3].latitude,
            longitude: locations1[i + 3].longitude,
          },
        ],
        open: false,
      });
    }

    var squarez2 = [];
    for (let i = 0; i < locations2.length; i += 5) {
      squarez2.push({
        coordinates: [
          {
            latitude: locations2[i].latitude,
            longitude: locations2[i].longitude,
          },
          {
            latitude: locations2[i + 1].latitude,
            longitude: locations2[i + 1].longitude,
          },
          {
            latitude: locations2[i + 2].latitude,
            longitude: locations2[i + 2].longitude,
          },
          {
            latitude: locations2[i + 3].latitude,
            longitude: locations2[i + 3].longitude,
          },
        ],
        open: false,
      });
    }

    var squarez3 = [];
    for (let i = 0; i < locations3.length; i += 5) {
      squarez3.push({
        coordinates: [
          {
            latitude: locations3[i].latitude,
            longitude: locations3[i].longitude,
          },
          {
            latitude: locations3[i + 1].latitude,
            longitude: locations3[i + 1].longitude,
          },
          {
            latitude: locations3[i + 2].latitude,
            longitude: locations3[i + 2].longitude,
          },
          {
            latitude: locations3[i + 3].latitude,
            longitude: locations3[i + 3].longitude,
          },
        ],
        open: false,
      });
    }

    var squarez4 = [];
    for (let i = 0; i < locations4.length; i += 5) {
      squarez4.push({
        coordinates: [
          {
            latitude: locations4[i].latitude,
            longitude: locations4[i].longitude,
          },
          {
            latitude: locations4[i + 1].latitude,
            longitude: locations4[i + 1].longitude,
          },
          {
            latitude: locations4[i + 2].latitude,
            longitude: locations4[i + 2].longitude,
          },
          {
            latitude: locations4[i + 3].latitude,
            longitude: locations4[i + 3].longitude,
          },
        ],
        open: false,
      });
    }

    var squarez5 = [];
    for (let i = 0; i < locations5.length; i += 5) {
      squarez5.push({
        coordinates: [
          {
            latitude: locations5[i].latitude,
            longitude: locations5[i].longitude,
          },
          {
            latitude: locations5[i + 1].latitude,
            longitude: locations5[i + 1].longitude,
          },
          {
            latitude: locations5[i + 2].latitude,
            longitude: locations5[i + 2].longitude,
          },
          {
            latitude: locations5[i + 3].latitude,
            longitude: locations5[i + 3].longitude,
          },
        ],
        open: false,
      });
    }

    var squarez6 = [];
    for (let i = 0; i < locations6.length; i += 5) {
      squarez6.push({
        coordinates: [
          {
            latitude: locations6[i].latitude,
            longitude: locations6[i].longitude,
          },
          {
            latitude: locations6[i + 1].latitude,
            longitude: locations6[i + 1].longitude,
          },
          {
            latitude: locations6[i + 2].latitude,
            longitude: locations6[i + 2].longitude,
          },
          {
            latitude: locations6[i + 3].latitude,
            longitude: locations6[i + 3].longitude,
          },
        ],
        open: false,
      });
    }

    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 32.7165527,
            longitude: -97.1726284,
            latitudeDelta: 0.009,
            longitudeDelta: 0.02,
          }}
        >
          {response.map((marker) => (
            <MapView.Marker
              key={marker.id}
              coordinate={marker.coordinates}
              title={marker.title}
              description={marker.description}
            >
              <Image source={marker.icon} style={{ height: 32, width: 32 }} />
            </MapView.Marker>
          ))}

          {squarez.map((polygon, index) => (
            <View key={index}>
              <Polygon
                coordinates={polygon.coordinates}
                strokeColor="rgba(255,0,0,0.4)"
                strokeWidth={6}
                tappable={true}
              />
              <Marker
                coordinate={{
                  latitude: Number(this.state.latitude),
                  longitude: Number(this.state.longitude),
                }}
                pinColor="#0000FF"
                title="You are here"
                image=""
              />
            </View>
          ))}

          {squarez2.map((polygon, index) => (
            <View key={index}>
              <Polygon
                coordinates={polygon.coordinates}
                strokeColor="rgba(0,0,255,0.4)"
                strokeWidth={6}
                tappable={true}
              />
            </View>
          ))}

          {squarez3.map((polygon, index) => (
            <View key={index}>
              <Polygon
                coordinates={polygon.coordinates}
                // strokeColor="rgba(255,0,0,0.4)"
                strokeColor="rgba(237, 142, 242, 1)"
                strokeWidth={6}
                tappable={true}
              />
            </View>
          ))}

          {squarez4.map((polygon, index) => (
            <View key={index}>
              <Polygon
                coordinates={polygon.coordinates}
                strokeColor="rgba(255,255,0,1)"
                strokeWidth={6}
                tappable={true}
              />
            </View>
          ))}

          {squarez4.map((polygon, index) => (
            <View key={index}>
              <Polygon
                coordinates={polygon.coordinates}
                strokeColor="#FF00FF"
                strokeWidth={6}
                tappable={true}
              />
            </View>
          ))}

          {squarez5.map((polygon, index) => (
            <View key={index}>
              <Polygon
                coordinates={polygon.coordinates}
                strokeColor="#00ff00"
                strokeWidth={6}
                tappable={true}
              />
            </View>
          ))}

          {squarez6.map((polygon, index) => (
            <View key={index}>
              <Polygon
                coordinates={polygon.coordinates}
                strokeColor="#0AFFFF"
                strokeWidth={6}
                tappable={true}
              />
            </View>
          ))}
        </MapView>

        <View style={styles.legendContainer}>
          <Text style={styles.guide}>GUIDE</Text>
          <Image
            source={require("../assets/whitelegend.png")}
            style={styles.legend}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },

  legendContainer: {
    position: "absolute",
    left: 200,
    right: 0,
    bottom: 0,
    height: 65,
    width: 210,
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  legend: {
    height: "400%",
    width: "400%",
    position: "absolute",
    top: -200,
    opacity: 0.7,
  },

  guide: {
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    top: -230,
    opacity: 0.7,
  },

  map: {
    flex: 1,
  },
});
