import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { useSelector } from "react-redux";

const ChatListScreen = ({ navigation, route }) => {
	// checking if any user is selected or not. if selected then pass the id
	const selectedUser = route?.params?.selectedUserId;
	const currentUserData = useSelector((state) => state.auth.userData);

	// icon on header for opening a new chat
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => {
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item
							title="New Chat"
							iconName="create-outline"
							onPress={() => navigation.navigate("NewChat")}
						/>
					</HeaderButtons>
				);
			},
		});
	}, []);

	// chat with selected user
	useEffect(() => {
		if (!selectedUser) {
			return;
		}

		const chatUsers = [selectedUser, currentUserData.userId];
		navigation.navigate("ChatScreen", { users: chatUsers });
	}, [selectedUser]);

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
