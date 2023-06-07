import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	FlatList,
	Text,
	Image,
	ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ImageBackground } from "react-native";
import { Feather } from "@expo/vector-icons";
import backgroundImage from "../assets/images/droplet.jpeg";
import colors from "../constants/colors";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import Bubble from "../components/Bubble";
import {
	createChat,
	sendImageMessage,
	sendTextMessage,
} from "../utils/actions/chatActions";
import ReplyTo from "../components/ReplyTo";
import {
	launchImagePicker,
	openCamera,
	uploadImageAsynce,
} from "../utils/imagePickerHelper";
import AwesomeAlert from "react-native-awesome-alerts";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

const ChatScreen = ({ navigation, route }) => {
	const flatList = useRef();
	const [messageText, setMessageText] = useState("");
	const [chatUsers, setChatUsers] = useState([]);
	const [errorBannerText, setErrorBannerText] = useState("");
	const [replyingTo, setReplyingTo] = useState();
	const [tempImageUri, setTempImageUri] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [chatId, setChatId] = useState(route?.params?.chatId);

	const currentUserData = useSelector((state) => state.auth.userData);
	const storedUsers = useSelector((state) => state.users.storedUsers);
	const storedChats = useSelector((state) => state.chats.chatsData);
	const chatData =
		(chatId && storedChats[chatId]) || route?.params?.newChatData;

	// retrieve chats for one chat only
	const chatMessages = useSelector((state) => {
		if (!chatId) return [];
		const chatMessageData = state.messages.messagesData[chatId];
		if (!chatMessageData) return [];

		const messageList = [];
		for (const key in chatMessageData) {
			const message = chatMessageData[key];

			messageList.push({
				key,
				...message,
			});
		}

		return messageList;
	});

	// set the other user name as chat title
	const getChatTitleFromName = () => {
		// finding the other user's id from the chatUsers
		const otherUserId = chatUsers.find(
			(uid) => uid !== currentUserData.userId
		);

		// pulling other users data from redux state using the user id
		const otherUserData = storedUsers[otherUserId];

		// returning the users name
		return (
			otherUserData &&
			`${otherUserData.firstName} ${otherUserData.lastName}`
		);
	};

	const title = chatData.chatName ?? getChatTitleFromName();

	// set chat users
	useEffect(() => {
		// setting the header title of chat
		navigation.setOptions({
			headerTitle: title,
			headerRight: () => {
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						{chatId && (
							<Item
								title="Chat Settings"
								iconName="settings-outline"
								color={colors.textColor}
								onPress={() => {
									chatData.isGroupChat
										? navigation.navigate("ChatSettings", {
												chatId: chatId,
										  })
										: navigation.navigate("Contact", {
												uid: chatUsers.find(
													(uid) =>
														uid !==
														currentUserData.userId
												),
										  });
								}}
							/>
						)}
					</HeaderButtons>
				);
			},
		});

		setChatUsers(chatData.users);
	}, [chatUsers, title]);

	// This function will render only when messageText is changed
	const sendMessage = useCallback(async () => {
		try {
			// send message logic
			let id = chatId;
			if (!id) {
				// no chat id, create the chat
				id = await createChat(
					currentUserData.userId,
					route.params.newChatData
				);
				setChatId(id);
			}

			// send the text message to db
			await sendTextMessage(
				id,
				currentUserData.userId,
				messageText,
				replyingTo && replyingTo.key
			);

			setMessageText("");
			setReplyingTo(null);
		} catch (error) {
			console.log(error);
			setErrorBannerText("Message failed to send");
			setTimeout(() => setErrorBannerText(""), 5000);
		}
	}, [messageText, chatId]);

	// function to open image picker
	const pickImage = useCallback(async () => {
		try {
			const tempUri = await launchImagePicker();
			if (!tempUri) return;

			setTempImageUri(tempUri);
		} catch (error) {
			console.log(error);
		}
	}, [tempImageUri]);

	// function to take photos using camera
	const takePhotos = useCallback(async () => {
		try {
			const tempUri = await openCamera();
			if (!tempUri) return;

			setTempImageUri(tempUri);
		} catch (error) {
			console.log(error);
		}
	}, [tempImageUri]);

	// function to upload image
	const uploadImage = useCallback(async () => {
		setIsLoading(true);
		try {
			// send message logic
			let id = chatId;
			if (!id) {
				// no chat id, create the chat
				id = await createChat(
					currentUserData.userId,
					route.params.newChatData
				);
				setChatId(id);
			}

			const uploadUrl = await uploadImageAsynce(tempImageUri, true);
			// send image
			await sendImageMessage(
				id,
				currentUserData.userId,
				uploadUrl,
				replyingTo && replyingTo.key
			);
			setReplyingTo(null);

			setTimeout(() => {
				setTempImageUri("");
			}, 500);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	}, [isLoading, tempImageUri]);

	return (
		<View style={styles.container}>
			<ImageBackground
				source={backgroundImage}
				style={styles.backgroundImage}
			>
				<PageContainer style={{ backgroundColor: "transparent" }}>
					{!chatId && (
						<Bubble text="This is a new chat" type="system" />
					)}

					{errorBannerText !== "" && (
						<Bubble text={errorBannerText} type="error" />
					)}

					{chatId && (
						<FlatList
							ref={(ref) => (flatList.current = ref)}
							onContentSizeChange={() =>
								chatMessages.length > 0 &&
								flatList.current.scrollToEnd({
									animated: false,
								})
							}
							onLayout={() => chatMessages.length > 0 && flatList.current.scrollToEnd()}
							data={chatMessages}
							renderItem={(itemData) => {
								const message = itemData.item;
								const isOwnMessage =
									message.sentBy === currentUserData.userId;

								let messageType;
								if(message.type && message.type === "info"){
									messageType = "info";
								}else if( isOwnMessage){
									messageType = "myMessage";
								}else{
									messageType = "theirMessage";
								}
								
								const sender =
									message.sentBy &&
									storedUsers[message.sentBy];
								const name =
									sender &&
									`${sender.firstName} ${sender.lastName}`;
								return (
									<Bubble
										text={message.text}
										type={messageType}
										userId={currentUserData.userId}
										chatId={chatId}
										messageId={message.key}
										name={
											!chatData.isGroupChat ||
											isOwnMessage
												? undefined
												: name
										}
										date={message.sentAt}
										setReply={() => setReplyingTo(message)}
										imageUrl={message.imageUrl}
										replyingTo={
											message.replyTo &&
											chatMessages.find(
												(i) => i.key === message.replyTo
											)
										}
									/>
								);
							}}
						/>
					)}
				</PageContainer>
				{replyingTo && (
					<ReplyTo
						text={replyingTo.text}
						user={storedUsers[replyingTo.sentBy]}
						onCancel={() => setReplyingTo(null)}
					/>
				)}
			</ImageBackground>

			<View style={styles.inputContainer}>
				<TouchableOpacity
					onPress={pickImage}
					style={styles.mediaButton}
				>
					<Feather name="plus" size={24} color={colors.blue} />
				</TouchableOpacity>
				<TextInput
					style={styles.textBox}
					value={messageText}
					onChangeText={(text) => setMessageText(text)}
					onSubmitEditing={sendMessage}
				/>
				{messageText === "" && (
					<TouchableOpacity
						onPress={takePhotos}
						style={styles.mediaButton}
					>
						<Feather name="camera" size={24} color={colors.blue} />
					</TouchableOpacity>
				)}
				{messageText !== "" && (
					<TouchableOpacity
						onPress={sendMessage}
						style={{ ...styles.mediaButton, ...styles.sendButton }}
					>
						<Feather name="send" size={18} color="white" />
					</TouchableOpacity>
				)}

				<AwesomeAlert
					show={tempImageUri !== ""}
					title="Send Image?"
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showCancelButton={true}
					showConfirmButton={true}
					cancelText="Cancel"
					confirmText="Send Image"
					confirmButtonColor={colors.primary}
					cancelButtonColor={colors.red}
					titleStyle={styles.popupTitleStyle}
					onCancelPressed={() => setTempImageUri("")}
					onConfirmPressed={uploadImage}
					onDismiss={() => setTempImageUri("")}
					customView={
						<View>
							{isLoading && (
								<ActivityIndicator
									size={"small"}
									color={colors.primary}
								/>
							)}

							{!isLoading && tempImageUri !== "" && (
								<Image
									source={{ uri: tempImageUri }}
									style={{ width: 200, height: 200 }}
								/>
							)}
						</View>
					}
				/>
			</View>
		</View>
	);
};

export default ChatScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
	},
	backgroundImage: {
		flex: 1,
	},
	inputContainer: {
		flexDirection: "row",
		paddingHorizontal: 8,
		paddingVertical: 10,
		height: 50,
	},
	textBox: {
		flex: 1,
		borderWidth: 1,
		borderRadius: 50,
		borderColor: colors.lightgrey,
		marginHorizontal: 15,
		paddingHorizontal: 12,
	},
	mediaButton: {
		alignItems: "center",
		justifyContent: "center",
		width: 35,
	},
	sendButton: {
		backgroundColor: colors.blue,
		borderRadius: 50,
		paddingHorizontal: 8,
		width: 35,
	},
	popupTitleStyle: {
		fontFamily: "medium",
		letterSpacing: 0.3,
		color: colors.textColor,
	},
});
