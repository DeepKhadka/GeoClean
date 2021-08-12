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
  Alert,
} from "react-native";
import fire from "../database/firebase";
import { NativeBaseProvider, Select } from "native-base";
import { Icon } from "react-native-elements";
import * as Location from "expo-location";
import FloatingTextBox from "../assets/textEntry";

export default class ReportObject extends Component {
  state = {
    userId: "",
    Zone: "",
    zoneplaceHolder: "Select Zone",
    description: "",
    location: "",
    resultUri: " ",
    downloadUri: "",
    uploading: false,
  };

  componentDidMount = () => {};
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
      console.log(this.state.resultUri);
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
    } else if (this.state.Zone == "") {
      alert("Please select a Zone");
    } else if (this.state.description == "") {
      alert("Please Provide Description");
    } else {
      alert("Please upload a picture");
    }
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

  handleReport = () => {};
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

    this.setState({
      downloadUri: url,
    });
    this.handleReport();
  };

  onPickerSelect = (value) => {
    this.setState({
      Zone: value,
      zoneplaceHolder: value.toString(),
    });
  };
  handleGeoTag = () => {
    //handle geo tagging here
    alert("Your locaton was saved");
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={styles.safeview}>
        <View style={styles.rowView}>
          <NativeBaseProvider>
            <Select
              placeholder={this.state.zoneplaceHolder}
              backgroundColor="#ba84d1"
              placeholderTextColor="black"
              width={"50%"}
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

        <TextInput
          style={styles.input}
          onChangeText={(val) => {
            this.setState({ description: val });
          }}
          value={this.state.description}
          placeholder="Description"
          placeholderTextColor="purple"
        />
        <View style={styles.rowView}>
          <TouchableOpacity style={styles.card} onPress={this.handleGeoTag}>
            <Text style={styles.text}>Geo Tag</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={this.handleImagePicker}
          >
            <Text style={styles.text}>Image </Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: this.state.resultUri }}
            style={{ height: 150, width: 150 }}
          ></Image>
        </View>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity style={styles.card} onPress={this.checkEmpty}>
            <Text style={styles.text}>Report</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#ba84d1",
    justifyContent: "center",
    alignItems: "center",

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
    margin: "2%",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "blue",
    padding: "5%",
  },
});
