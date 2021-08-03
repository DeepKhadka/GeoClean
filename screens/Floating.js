import React, { Component } from "react";
import { View, Animated, StyleSheet, TextInput } from "react-native";

export default class FloatingTitleTextInputField extends Component {
  _animatedIsFocused = new Animated.Value(this.props.value === "" ? 0 : 1);
  state = {
    isFocused: false,
  };

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== "" ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  handleFocus = () => {
    this.setState({ isFocused: true });
  };
  handleBlur = () => {
    this.setState({ isFocused: false });
  };

  render() {
    const { label, ...props } = this.props;
    const { isFocused } = this.state;
    const labelStyle = {
      position: "absolute",
      left: 5,
      // transform: [
      //   {
      //     translateY: this._animatedIsFocused.interpolate({
      //       inputRange: [0, 1],
      //       outputRange: [18, 0],
      //     }),
      //   },
      // ],
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),

      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ["gray", "#BB86FC"],
      }),
    };
    return (
      <View
        style={{
          width: "80%",
          borderTopEndRadius: 3,
          borderTopStartRadius: 3,
          paddingTop: 18,
          backgroundColor: "#272727",
        }}
      >
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          {...props}
          style={{
            height: 30,
            paddingLeft: 5,
            fontSize: 15,
            color: "white",
            borderBottomWidth: 2,
            borderBottomColor:
              isFocused || this.props.value !== "" ? "#BB86FC" : "gray",
          }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        ></TextInput>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    width: "80%",
    borderRadius: 3,
    borderStyle: "solid",
    borderWidth: 0.5,
    height: "13%",
    marginVertical: "5%",
    backgroundColor: "#272727",
    borderBottomWidth: 2,
    borderBottomColor: "red",
  },
  textInput: {
    fontSize: 15,
    marginTop: "1%",

    color: "black",
  },
  titleStyles: {
    position: "absolute",
    color: "white",

    left: 3,
    left: 4,
  },
});