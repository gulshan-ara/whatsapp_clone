import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import PageContainer from "../components/PageContainer";
import { useSelector } from "react-redux";
import DataItem from "../components/DataItem";

const DataListScreen = ({ navigation, route }) => {
	const { title, data, type, chatId } = route.params;

	const storedUsers = useSelector((state) => state.users.storedUsers);
	const loggedInUserData = useSelector((state) => state.auth.userData);

	useEffect(() => {
		navigation.setOptions({ headerTitle: title });
	}, [title]);

	return (
		<PageContainer>
			<FlatList
				data={data}
				keyExtractor={(item) => item}
				renderItem={(itemData) => {
					let key, onPress, image, title, subTitle, itemType;
					if (type === "users") {
						const uid = itemData.item;
						const currentUser = storedUsers[uid];

						if (!currentUser) return;

						const isLoggedInUser = uid === loggedInUserData.userId;

						key = uid;
						image = currentUser.profilePicture;
						title = `${currentUser.firstName} ${currentUser.lastName}`;
						subTitle = currentUser.about;
						itemType = isLoggedInUser ? undefined : "link";
						onPress = isLoggedInUser
							? undefined
							: () =>
									navigation.navigate("Contact", {
										uid,
										chatId,
									});
					}

					return (
						<DataItem
							key={key}
							onPress={onPress}
							image={image}
							title={title}
							subTitle={subTitle}
							type={itemType}
						/>
					);
				}}
			/>
		</PageContainer>
	);
};

export default DataListScreen;
