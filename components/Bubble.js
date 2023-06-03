import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useRef } from "react";
import colors from "../constants/colors";
import uuid from "react-native-uuid";
import {
	Menu,
	MenuOption,
	MenuOptions,
	MenuTrigger,
} from "react-native-popup-menu";
import * as Clipboard from "expo-clipboard";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { starMessage } from "../utils/actions/chatActions";
import { useSelector } from "react-redux";

const formatAmPm = (dateString) => {
	const date = new Date(dateString);
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	return hours + " : " + minutes + " " + ampm;
};

const MenuItem = (props) => {
	const Icon = props.iconPack ?? Feather;

	return (
		<MenuOption onSelect={props.onSelect}>
			<View style={styles.menuItemContainer}>
				<Text style={styles.menuText}>{props.text}</Text>
				<Icon name={props.icon} size={18} />
			</View>
		</MenuOption>
	);
};

const Bubble = ({ text, type, userId, chatId, messageId, date, setReply }) => {
	const starredMessages = useSelector(
		(state) => state.messages.starredMessages[chatId] ?? {}
	);
	const menuRef = useRef(null);
	const id = useRef(uuid.v4());
	let isUserMessage = false;

	const wrapperStyle = { ...styles.wrapperStyle };
	const bubbleStyle = { ...styles.container };
	const textStyle = { ...styles.text };
	let Container = View;
	const dateString = formatAmPm(date);

	switch (type) {
		case "system":
			textStyle.color = "#65644A";
			bubbleStyle.backgroundColor = colors.beige;
			bubbleStyle.alignItems = "center";
			bubbleStyle.marginTop = 10;
			break;

		case "error":
			textStyle.color = "white";
			bubbleStyle.backgroundColor = colors.red;
			bubbleStyle.marginTop = 10;
			break;

		case "myMessage":
			wrapperStyle.justifyContent = "flex-end";
			bubbleStyle.backgroundColor = "#E7FED4";
			bubbleStyle.maxWidth = "90%";
			Container = TouchableWithoutFeedback;
			isUserMessage = true;
			break;

		case "theirMessage":
			wrapperStyle.justifyContent = "flex-start";
			bubbleStyle.maxWidth = "90%";
			Container = TouchableWithoutFeedback;
			isUserMessage = true;
			break;

		default:
			break;
	}

	const copyToClipBoard = async (text) => {
		await Clipboard.setStringAsync(text);
	};

	const isStarred = isUserMessage && starredMessages[messageId] !== undefined;

	return (
		<View style={wrapperStyle}>
			<Container
				onLongPress={() => {
					console.log(
						menuRef.current.props.ctx.menuActions.openMenu(
							id.current
						)
					);
				}}
				style={{ width: "100%" }}
			>
				<View style={bubbleStyle}>
					<Text style={textStyle}>{text}</Text>
					{dateString && (
						<View style={styles.timeContainer}>
							<Text style={styles.time}>{dateString}</Text>
							{isStarred && (
								<FontAwesome
									name="star"
									size={14}
									color={colors.textColor}
									style={{ marginLeft: 5 }}
								/>
							)}
						</View>
					)}

					<Menu name={id.current} ref={menuRef}>
						<MenuTrigger />
						<MenuOptions>
							<MenuItem
								text="Copy to Clipboard"
								icon="copy"
								onSelect={() => {
									copyToClipBoard(text);
								}}
							/>
							<MenuItem
								text={`${
									isStarred ? "Unstar" : "Star"
								} Message`}
								icon={isStarred ? "star" : "star-o"}
								iconPack={FontAwesome}
								onSelect={() => {
									starMessage(messageId, chatId, userId);
								}}
							/>
							<MenuItem
								text="Reply"
								icon="arrow-left-circle"
								onSelect={setReply}
							/>
						</MenuOptions>
					</Menu>
				</View>
			</Container>
		</View>
	);
};

export default Bubble;

const styles = StyleSheet.create({
	wrapperStyle: {
		flexDirection: "row",
		justifyContent: "center",
	},
	text: {
		letterSpacing: 0.3,
		fontFamily: "regular",
	},
	container: {
		backgroundColor: "white",
		borderRadius: 6,
		padding: 5,
		marginBottom: 10,
		borderColor: "#E2DACC",
		borderWidth: 1,
	},
	menuItemContainer: {
		flexDirection: "row",
		padding: 5,
	},
	menuText: {
		fontFamily: "regular",
		letterSpacing: 0.3,
		flex: 1,
		fontSize: 16,
	},
	timeContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	time: {
		fontSize: 12,
		fontFamily: "regular",
		letterSpacing: 0.3,
		color: colors.grey,
	},
});
