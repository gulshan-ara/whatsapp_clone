import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

export const launchImagePicker = async () => {
  await checkMediaPermissions();

  const result = await ImagePicker.launchImageLibraryAsync({
    // allows only images to pick
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    // allows to crop the image
    allowsEditing: true,
    // aspect ratio
    aspect: [1, 1], // square image
    quality: 1,
  });

  if (!result.canceled) {
    return result.uri;
  }

};

const checkMediaPermissions = async () => {
  if (Platform.OS !== "web") {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      return Promise.reject("We need permission to access your photos");
    }
  }

  return Promise.resolve();
};
