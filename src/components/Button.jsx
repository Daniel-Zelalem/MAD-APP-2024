import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function Button({ bgcolor, btnlable, textColor, Press }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: bgcolor,
        borderRadius: 100,
        alignItems: "center",
        width: 300,
        padding: 13,
  
        marginVertical: 20,
        marginLeft: 2,
      }}
      onPress={Press}
    >
      <Text style={{ color: textColor, fontSize: 25, fontWeight: "bold" }}>
        {btnlable}
      </Text>
    </TouchableOpacity>
  );
}
