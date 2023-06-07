import {
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import React from "react";
import ProfileImage from "./ProfileImage";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const DataItem = ({
	title,
	subTitle,
	image,
	onPress,
	type,
	isChecked,
	icon,
	hideImage,
}) => {
	const isHideImage = hideImage && hideImage === true;

	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View style={styles.container}>
				{!icon && !isHideImage && (
					<ProfileImage uri={image} size={40} />
				)}
				{icon && (
					<View style={styles.leftIconContainer}>
						<AntDesign name={icon} size={24} color={colors.blue} />
					</View>
				)}
				<View style={styles.textContainer}>
					<Text
						numberOfLines={1}
						style={{
							...styles.title,
							...{
								color:
									type === "button"
										? colors.blue
										: colors.textColor,
							},
						}}
					>
						{title}
					</Text>
					{subTitle && (
						<Text numberOfLines={1} style={styles.subTitle}>
							{subTitle}
						</Text>
					)}
				</View>
				{type === "checkbox" && (
					<View
						style={{
							...styles.iconContainer,
							...(isChecked && styles.checkedStyle),
						}}
					>
						<Ionicons name="checkmark" size={18} color="white" />
					</View>
				)}
				{type === "link" && (
					<View>
						<Ionicons
							name="chevron-forward-outline"
							size={18}
							color={colors.grey}
						/>
					</View>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

export default DataItem;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		paddingVertical: 7,
		borderBottomColor: colors.extraLightGrey,
		borderBottomWidth: 1,
		alignItems: "center",
		minHeight: 50,
	},
	textContainer: {
		marginLeft: 14,
		flex: 1,
	},
	title: {
		fontFamily: "medium",
		fontSize: 16,
		letterSpacing: 0.3,
	},
	subTitle: {
		fontFamily: "regular",
		color: colors.grey,
		letterSpacing: 0.3,
	},
	iconContainer: {
		borderWidth: 1,
		borderRadius: 50,
		borderColor: colors.lightgrey,
		backgroundColor: "white",
	},
	checkedStyle: {
		backgroundColor: colors.primary,
		borderColor: "transparent",
	},
	leftIconContainer: {
		backgroundColor: colors.extraLightGrey,
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
		width: 40,
		height: 40,
	},
});
