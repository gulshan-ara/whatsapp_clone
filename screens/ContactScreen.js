import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import ProfileImage from "../components/ProfileImage";
import PageTitle from "../components/PageTitle";
import colors from "../constants/colors";
import { getUserChats } from "../utils/actions/userActions";
import DataItem from "../components/DataItem";
import SubmitButton from "../components/SubmitButton";
import { removeUserFromChat } from "../utils/actions/chatActions";

const ContactScreen = ({ route, navigation }) => {
	const [isLoading, setIsLoading] = useState(false);
	const storedUsers = useSelector((state) => state.users.storedUsers);
	const userData = useSelector((state) => state.auth.userData);
	const currentUser = storedUsers[route.params.uid];

	const storedChats = useSelector((state) => state.chats.chatsData);
	const [commonChats, setCommonChats] = useState([]);

	const chatId = route.params.chatId;
	const chatData = chatId && storedChats[chatId];

	useEffect(() => {
		const getCommonUserChats = async () => {
			const currentUserChats = await getUserChats(currentUser.userId);
			setCommonChats(
				Object.values(currentUserChats).filter(
					(cid) => storedChats[cid] && storedChats[cid].isGroupChat
				)
			);
		};

		getCommonUserChats();
	}, []);

	const removeFromChat = useCallback(async () => {
		try {
			setIsLoading(true);
			// remove user
			await removeUserFromChat(userData, currentUser, chatData);
			navigation.goBack();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [navigation, isLoading]);

	return (
		<PageContainer>
			<View style={styles.topContainer}>
				<ProfileImage
					uri={currentUser.profilePicture}
					size={80}
					style={{ marginBottom: 20 }}
				/>
				<PageTitle>
					{currentUser.firstName} {currentUser.lastName}
				</PageTitle>
				{currentUser.about && (
					<Text numberOfLines={2} style={styles.about}>
						{currentUser.about}
					</Text>
				)}
			</View>

			{commonChats.length > 0 && (
				<>
					<Text style={styles.heading}>
						{commonChats.length}{" "}
						{commonChats.length === 1 ? "Group" : "Groups"} in
						Common
					</Text>
					{commonChats.map((cid) => {
						const chatData = storedChats[cid];
						return (
							<DataItem
								key={cid}
								title={chatData.chatName}
								subTitle={chatData.latestMessage}
								image={chatData.chatImage}
								type="link"
								onPress={() => {
									navigation.push("ChatScreen", {
										chatId: cid,
									});
								}}
							/>
						);
					})}
				</>
			)}

			{chatData && chatData.isGroupChat && isLoading ?
			<ActivityIndicator size={"small"} color={colors.primary} /> :
			(
				<SubmitButton
					title="Remove from chat"
					color={colors.red}
					onPress={removeFromChat}
				/>
			)}
		</PageContainer>
	);
};

export default ContactScreen;

const styles = StyleSheet.create({
	topContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 20,
	},
	about: {
		fontFamily: "medium",
		letterSpacing: 0.3,
		fontSize: 16,
		color: colors.grey,
	},
	heading: {
		fontFamily: "bold",
		letterSpacing: 0.3,
		color: colors.textColor,
		marginVertical: 8,
	},
});
