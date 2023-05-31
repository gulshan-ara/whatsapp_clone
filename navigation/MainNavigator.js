import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// imports from my own file
import ChatListScreen from "../screens/ChatListScreen";
import Settings from "../screens/Settings";
import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import ChatScreen from "../screens/ChatScreen";
import NewChatScreen from "../screens/NewChatScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { getFirebaseApp } from "../utils/firebaseHelper";
import { child, getDatabase, off, onValue, ref } from "firebase/database";

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
					options={{ headerTitle: "Settings" }}
					component={ChatSettingsScreen}
				/>
				<Stack.Screen
					name="ChatScreen"
					options={{ headerTitle: "ChatScreen" }}
					component={ChatScreen}
				/>
			</Stack.Group>

			<Stack.Group screenOptions={{ presentation: "containedModal" }}>
				<Stack.Screen name="NewChat" component={NewChatScreen} />
			</Stack.Group>
		</Stack.Navigator>
	);
};

const MainNavigator = () => {
	const signedInUserData = useSelector((state) => state.auth.userData);
	const storedUsers = useSelector((state) => state.users.storedUsers);

  useEffect(() => {
    console.log("Subscribing to firebase listeners");
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userChatsRef = child(dbRef, `userChats/${signedInUserData.userId}`);
    const refs = [userChatsRef];

    // whenever userChatsRef changes, the onValue function will run
    onValue(userChatsRef, (querySnapshot) => {
      const chatIdData = querySnapshot.val() || {};
      const chatIds = Object.values(chatIdData);

      console.log(chatIds);
    });

    return () => {
      console.log("Unsubscribing from firebase listeners");
      refs.forEach(ref => off(ref));
    }
  }, []);

	return <StackNavigator />;
};

export default MainNavigator;
