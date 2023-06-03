import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ReplyTo = ({ text, user, onCancel }) => {
	const name = `${user.firstName} ${user.lastName}`;
	return (
		<View style={styles.container}>
			<View style={styles.textContainer}>
				<Text numberOfLines={1} style={styles.name}>
					{name}
				</Text>
				<Text numberOfLines={1}>{text}</Text>
			</View>
		</View>
	);
};

export default ReplyTo;

const styles = StyleSheet.create({});
