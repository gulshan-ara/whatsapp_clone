import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../constants/colors.js";

const PageTitle = (props) => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>{props.children}</Text>
		</View>
	);
};

export default PageTitle;

const styles = StyleSheet.create({
	container: {
		marginBottom: 10,
	},
	text: {
		fontSize: 28,
		fontFamily: "bold",
		letterSpacing: 0.3,
		color: colors.textColor,
	},
});
