import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// imports from my own file
import ChatListScreen from "../screens/ChatListScreen";
import Settings from "../screens/Settings";
import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import ChatScreen from "../screens/ChatScreen";
import NewChatScreen from "../screens/NewChatScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { getFirebaseApp } from "../utils/firebaseHelper";
import { child, get, getDatabase, off, onValue, ref } from "firebase/database";
import { setChatsData } from "../store/chatSlice";
import colors from "../constants/colors";
import { setStoredUsers } from "../store/userSlice";
import { setChatMessages, setStarredMessage } from "../store/messagesSlice";
import ContactScreen from "../screens/ContactScreen";
import DataListScreen from "../screens/DataListScreen";
import { StackActions, useNavigation } from "@react-navigation/native";

// stack navigator
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
	return (
		<Tab.Navigator
			screenOptions={{ headerTitle: "", headerShadowVisible: false }}
		>
			<Tab.Screen
				name="ChatList"
				component={ChatListScreen}
				options={{
					tabBarIcon: () => {
						return (
							<Ionicons
								name="chatbubble-outline"
								size={24}
								color="black"
							/>
						);
					},
				}}
			/>
			<Tab.Screen
				name="Settings"
				component={Settings}
				options={{
					tabBarIcon: () => {
						return (
							<Ionicons
								name="settings-outline"
								size={24}
								color="black"
							/>
						);
					},
				}}
			/>
		</Tab.Navigator>
	);
};

const StackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Group>
				<Stack.Screen
					name="Home"
					options={{ headerShown: false }}
					component={TabNavigator}
				/>
				<Stack.Screen
					name="ChatSettings"
					options={{ headerTitle: "", headerShadowVisible: false }}
					component={ChatSettingsScreen}
				/>
				<Stack.Screen
					name="ChatScreen"
					options={{ headerTitle: "ChatScreen" }}
					component={ChatScreen}
				/>
				<Stack.Screen
					name="Contact"
					options={{ headerTitle: "Contact Info" }}
					component={ContactScreen}
				/>
				<Stack.Screen
					name="DataList"
					options={{ headerTitle: "" }}
					component={DataListScreen}
				/>
			</Stack.Group>

			<Stack.Group screenOptions={{ presentation: "containedModal" }}>
				<Stack.Screen name="NewChat" component={NewChatScreen} />
			</Stack.Group>
		</Stack.Navigator>
	);
};

const MainNavigator = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [isLoading, setIsLoading] = useState(true);
	const currentUserData = useSelector((state) => state.auth.userData);
	const storedUsers = useSelector((state) => state.users.storedUsers);

	// push notification configuration
	const [expoPushToken, setExpoPushToken] = useState("");
	// console.log(expoPushToken);
	const notificationListener = useRef();
	const responseListener = useRef();

	// use effect fo expo push notifications
	useEffect(() => {
		registerForPushNotificationsAsync().then((token) =>
			setExpoPushToken(token)
		);

		notificationListener.current = Notifications.addNotificationReceivedListener(
			(notification) => {
				// handle recieved notification
			}
		);

		responseListener.current = Notifications.addNotificationResponseReceivedListener(
			(response) => {
				const { data } = response.notification.request.content;
				const chatId = data["chatId"];
				console.log(chatId);

				if (chatId) {
					const pushActions = StackActions.push("ChatScreen", {
						chatId,
					});
					navigation.dispatch(pushActions);
				} else {
					console.log("No chat Id sent with notification!");
				}
			}
		);

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current
			);
			Notifications.removeNotificationSubscription(
				responseListener.current
			);
		};
	}, []);

	useEffect(() => {
		console.log("Subscribing to firebase listeners");
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const userChatsRef = child(
			dbRef,
			`userChats/${currentUserData.userId}`
		);
		const refs = [userChatsRef];

		// whenever userChatsRef changes, the onValue function will run
		onValue(userChatsRef, (querySnapshot) => {
			const chatIdData = querySnapshot.val() || {};
			const chatIds = Object.values(chatIdData);

			// retrieving existing chat data
			const chatsData = {};
			let chatsFoundCount = 0;

			// looping over all chatId
			for (let i = 0; i < chatIds.length; i++) {
				const chatId = chatIds[i];
				// retreiving data for a chat id
				const chatRef = child(dbRef, `chats/${chatId}`);
				refs.push(chatRef);

				// when chatRef changes
				onValue(chatRef, (chatSnapshot) => {
					chatsFoundCount++;
					// storing chat data
					const data = chatSnapshot.val();

					// if there's a chat data then storing it into an object
					if (data) {
						if (!data.users.includes(currentUserData.userId)) {
							return;
						}

						data.key = chatSnapshot.key;

						// get the name of user from the key
						data.users.forEach((userId) => {
							if (storedUsers[userId]) return;

							const userRef = child(dbRef, `user/${userId}`);

							get(userRef).then((userSnapshot) => {
								const userSnapshotData = userSnapshot.val();
								dispatch(
									setStoredUsers({
										newUsers: { userSnapshotData },
									})
								);
							});

							refs.push(userRef);
						});

						chatsData[chatSnapshot.key] = data;
					}

					// after all chat data is retrieved, passing the object into redux state
					if (chatsFoundCount >= chatIds.length) {
						dispatch(setChatsData({ chatsData }));
						setIsLoading(false);
					}
				});

				// retrieving messages from database & storing that in redux state
				const messagesRef = child(dbRef, `messages/${chatId}`);
				refs.push(messagesRef);

				// when messagesRef changes
				onValue(messagesRef, (messagesSnapshot) => {
					const messagesData = messagesSnapshot.val();
					// console.log(messageData);
					dispatch(
						setChatMessages({
							chatId: chatId,
							messagesData: messagesData,
						})
					);
				});

				if (chatsFoundCount === 0) {
					setIsLoading(false);
				}
			}
		});

		const userStarredMessagesRef = child(
			dbRef,
			`userStarredMessages/${currentUserData.userId}`
		);
		refs.push(userStarredMessagesRef);
		onValue(userStarredMessagesRef, (querySnapshot) => {
			const starredMessages = querySnapshot.val() ?? {};
			dispatch(setStarredMessage({ starredMessages }));
		});

		// closing db calls
		return () => {
			console.log("Unsubscribing from firebase listeners");
			refs.forEach((ref) => off(ref));
		};
	}, []);

	// onLoading view
	if (isLoading) {
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
			<ActivityIndicator size={"large"} color={colors.primary} />
		</View>;
	}

	return <StackNavigator />;
};

export default MainNavigator;

async function registerForPushNotificationsAsync() {
	let token;

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	if (Device.isDevice) {
		const {
			status: existingStatus,
		} = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			alert("Failed to get push token for push notification!");
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
		console.log(token);
	} else {
		alert("Must use physical device for Push Notifications");
	}

	return token;
}
