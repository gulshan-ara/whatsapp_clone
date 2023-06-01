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

const Bubble = ({ text, type }) => {
	const menuRef = useRef(null);
	const id = useRef(uuid.v4());

	const wrapperStyle = { ...styles.wrapperStyle };
	const bubbleStyle = { ...styles.container };
	const textStyle = { ...styles.text };
	let Container = View;

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
			break;

		case "theirMessage":
			wrapperStyle.justifyContent = "flex-start";
			bubbleStyle.maxWidth = "90%";
			Container = TouchableWithoutFeedback;
			break;

		default:
			break;
	}

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

					<Menu name={id.current} ref={menuRef}>
						<MenuTrigger />
						<MenuOptions>
							<MenuOption text="option 1" />
							<MenuOption text="option 2" />
							<MenuOption text="option 3" />
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
});
