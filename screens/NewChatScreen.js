import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { FontAwesome } from "@expo/vector-icons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import PageContainer from "../components/PageContainer";
import colors from "../constants/colors";

const NewChatScreen = ({ navigation }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [users, setUsers] = useState();
	const [noResultsFound, setNoResultsFound] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => {
				return (
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item
							title="close"
							onPress={() => navigation.goBack()}
						/>
					</HeaderButtons>
				);
			},
			headerTitle: "New Chat",
		});
	}, []);

	useEffect(() => {
		const delaySearch = setTimeout(() => {
			if (!searchTerm || searchTerm === "") {
				setUsers();
				setNoResultsFound(false);
				return;
			}

			setIsLoading(true);
			setUsers({});
			setNoResultsFound(true);
			setIsLoading(false);

		}, 500);

		return () => clearTimeout(delaySearch);
	}, [searchTerm]);

	return (
		<PageContainer>
			<View style={styles.searchContainer}>
				<FontAwesome name="search" size={15} color={colors.lightgrey} />
				<TextInput
					placeholder="Search"
					style={styles.searchBox}
					onChangeText={(text) => {
						setSearchTerm(text);
					}}
				/>
			</View>

			{!isLoading && noResultsFound && (
				<View style={styles.center}>
					<FontAwesome
						name="question"
						size={55}
						color={colors.lightgrey}
						style={{ marginBottom: 20 }}
					/>
					<Text style={styles.noResultsIcon}>No users found!</Text>
				</View>
			)}

			{!isLoading && !users && (
				<View style={styles.center}>
					<FontAwesome
						name="users"
						size={55}
						color={colors.lightgrey}
						style={{ marginBottom: 20 }}
					/>
					<Text style={styles.noResultsIcon}>
						Enter a name to search for an user!
					</Text>
				</View>
			)}
		</PageContainer>
	);
};

export default NewChatScreen;

const styles = StyleSheet.create({
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		color: colors.extraLightGrey,
		height: 30,
		marginVertical: 8,
		paddingVertical: 5,
		paddingHorizontal: 8,
		borderRadius: 5,
	},
	searchBox: {
		marginLeft: 8,
		fontSize: 15,
		width: "100%",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	noResultsIcon: {
		color: colors.textColor,
		fontFamily: "regular",
		letterSpacing: 0.3,
	},
});
