import React, { Component } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Button,
  StyleSheet,
  TextInputComponent,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { Icon } from "react-native-elements";

import fire from "../database/firebase";
import { NativeBaseProvider, Select } from "native-base";

import * as Location from "expo-location";
import FloatingTextBox from "../assets/textEntry";
import Constants from "expo-constants";
import ModalSelector from "react-native-modal-selector";

export default class ReportObject extends Component {
  state = {
    userId: "",
    Zone: "",
    zoneplaceHolder: "Select Zone",
    description: "",
    latitude: "",
    longitude: "",
    resultUri: " ",
    downloadUri: "",
    uploading: false,
  };

  _getLocation = async () => {
    (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        alert(
          "Oops, this will not work on Snack in an Android emulator. Try it on your device!"
        );

        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");

        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      this.setState(
        {
          latitude: location.coords.latitude.toString(),
          longitude: location.coords.longitude.toString(),
        },
        this.handleReport
      );
    })();
  };

  componentDidMount = () => {console.log(this.props.route.params.ID)};

  pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,

      quality: 1,
    });

    if (!result.cancelled) {
      this.setState({ resultUri: result.uri });
      console.log("State");
      // console.log(this.state.resultUri);
    }
  };

  handlesignout = () => {
    fire.auth().signOut();
  };

  setLocation = (value) => {
    this.setState({
      location: value,
    });
  };

  checkEmpty = () => {
    if (
      this.state.Zone != "" &&
      this.state.description != "" &&
      this.state.resultUri != " "
    ) {
      this.uploadImage();
    } else if (
      this.state.Zone == "" ||
      this.state.description == "" ||
      this.state.resultUri == " "
    ) {
      alert("Please fill all the fields!");
    }
  };

  handleReport = () => {
    fire
      .firestore()

      .collection("ADMIN")
      .doc("VFHwReyBcYPWFgEiDEoZfvi3UEr2")
      .collection("EVENT MANAGEMENT")
      .doc(this.props.route.params.ID)
      .collection("ZONE " + this.state.Zone)
      .doc()
      .set({
        zone: Number(this.state.Zone),
        description: this.state.description,
        longitude: this.state.longitude,
        latitude: this.state.latitude,
        imageUri: this.state.downloadUri,
        status: false,
        eventID: this.props.route.params.ID,
      })
      .then(() => {
        alert("Report Submitted!");
        this.props.navigation.goBack();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      this.setState({ resultUri: result.uri });
      console.log("State");
      console.log(this.state.resultUri);
    }
  };

  handleImagePicker = () => {
    Alert.alert(
      "Media",
      "Please Select ",

      [
        {
          text: "Take A Picture",
          onPress: () => {
            this.openCamera();
          },
        },
        {
          text: "Camera Roll",
          onPress: () => {
            this.pickImage();
          },
        },
      ]
    );
  };

  uploadImage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", this.state.resultUri, true);
      xhr.send(null);
    });
    const ref = fire.storage().ref().child(new Date().toISOString());
    await ref.put(blob);
    const url = await ref.getDownloadURL().catch((error) => {
      throw error;
    });

    this.setState(
      {
        downloadUri: url,
      },
      this._getLocation
    );
  };

  onPickerSelect = (value) => {
    this.setState({
      Zone: value,
      zoneplaceHolder: "Zone " + value,
    });
  };

  render() {
    const { navigation } = this.props;
    const data = [
      { key: 1, section: true, label: "Zone 1" },
      { key: 2, label: "Zone 2" },
      { key: 3, label: "Zone 3" },
      { key: 4, label: "Zone 4" },
      { key: 5, label: "Zone 5" },
      { key: 6, label: "Zone 6" },
    ];
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} enabled={true}>
      <ImageBackground
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/geoclean-d8fa8.appspot.com/o/loginBackground.png?alt=media&token=42816f1f-8ecb-4ae5-9dd4-3d9c7f4ce377",
        }}
        style={styles.backgroundStyle}
      >
       
        <SafeAreaView style={styles.safeview}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor:"rgba(36,160,237,0.4)"
            }}
          >
            <ModalSelector
              data={data}
              initValue={this.state.zoneplaceHolder}
              style={{
              
              
                marginTop: "2%",
                marginLeft: "5%",
                borderRadius: 5,
            borderBottomWidth:2              }}
              initValueTextStyle={{ color: "black" ,fontWeight:"bold"}}
              onChange={(option) => {
                this.onPickerSelect(option.key);
              }}
            />
            <TouchableOpacity style={{margin:"2%",backgroundColor:"rgba(36,160,237,0.8)",borderRadius:10,borderBottomWidth:2}} onPress={this.handleImagePicker}>
            <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}} >
            <Icon
                      name="photo"
                      color="green"
                      onPress={this.iconPress}
                      size={40}
                      

            
                    ></Icon>
              <Text style={styles.headerText}>Add Image </Text>
            </View>
            </TouchableOpacity>
            
          </View>

          <View style={{ flex: 13 }}>
            <TextInput
              style={styles.input}
              onChangeText={(val) => {
                this.setState({ description: val });
              }}
              value={this.state.description}
              placeholder="Description"
              placeholderTextColor="purple"
            />

            <View style={{ alignItems: "center" }}>
              {this.state.resultUri==" "? <View style={{ alignItems: "center" }}>
              <TouchableOpacity style={{margin:"2%",backgroundColor:"rgba(36,160,237,0.8)",borderRadius:10,borderBottomWidth:2}} onPress={this.checkEmpty}>
                <Text style={styles.text}>Report</Text>
              </TouchableOpacity>
            </View> : 
                    <View style={{ alignItems: "center" }}>
                      <Image
                source={{ uri: this.state.resultUri }}
                style={styles.imageStyle}
              ></Image>
              <TouchableOpacity style={{margin:"2%",backgroundColor:"rgba(36,160,237,0.8)",borderRadius:20,borderBottomWidth:2}} onPress={this.checkEmpty}>
                <Text style={styles.text}>Report</Text>
              </TouchableOpacity>
                      </View>
            }
              
            </View>

            
          </View>
        </SafeAreaView>
       
      </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  safeview: {
    height: "100%",
    width: "100%",
  },
  mainView: {
    height: "100%",
    width: "100%",

    flex: 1,
  },
  card: {
  
    backgroundColor: "lightblue",
    margin:"2%",
    opacity: 0.6,
    borderRadius: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "2%",
    padding: "5%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    alignContent: "center",
  },
  rowView: {
    flexDirection: "row",
    marginVertical: "5 %",
    justifyContent: "space-between",
    marginLeft: "2%",
  },
  input: {
    height: "20%",
    margin: "5%",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "blue",
    padding: "5%",
    backgroundColor: "lightblue",
    opacity: 0.6,
  },
  backgroundStyle: {
    height: "100%",
    width: "100%",
  },
  imageStyle:{
    height:300,
    width:300
    

  },
});
