import {
	child,
	get,
	getDatabase,
	push,
	ref,
	remove,
	set,
	update,
} from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";

export const createChat = async (loggedInUserId, chatData) => {
	const newChatData = {
		...chatData,
		createdBy: loggedInUserId,
		updatedBy: loggedInUserId,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	const app = getFirebaseApp();
	const dbRef = ref(getDatabase(app));
	const newChat = await push(child(dbRef, "chats"), newChatData);

	const chatUsers = newChatData.users;
	for (let i = 0; i < chatUsers.length; i++) {
		const userId = chatUsers[i];
		await push(child(dbRef, `userChats/${userId}`), newChat.key);
	}

	return newChat.key;
};

export const sendTextMessage = async (
	chatId,
	senderId,
	messageText,
	replyTo
) => {
	await sendMessage(chatId, senderId, messageText, null, replyTo);
};

export const sendImageMessage = async (
	chatId,
	senderId,
	imageUrl,
	replyTo
) => {
	await sendMessage(chatId, senderId, "Image", imageUrl, replyTo);
};

const sendMessage = async (
	chatId,
	senderId,
	messageText,
	imageUrl,
	replyTo
) => {
	const app = getFirebaseApp();
	const dbRef = ref(getDatabase(app));
	const messageRef = child(dbRef, `messages/${chatId}`);

	const messageData = {
		sentBy: senderId,
		sentAt: new Date().toISOString(),
		text: messageText,
	};

	if (replyTo) {
		messageData.replyTo = replyTo;
	}

	if (imageUrl) {
		messageData.imageUrl = imageUrl;
	}

	// send message to db under 'messages' node
	await push(messageRef, messageData);

	const chatRef = child(dbRef, `chats/${chatId}`);

	// update the chat node
	await update(chatRef, {
		updatedBy: senderId,
		updatedAt: new Date().toISOString(),
		latestMessage: messageText,
	});
};

// starring a message
export const starMessage = async (messageId, chatId, userId) => {
	try {
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const childRef = child(
			dbRef,
			`userStarredMessages/${userId}/${chatId}/${messageId}`
		);

		const snapShot = await get(childRef);

		if (snapShot.exists()) {
			console.log("Unstarring!");

			await remove(childRef);
		} else {
			console.log("Starring");

			const starMessageData = {
				messageId,
				chatId,
				starredAt: new Date().toISOString(),
			};

			await set(childRef, starMessageData);
		}
	} catch (error) {
		console.log(error);
	}
};
