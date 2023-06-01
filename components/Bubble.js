import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../constants/colors";

const Bubble = ({ text, type }) => {

    const bubbleStyle = {...styles.container};
    const textStyle = {...styles.text}; 

    switch (type) {
        case "system":
            textStyle.color = "#65644A";
            bubbleStyle.backgroundColor = colors.beige;
            bubbleStyle.alignItems = "center";
            bubbleStyle.marginTop = 10
            break;
        case "error":
            textStyle.color = "white";
            bubbleStyle.backgroundColor = colors.red;
            bubbleStyle.marginTop = 10
        default:
            break;
    }
    
	return (
		<View style={styles.wrapperStyle}>
			<View style={bubbleStyle}>
				<Text style={textStyle}>{text}</Text>
			</View>
		</View>
	);
};

export default Bubble;

const styles = StyleSheet.create({
    wrapperStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    text: {
        letterSpacing: 0.3,
        fontFamily: 'regular'
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 5,
        marginBottom: 10,
        borderColor: "#E2DACC",
        borderWidth: 1,
    }
});
