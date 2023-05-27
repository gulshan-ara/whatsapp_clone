import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PageContainer from "../components/PageContainer";
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";
import { TouchableOpacity } from "react-native";
import colors from "../constants/colors";
import logo from "../assets/images/logo.png";

const AuthScreen = () => {
	const [isSignedUp, setIsSignedUp] = useState(false);
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<PageContainer>
				<ScrollView>
					<View style={styles.imageContainer}>
						<Image
							source={logo}
							style={styles.image}
							resizeMode="contain"
						/>
					</View>
					{isSignedUp ? <SignInForm /> : <SignUpForm />}
					<TouchableOpacity
						style={styles.linkContainer}
						onPress={() => setIsSignedUp(!isSignedUp)}
					>
						<Text style={styles.link}>{`Switch to ${
							isSignedUp ? "Sign Up" : "Sign In"
						}`}</Text>
					</TouchableOpacity>
				</ScrollView>
			</PageContainer>
		</SafeAreaView>
	);
};

export default AuthScreen;

const styles = StyleSheet.create({
	linkContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 15,
	},
	link: {
		color: colors.blue,
		fontFamily: "medium",
		letterSpacing: 0.3,
	},
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: "50%",
	},
});
