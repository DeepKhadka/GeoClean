import firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyBGPpsA8Xm1T11YoH-0zaTp4-u7aOYiSLE",
    authDomain: "geoclean-d8fa8.firebaseapp.com",
    projectId: "geoclean-d8fa8",
    storageBucket: "geoclean-d8fa8.appspot.com",
    messagingSenderId: "192883359577",
    appId: "1:192883359577:web:62a608bd429829c449d648",
    measurementId: "G-0V357BMYBL"
  };
  
  const fire  = firebase.initializeApp(firebaseConfig);

  export default fire;