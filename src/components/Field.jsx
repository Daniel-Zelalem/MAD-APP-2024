import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { darkGreen } from "../constants/Rule";

const Field = (props) => {
  return (
    <View>
      <TextInput
        {...props}
        style={styles.textInput}
        placeholderTextColor={darkGreen}
        fontWeight="bold"
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderRadius: 100,
    width: 300,
    color: darkGreen,
    padding: 15,
    marginTop: 20,
    backgroundColor: "rgb(220,220,220)",
  },
});

export default Field;
