import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { getFirebaseApp } from "./firebaseHelper";
import uuid from "react-native-uuid";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";

export const launchImagePicker = async () => {
	await checkMediaPermissions();

	const result = await ImagePicker.launchImageLibraryAsync({
		// allows only images to pick
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		// allows to crop the image
		allowsEditing: true,
		// aspect ratio
		aspect: [1, 1], // square image
		quality: 1,
	});

	if (!result.canceled) {
		return result.uri;
	}
};

export const openCamera = async () => {

	const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

	if(permissionResult.granted === false){
		console.log("No permission to access the camera");
		return;
	}

	const result = await ImagePicker.launchCameraAsync({
		// allows only images to pick
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		// allows to crop the image
		allowsEditing: true,
		// aspect ratio
		aspect: [1, 1], // square image
		quality: 1,
	});

	if (!result.canceled) {
		return result.uri;
	}
};

// converting the locally uploaded image into a blob (binary large object)
export const uploadImageAsynce = async (uri, isChatImage = false) => {
	const app = getFirebaseApp();

	const blob = await new Promise((resolve, reject) => {
		// creating a request
		const xhr = new XMLHttpRequest();
		// sending response on load
		xhr.onload = function () {
			resolve(xhr.response);
		};

		// error catching block
		xhr.onerror = function (e) {
			console.log(e);
			reject(new TypeError("Network request failed"));
		};

		xhr.responseType = "blob";
		xhr.open("GET", uri, true);
		xhr.send();
	});

	const pathFolder = isChatImage ? "chatImages" : "profilePics";
	const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`);

	await uploadBytesResumable(storageRef, blob);

	blob.close();

	return await getDownloadURL(storageRef);
};

const checkMediaPermissions = async () => {
	if (Platform.OS !== "web") {
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			return Promise.reject("We need permission to access your photos");
		}
	}

	return Promise.resolve();
};
