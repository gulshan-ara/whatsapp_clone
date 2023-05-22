import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import colors from "../constants/colors";

const Input = (props) => {
  return (
    <View style={styles.container}>
      <Text>{props.label}</Text>

      <View style={styles.inputContainer}>
        {props.icon && (
          <props.iconPack
            name={props.icon}
            size={props.iconSize || 15}
            color="black"
            style={styles.icon}
          />
        )}
        <TextInput />
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    backgroundColor: colors.nearlyWhite,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: 'center'
  },
  icon: {
    marginRight: 10,
    color: colors.grey,
  },
});
