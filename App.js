// imports from packeges online
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { registerRootComponent } from "expo";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useState, useEffect } from "react";
import * as Font from "expo-font";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// imports from my own files!
import ChatListScreen from "./screens/ChatListScreen";
import ChatSettingsScreen from "./screens/ChatSettingsScreen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// stack navigator
const Stack = createStackNavigator();

export default function App() {
  const [appIsLoaded, setAppIsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          black: require("./assets/fonts/Roboto-Black.ttf"),
        });
      } catch (error) {
        console.log.error();
      } finally {
        setAppIsLoaded(true);
      }
    };

    prepare();
  }, []);

  const onLayout = useCallback(async () => {
    if (appIsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsLoaded]);

  if (!appIsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayout}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={ChatListScreen}
          />
          <Stack.Screen
            name="ChatSettings"
            options={{headerTitle: "Settings"}}
            component={ChatSettingsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

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

registerRootComponent(App);
