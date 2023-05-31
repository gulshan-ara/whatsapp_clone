import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { useSelector } from "react-redux";

const ChatListScreen = ({ navigation, route }) => {
	// checking if any user is selected or not. if selected then pass the id
	const selectedUser = route?.params?.selectedUserId;
	const currentUserData = useSelector((state) => state.auth.userData);
	const userChats = useSelector((state) => {
		const chatsData = state.chats.chatsData;
		return Object.values(chatsData);
	});

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

		const navigationProps = { newChatData: { users: chatUsers } };

		navigation.navigate("ChatScreen", navigationProps);
	}, [route?.params]);

	return (
		<FlatList
		data={userChats}
		renderItem={(itemData) => {
			const chatData = itemData.item;
			const otherUserId = chatData.users.find(uid => uid !== currentUserData.userId);

			return <Text>{chatData.key}</Text>
		}}
		/>
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
