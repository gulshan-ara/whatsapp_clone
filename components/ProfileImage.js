import {
	ActivityIndicator,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
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

const ProfileImage = ({ size, uri, user_Id, showEditButton, onPress }) => {
	const dispatch = useDispatch();
	const source = uri ? { uri: uri } : userImage;
	const [image, setImage] = useState(source);
	const [isLoading, setIsLoading] = useState(false);
	const showEditIcon = showEditButton && showEditButton === true;
	const userId = user_Id;

	const pickImage = async () => {
		try {
			const tempUri = await launchImagePicker();

			if (!tempUri) {
				return;
			}

			setIsLoading(true);
			// upload image to firebase storage
			const uploadedUri = await uploadImageAsynce(tempUri);
			setIsLoading(false);

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
			setIsLoading(false);
		}
	};

	const Container = onPress || showEditIcon ? TouchableOpacity : View;

	return (
		<Container onPress={onPress || pickImage}>
			{isLoading ? (
				<View height={size} width={size}>
					<ActivityIndicator
						size={"small"}
						color={colors.primary}
						style={styles.loadingIndicator}
					/>
				</View>
			) : (
				<Image
					source={image}
					style={{ ...styles.image, width: size, height: size }}
				/>
			)}
			{showEditIcon && !isLoading && (
				<View style={styles.editIconImg}>
					<FontAwesome name="pencil" size={15} color="black" />
				</View>
			)}
		</Container>
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
	loadingIndicator: {
		justifyContent: "center",
		alignItems: "center",
	},
});
