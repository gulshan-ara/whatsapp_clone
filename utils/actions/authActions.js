import { getFirebaseApp } from "../firebaseHelper";
import {
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { authenticate, logOut } from "../../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData } from "./userActions";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

let timer;

export const signUp = (firstName, lastName, email, password) => {
	return async (dispatch) => {
		const app = getFirebaseApp();
		const auth = getAuth();

		try {
			// creating an user in firebase.
			const result = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			// firebase returns an user_id & stsTokenManager
			const { uid, stsTokenManager } = result.user;

			// retrieving the token & it's expiration time from stsTokenManager got from firebase
			const { accessToken, expirationTime } = stsTokenManager;

			const expiryDate = new Date(expirationTime);
			const timeNow = new Date();
			const miliSecondsUntilExpiry = expiryDate - timeNow;

			const userData = await createUser(firstName, lastName, email, uid);

			// dispatching the token & user data because authenticate action receives these two as state.
			dispatch(authenticate({ token: accessToken, userData }));

			//storing user sign in data to device via async storage
			saveDataToStorage(accessToken, uid, expiryDate);

			// pushing device push tokens in user database
			await storePushToken(userData);

			timer = setTimeout(() => {
				dispatch(userLogOut(userData));
			}, miliSecondsUntilExpiry);
		} catch (error) {
			console.log(error.message);
			const errorCode = error.code;

			let message = "Something went wrong";

			if (errorCode === "auth/email-already-in-use") {
				message = "This email is already in use";
			}

			throw new Error(message);
		}
	};
};

const createUser = async (firstName, lastName, email, userId) => {
	const firstLast = `${firstName} ${lastName}`;

	const userData = {
		firstName: firstName,
		lastName: lastName,
		firstLast: firstLast.toLowerCase(),
		email: email,
		userId: userId,
		signUpDate: new Date().toISOString(),
	};

	const dbRef = ref(getDatabase());
	const childRef = child(dbRef, `user/${userId}`);
	await set(childRef, userData);

	return userData;
};

const saveDataToStorage = (token, userId, expiryDate) => {
	AsyncStorage.setItem(
		"userData",
		JSON.stringify({
			token,
			userId,
			expiryDate: expiryDate.toISOString(),
		})
	);
};

export const signIn = (email, password) => {
	return async (dispatch) => {
		const app = getFirebaseApp();
		const auth = getAuth();

		try {
			const result = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const { uid, stsTokenManager } = result.user;
			const { accessToken, expirationTime } = stsTokenManager;

			const expiryDate = new Date(expirationTime);

			const timeNow = new Date();
			const miliSecondsUntilExpiry = expiryDate - timeNow;

			const userData = await getUserData(uid);

			// redux toolkit code
			dispatch(authenticate({ token: accessToken, userData }));

			//storing user sign in data to device via async storage
			saveDataToStorage(accessToken, uid, expiryDate);

			// pushing device push tokens in user database
			await storePushToken(userData);

			timer = setTimeout(() => {
				dispatch(userLogOut(userData));
			}, miliSecondsUntilExpiry);
		} catch (error) {
			console.log(error.message);
			const errorCode = error.code;

			let message = "Something went wrong";

			if (
				errorCode === "auth/wrong-password" ||
				errorCode === "auth/user-not-found"
			) {
				message = "The username or password is incorrect";
			}

			throw new Error(message);
		}
	};
};

export const userLogOut = (userData) => {
	return async (dispatch) => {
		try {
			await removePushToken(userData);
		} catch (error) {
			console.log(error);
		}
		AsyncStorage.clear();
		clearTimeout(timer);
		dispatch(logOut());
	};
};

export const updateSignedInUserDate = async (userId, newData) => {
	if (newData.firstName && newData.lastName) {
		const firstLast = `${newData.firstName} ${newData.lastName}`;
		newData.firstLast = firstLast.toLowerCase();
	}
	const dbRef = ref(getDatabase());
	const childRef = child(dbRef, `user/${userId}`);
	await update(childRef, newData);
};

const storePushToken = async (userData) => {
	if (!Device.isDevice) {
		return;
	}

	// current token for current device
	const token = (await Notifications.getExpoPushTokenAsync()).data;

	const tokenData = { ...userData.pushTokens } || {};
	const tokenArray = Object.values(tokenData);

	// don't store token if it already exists
	if (tokenArray.includes(token)) {
		return;
	}

	// store new tokens
	tokenArray.push(token);

	for (let i = 0; i < tokenArray.length; i++) {
		const tok = tokenArray[i];
		tokenData[i] = tok;
	}

	const app = getFirebaseApp();
	const dbRef = ref(getDatabase(app));
	const userRef = child(dbRef, `user/${userData.userId}/pushTokens`);

	await set(userRef, tokenData);
};

const removePushToken = async (userData) => {
	if (!Device.isDevice) {
		return;
	}

	// current token for current device
	const token = (await Notifications.getExpoPushTokenAsync()).data;

	const tokenData = await getUserPushTokens(userData.userId);

	for (const key in tokenData) {
		if (tokenData[key] === token) {
			delete tokenData[key];
			break;
		}
	}

	const app = getFirebaseApp();
	const dbRef = ref(getDatabase(app));
	const userRef = child(dbRef, `user/${userData.userId}/pushTokens`);

	await set(userRef, tokenData || {});
};

export const getUserPushTokens = async (userId) => {
	try {
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const userRef = child(dbRef, `user/${userId}/pushTokens`);

		const snapshot = get(userRef);

		if (!snapshot || !snapshot.exists()) {
			return {};
		}

		return snapshot.val() || {};
	} catch (error) {
		console.log(error);
	}
};
