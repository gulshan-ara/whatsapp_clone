import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { FontAwesome } from "@expo/vector-icons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import PageContainer from "../components/PageContainer";
import colors from "../constants/colors";
import { searchUsers } from "../utils/actions/userActions";
import DataItem from "../components/DataItem";
import { useDispatch, useSelector } from "react-redux";
import { setStoredUsers } from "../store/userSlice";
import ProfileImage from "../components/ProfileImage";

const NewChatScreen = ({ navigation, route }) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [users, setUsers] = useState();
	const [noResultsFound, setNoResultsFound] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [chatName, setChatName] = useState("");
	const [selectedUsers, setSelectedUsers] = useState([]);
	const selectedUsersFlatList = useRef();
	const currentUserData = useSelector((state) => state.auth.userData);
	const storedUsers = useSelector((state) => state.users.storedUsers);
	const isGroupChat = route.params && route.params.isGroupChat;
	const isGroupChatDisabled = selectedUsers.length === 0 || chatName === "";

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
			headerRight: () => {
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						{isGroupChat && (
							<Item
								title="create"
								disabled={isGroupChatDisabled}
								color={
									isGroupChatDisabled
										? colors.grey
										: undefined
								}
								onPress={() => {
									navigation.navigate("ChatList", {
										selectedUsers: selectedUsers,
										chatName: chatName
									});
								}}
							/>
						)}
					</HeaderButtons>
				);
			},
			headerTitle: isGroupChat ? "Add participants" : "New Chat",
		});
	}, [chatName, selectedUsers]);

	useEffect(() => {
		const delaySearch = setTimeout(async () => {
			if (!searchTerm || searchTerm === "") {
				setUsers();
				setNoResultsFound(false);
				return;
			}

			setIsLoading(true);

			const usersResult = await searchUsers(searchTerm);
			delete usersResult[currentUserData.userId];
			setUsers(usersResult);

			if (Object.keys(usersResult).length === 0) {
				setNoResultsFound(true);
			} else {
				setNoResultsFound(false);
				// storing users in state
				dispatch(setStoredUsers({ newUsers: usersResult }));
			}

			setIsLoading(false);
		}, 500);

		return () => clearTimeout(delaySearch);
	}, [searchTerm]);

	// navigate to selected users chat screen
	const userPressed = (userId) => {
		if (isGroupChat) {
			const newSelectedUsers = selectedUsers.includes(userId)
				? selectedUsers.filter((id) => id !== userId)
				: selectedUsers.concat(userId);

			setSelectedUsers(newSelectedUsers);
		} else {
			navigation.navigate("ChatList", {
				selectedUserId: userId,
			});
		}
	};

	return (
		<PageContainer>
			{isGroupChat && (
				<>
					<View style={styles.chatNameContainer}>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.textbox}
								placeholder="Enter a name for your chat"
								autoCorrect={false}
								value={chatName}
								onChangeText={(text) => setChatName(text)}
							/>
						</View>
					</View>

					<View style={styles.selectedUsersContainer}>
						<FlatList
							style={styles.selectedUsersList}
							contentContainerStyle={{ alignItems: "center" }}
							data={selectedUsers}
							horizontal={true}
							keyExtractor={(item) => item}
							ref={(ref) => (selectedUsersFlatList.current = ref)}
							onContentSizeChange={() =>
								selectedUsers.length > 0 &&
								selectedUsersFlatList.current.scrollToEnd()
							}
							renderItem={(itemData) => {
								const userId = itemData.item;
								const userData = storedUsers[userId];
								return (
									<ProfileImage
										size={40}
										style={styles.selectedUserStyle}
										uri={userData.profilePicture}
										onPress={() => userPressed(userId)}
										showRemoveButton={true}
									/>
								);
							}}
						/>
					</View>
				</>
			)}

			<View style={styles.searchContainer}>
				<FontAwesome name="search" size={15} color={colors.lightgrey} />
				<TextInput
					placeholder="Search"
					style={styles.searchBox}
					onChangeText={(text) => {
						setSearchTerm(text);
					}}
				/>
			</View>

			{isLoading && (
				<View style={styles.center}>
					<ActivityIndicator size={"large"} color={colors.primary} />
				</View>
			)}

			{!isLoading && !noResultsFound && users && (
				<FlatList
					data={Object.keys(users)}
					renderItem={(itemData) => {
						const userId = itemData.item;
						const userData = users[userId];
						return (
							<DataItem
								title={`${userData.firstName} ${userData.lastName}`}
								subTitle={`${userData.about}`}
								image={userData.profilePicture}
								onPress={() => userPressed(userId)}
								type={isGroupChat ? "checkbox" : ""}
								isChecked={selectedUsers.includes(userId)}
							/>
						);
					}}
				/>
			)}

			{!isLoading && noResultsFound && (
				<View style={styles.center}>
					<FontAwesome
						name="question"
						size={55}
						color={colors.lightgrey}
						style={{ marginBottom: 20 }}
					/>
					<Text style={styles.noResultsIcon}>No users found!</Text>
				</View>
			)}

			{!isLoading && !users && (
				<View style={styles.center}>
					<FontAwesome
						name="users"
						size={55}
						color={colors.lightgrey}
						style={{ marginBottom: 20 }}
					/>
					<Text style={styles.noResultsIcon}>
						Enter a name to search for an user!
					</Text>
				</View>
			)}
		</PageContainer>
	);
};

export default NewChatScreen;

const styles = StyleSheet.create({
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		color: colors.extraLightGrey,
		height: 30,
		marginVertical: 8,
		paddingVertical: 5,
		paddingHorizontal: 8,
		borderRadius: 5,
	},
	searchBox: {
		marginLeft: 8,
		fontSize: 15,
		width: "100%",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	noResultsIcon: {
		color: colors.textColor,
		fontFamily: "regular",
		letterSpacing: 0.3,
	},
	chatNameContainer: {
		paddingVertical: 10,
	},
	inputContainer: {
		width: "100%",
		paddingHorizontal: 10,
		paddingVertical: 15,
		backgroundColor: colors.nearlyWhite,
		flexDirection: "row",
		borderRadius: 2,
	},
	textbox: {
		fontFamily: "regular",
		color: colors.textColor,
		width: "100%",
		letterSpacing: 0.3,
	},
	selectedUsersContainer: {
		height: 50,
		justifyContent: "center",
	},
	selectedUsersList: {
		height: "100%",
	},
	selectedUserStyle: {
		marginRight: 10,
		marginBottom: 10,
	},
});
