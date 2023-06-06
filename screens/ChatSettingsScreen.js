import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import ProfileImage from "../components/ProfileImage";

const ChatSettingsScreen = ({ route, navigation }) => {
	const chatId = route.params.chatId;
	const chatData = useSelector((state) => state.chats.chatsData[chatId]);
	const userData = useSelector((state) => state.auth.userData);

	return (
		<PageContainer>
			<PageTitle>Chat Settings</PageTitle>
			<ScrollView contentContainerStyle={styles.scrollView}>
				<ProfileImage 
					showEditButton={true}
					size={80}
					chatId={chatId}
					user_Id={userData.userId}
					uri={chatData.chatImage}
				/>
				<Text>{chatData.chatName}</Text>
			</ScrollView>
		</PageContainer>
	);
};

export default ChatSettingsScreen;

const styles = StyleSheet.create({
	scrollView: {
		justifyContent: 'center',
		alignItems: 'center'
	}
});
