import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import ProfileImage from "../components/ProfileImage";
import PageTitle from "../components/PageTitle";
import colors from "../constants/colors";

const ContactScreen = ({ route }) => {
	const storedUsers = useSelector((state) => state.users.storedUsers);
	const currentUser = storedUsers[route.params.uid];

	return (
		<PageContainer>
			<View style={styles.topContainer}>
				<ProfileImage
					uri={currentUser.profilePicture}
					size={80}
					style={{ marginBottom: 20 }}
				/>
        <PageTitle>{currentUser.firstName} {currentUser.lastName}</PageTitle>
        {
          currentUser.about && (
            <Text numberOfLines={2} style={styles.about}>{currentUser.about}</Text>
          )
        }
			</View>
		</PageContainer>
	);
};

export default ContactScreen;

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  about: {
    fontFamily: 'medium',
    letterSpacing: 0.3,
    fontSize: 16,
    color: colors.grey,
  }
});
