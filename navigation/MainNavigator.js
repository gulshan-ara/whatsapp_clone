import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// imports from my own file
import ChatListScreen from "../screens/ChatListScreen";
import Settings from "../screens/Settings";
import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import ChatScreen from "../screens/ChatScreen";

// stack navigator
const Stack = createStackNavigator();
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
              <Ionicons name="chatbubble-outline" size={24} color="black" />
            );
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: () => {
            return <Ionicons name="settings-outline" size={24} color="black" />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }}
        component={TabNavigator}
      />
      {/* <Stack.Screen
          name="ChatSettings"
          options={{ headerTitle: "Settings" }}
          component={ChatSettingsScreen}
        /> */}
      <Stack.Screen
        name="ChatScreen"
        options={{ headerTitle: "ChatScreen" }}
        component={ChatScreen}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
