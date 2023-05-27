import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

import userImage from "../assets/images/userImage.jpeg";
import colors from "../constants/colors";
import { launchImagePicker } from "../utils/imagePickerHelper";

const ProfileImage = ({ size }) => {
  const pickImage = () => {
    launchImagePicker();
  };

  return (
    <TouchableOpacity onPress={pickImage}>
      <Image
        source={userImage}
        style={{ ...styles.image, width: size, height: size }}
      />
      <View style={styles.editIconImg}>
        <FontAwesome name="pencil" size={15} color="black" />
      </View>
    </TouchableOpacity>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
    borderColor: colors.grey,
    borderWidth: 1,
  },
  editIconImg: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.lightgrey,
    borderRadius: 20,
    padding: 5,
  },
});
