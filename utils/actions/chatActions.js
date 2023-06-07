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
import { deleteUserChat, getUserChats } from "./userActions";

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
	await sendMessage(chatId, senderId, messageText, null, replyTo, null);
};

export const sendInfoMessage = async (
	chatId,
	senderId,
	messageText
) => {
	await sendMessage(chatId, senderId, messageText, null, null, "info");
};

export const sendImageMessage = async (chatId, senderId, imageUrl, replyTo) => {
	await sendMessage(chatId, senderId, "Image", imageUrl, replyTo, null);
};

const sendMessage = async (
	chatId,
	senderId,
	messageText,
	imageUrl,
	replyTo,
	type
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

	if (type) {
		messageData.type = type;
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

export const updateChatData = async (chatId, userId, chatData) => {
	try {
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const chatRef = child(dbRef, `chats/${chatId}`);

		await update(chatRef, {
			...chatData,
			updatedAt: new Date().toISOString(),
			updatedBy: userId,
		});
	} catch (error) {
		console.log(error);
	}
};

export const removeUserFromChat = async (userLoggedInData, userToRemoveData, chatData) => {
	const userToRemoveId = userToRemoveData.userId;
	const newUsers = chatData.users.filter(uid => uid !== userToRemoveId);
	await updateChatData(chatData.key, userLoggedInData.userId, { users: newUsers});

	// remove userChats
	const userChats = await getUserChats(userToRemoveId);

	for (const key in userChats){
		const currentChatId = userChats[key];

		if(currentChatId === chatData.key){
			await deleteUserChat(userToRemoveId, key);
			break;
		}
	}

	const messageText = userLoggedInData.userId === userToRemoveId ? `${userLoggedInData.firstName} left the chat`:
	`${userLoggedInData.firstName} removed ${userToRemoveData.firstName}`;
	await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);
}
