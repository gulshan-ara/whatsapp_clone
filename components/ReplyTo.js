import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import colors from "../constants/colors";

const ReplyTo = ({ text, user, onCancel }) => {
	const name = `${user.firstName} ${user.lastName}`;
	return (
		<View style={styles.container}>
			<View style={styles.textContainer}>
				<Text numberOfLines={1} style={styles.name}>
					{name}
				</Text>
				<Text numberOfLines={1}>{text}</Text>
			</View>

			<TouchableOpacity onPress={onCancel}>
				<AntDesign name="closecircleo" size={24} color={colors.blue} />
			</TouchableOpacity>
		</View>
	);
};

export default ReplyTo;

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.extraLightGrey,
		padding: 8,
		flexDirection: "row",
		alignItems: "center",
		borderLeftColor: colors.blue,
		borderLeftWidth: 6,
	},
	textContainer: {
		flex: 1,
		marginRight: 5,
	},
	name: {
		color: colors.blue,
		fontFamily: "medium",
		letterSpacing: 0.3,
	},
});
