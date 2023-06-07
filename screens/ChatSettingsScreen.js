import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import DataItem from "../components/DataItem";
import ProfileImage from "../components/ProfileImage";
import Input from "../components/Input";
import { reducer } from "../utils/reducers/formReducer";
import {
	removeUserFromChat,
	updateChatData,
} from "../utils/actions/chatActions";
import colors from "../constants/colors";
import SubmitButton from "../components/SubmitButton";
import { validateInput } from "../utils/actions/formActions";

const ChatSettingsScreen = ({ route, navigation }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const chatId = route.params.chatId;
	const chatData =
		useSelector((state) => state.chats.chatsData[chatId]) || {};
	const userData = useSelector((state) => state.auth.userData);
	const storedUsers = useSelector((state) => state.users.storedUsers);

	// initial values of form
	const initialState = {
		inputValues: {
			chatName: chatData.chatName,
		},
		inputValidities: {
			chatName: undefined,
		},
		formIsValid: false,
	};

	// reducer hook for handling all form input states
	const [formState, dispatchFormState] = useReducer(reducer, initialState);

	// adding new member in group chat
	const selectedUsers = route.params && route.params.selectedUsers;
	// adding new member in group chat
	useEffect(() => {
		if (!selectedUsers) return;

		const selectedUsersData = [];
		selectedUsers.forEach((uid) => {
			if (uid === userData.uid) return;

			if (!storedUsers[uid]) {
				console.log("No user data found in the data store.");
				return;
			}

			selectedUsersData.push(storedUsers[uid]);
		});
	}, [selectedUsers]);

	const inputChangeHandler = useCallback(
		(inputId, inputValue) => {
			const result = validateInput(inputId, inputValue);
			dispatchFormState({
				inputId,
				validationResult: result,
				inputValue,
			});
		},
		[dispatchFormState]
	);

	// preventing unwanted re rendering
	const saveHandler = useCallback(async () => {
		const updatedValues = formState.inputValues;
		try {
			setIsLoading(true);
			await updateChatData(chatId, userData.userId, updatedValues);
			setShowSuccessMessage(true);

			setTimeout(() => {
				setShowSuccessMessage(false);
			}, 3000);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [formState]);

	// decides whether to show the save button or not
	const hasChanges = () => {
		const currentValues = formState.inputValues;

		return currentValues.chatName != chatData.chatName;
	};

	const leaveChat = useCallback(async () => {
		try {
			setIsLoading(true);
			// remove user
			await removeUserFromChat(userData, userData, chatData);
			navigation.popToTop();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [navigation, isLoading]);

	if (!chatData.users) return null;

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
				<Input
					id="chatName"
					label="Chat Name"
					autoCapitalize="none"
					initialValue={chatData.chatName}
					allowEmpty={false}
					onInputChanged={inputChangeHandler}
					errorText={formState.inputValidities["chatName"]}
				/>

				<View style={styles.sectionContainer}>
					<Text style={styles.heading}>
						{chatData.users.length} participents
					</Text>

					<DataItem
						title="Add users"
						icon="plus"
						type="button"
						onPress={() => {
							navigation.navigate("NewChat", {
								isGroupChat: true,
								existingUsers: chatData.users,
								chatId: chatId,
							});
						}}
					/>

					{chatData.users.slice(0, 4).map((uid) => {
						const chatUser = storedUsers[uid];
						return (
							<DataItem
								key={uid}
								image={chatUser.profilePicture}
								title={`${chatUser.firstName} ${chatUser.lastName}`}
								subTitle={chatUser.about}
								type={uid !== userData.userId && "link"}
								onPress={() => {
									uid !== userData.userId &&
										navigation.navigate("Contact", {
											uid,
											chatId,
										});
								}}
							/>
						);
					})}

					{chatData.users.length > 4 && (
						<DataItem
							type={"link"}
							title="View All"
							hideImage={true}
							onPress={() =>
								navigation.navigate("DataList", {
									title: "Participents",
									data: chatData.users,
									type: "users",
									chatId: chatId,
								})
							}
						/>
					)}
				</View>

				{showSuccessMessage && <Text>Saved!!</Text>}

				{isLoading ? (
					<ActivityIndicator size={"small"} color={colors.primary} />
				) : (
					hasChanges() && (
						<SubmitButton
							title="Save Changes"
							color={colors.primary}
							onPress={saveHandler}
							disabled={!formState.formIsValid}
						/>
					)
				)}
			</ScrollView>

			{
				<SubmitButton
					title="Leave chat"
					color={colors.red}
					style={{ marginBottom: 30 }}
					onPress={leaveChat}
				/>
			}
		</PageContainer>
	);
};

export default ChatSettingsScreen;

const styles = StyleSheet.create({
	scrollView: {
		justifyContent: "center",
		alignItems: "center",
	},
	sectionContainer: {
		width: "100%",
		marginTop: 10,
	},
	heading: {
		marginVertical: 8,
		color: colors.textColor,
		fontFamily: "bold",
		letterSpacing: 0.3,
	},
});
