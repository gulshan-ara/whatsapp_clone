import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import { ImageBackground } from "react-native";
import { Feather } from "@expo/vector-icons";
import backgroundImage from "../assets/images/droplet.jpeg";
import colors from "../constants/colors";

const ChatScreen = () => {
	const [messageText, setMessageText] = useState("");

	// This function will render only when messageText is changed
	const sendMessage = useCallback(() => {
		setMessageText("");
	}, [messageText]);

	return (
		<View style={styles.container}>
			<ImageBackground
				source={backgroundImage}
				style={styles.backgroundImage}
			></ImageBackground>
			<View style={styles.inputContainer}>
				<TouchableOpacity
					onPress={() => console.log("Pressed!")}
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
						onPress={() => console.log("Pressed!")}
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
});
