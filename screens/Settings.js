import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import React, { useCallback, useReducer, useState } from "react";
import PageTitle from "../components/PageTitle";
import PageContainer from "../components/PageContainer";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import Input from "../components/Input";
import { useDispatch, useSelector } from "react-redux";
import colors from "../constants/colors";
import SubmitButton from "../components/SubmitButton";
import {
	updateSignedInUserDate,
	userLogOut,
} from "../utils/actions/authActions";
import { updateLoggedInUserData } from "../store/authSlice";
import ProfileImage from "../components/ProfileImage";

const Settings = () => {
	// dispatch variable for passing an action in logout button
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	// retrieve userData from redux auth state
	const userData = useSelector((state) => state.auth.userData);

	// variables
	const firstName = userData.firstName || "";
	const lastName = userData.lastName || "";
	const email = userData.email || "";
	const about = userData.about || "";

	// initial values of form
	const initialState = {
		inputValues: {
			firstName: firstName,
			lastName: lastName,
			email: email,
			about: about,
		},
		inputValidities: {
			firstName: undefined,
			lastName: undefined,
			email: undefined,
			about: undefined,
		},
		formIsValid: false,
	};

	// reducer hook for handling all form input states
	const [formState, dispatchFormState] = useReducer(reducer, initialState);

	const inputChangeHandler = useCallback(
		(inputId, inputValue) => {
			const result = validateInput(inputId, inputValue);
			dispatchFormState({
				inputId,
				validationResult: result,
				inputValue,
			});
		},
		[dispatchFormState]
	);

	// preventing unwanted re rendering
	const saveHandler = useCallback(async () => {
		const updatedValues = formState.inputValues;
		try {
			setIsLoading(true);
			// updating firebase db with the updated data
			await updateSignedInUserDate(userData.userId, updatedValues);
			// updating the states in redux with the updated data
			dispatch(updateLoggedInUserData({ newData: updatedValues }));
			setShowSuccessMessage(true);

			setTimeout(() => {
				setShowSuccessMessage(false);
			}, 3000);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [formState, dispatch]);

	// decides whether to show the save button or not
	const hasChanges = () => {
		const currentValues = formState.inputValues;

		return (
			currentValues.firstName != firstName ||
			currentValues.lastName != lastName ||
			currentValues.email != email ||
			currentValues.about != about
		);
	};

	return (
		<PageContainer>
			<PageTitle>Settings</PageTitle>
			<ScrollView contentContainerStyle={{ alignItems: "center" }}>
				<ProfileImage
					size={80}
					uri={userData.profilePicture}
					user_Id={userData.userId}
					showEditButton={true}
				/>
				<Input
					id="firstName"
					label="First name"
					icon="user-o"
					iconPack={FontAwesome}
					iconSize={24}
					autoCapitalize="none"
					onInputChanged={inputChangeHandler}
					errorText={formState.inputValidities["firstName"]}
					initialValue={userData.firstName}
				/>
				<Input
					id="lastName"
					label="Last name"
					icon="user-o"
					iconPack={FontAwesome}
					iconSize={24}
					autoCapitalize="none"
					onInputChanged={inputChangeHandler}
					errorText={formState.inputValidities["lastName"]}
					initialValue={userData.lastName}
				/>
				<Input
					id="email"
					label="Email"
					icon="mail"
					iconPack={Feather}
					iconSize={24}
					autoCapitalize="none"
					onInputChanged={inputChangeHandler}
					keyboardType="email-address"
					errorText={formState.inputValidities["email"]}
					initialValue={userData.email}
				/>
				<Input
					id="about"
					label="About"
					icon="user-o"
					iconPack={FontAwesome}
					iconSize={24}
					autoCapitalize="none"
					onInputChanged={inputChangeHandler}
					errorText={formState.inputValidities["about"]}
					initialValue={userData.about}
				/>
				<View style={{ marginTop: 20 }}>
					{showSuccessMessage && (
						<Text style={{ textAlign: "center" }}>Saved!!</Text>
					)}
					{isLoading ? (
						<ActivityIndicator
							size={"small"}
							color={colors.primary}
							style={{ marginTop: 10 }}
						/>
					) : (
						hasChanges() && (
							<SubmitButton
								title="Save"
								onPress={saveHandler}
								style={{ marginTop: 20 }}
								disabled={!formState.formIsValid}
							/>
						)
					)}
				</View>
				<SubmitButton
					title="LogOut"
					onPress={() => dispatch(userLogOut())}
					style={{ marginTop: 20 }}
					color={colors.red}
				/>
			</ScrollView>
		</PageContainer>
	);
};

export default Settings;

const styles = StyleSheet.create({});
