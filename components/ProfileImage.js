import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

import userImage from "../assets/images/userImage.jpeg";
import colors from "../constants/colors";
import {
	launchImagePicker,
	uploadImageAsynce,
} from "../utils/imagePickerHelper";
import { updateSignedInUserDate } from "../utils/actions/authActions";
import { updateLoggedInUserData } from "../store/authSlice";
import { useDispatch } from "react-redux";

const ProfileImage = ({ size, uri, user_Id }) => {
	const dispatch = useDispatch();
	const source = uri ? { uri: uri } : userImage;
	const [image, setImage] = useState(source);
	const userId = user_Id;

	const pickImage = async () => {
		try {
			const tempUri = await launchImagePicker();

			if (!tempUri) {
				return;
			}

			// upload image to firebase storage
			const uploadedUri = await uploadImageAsynce(tempUri);

			if (!uploadedUri) {
				throw new Error("Could not upload image");
			}

			const newData = {
				profilePicture: uploadedUri,
			};
			// add profile picture to users database info
			await updateSignedInUserDate(userId, newData);

			// updating global states of redux
			dispatch(updateLoggedInUserData({ newData: newData }));

			// upload the selected image to local device
			setImage({ uri: uploadedUri });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<TouchableOpacity onPress={pickImage}>
			<Image
				source={image}
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
