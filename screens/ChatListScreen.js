import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";

const ChatListScreen = ({ navigation }) => {
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => {
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item title="New Chat" iconName="create-outline"/>
					</HeaderButtons>
				);
			},
		});
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.label}>ChatListScreen</Text>
			<Button
				title="Go to Chat Screen"
				onPress={() => navigation.navigate("ChatScreen")}
			/>
		</View>
	);
};

export default ChatListScreen;

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
