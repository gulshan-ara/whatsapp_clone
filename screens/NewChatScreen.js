import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";

const NewChatScreen = ({ navigation }) => {
	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => {
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item
							title="close"
							onPress={() => navigation.goBack()}
						/>
					</HeaderButtons>
				);
			},
			headerTitle: "New Chat",
		});
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.label}>NewChatScreen</Text>
		</View>
	);
};

export default NewChatScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	label: {
		fontFamily: "black",
		fontSize: 18,
		color: "black",
	},
});
