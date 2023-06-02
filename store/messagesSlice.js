import { createSlice } from "@reduxjs/toolkit";

// states and actions needed for updating the state of authentication forms.
const messagesSlice = createSlice({
	name: "messages",
	// initial states of the authentication form
	initialState: {
		messagesData: {},
		starredMessages: {},
	},
	// reducers property contains methods for updating the states stored in initialState property.
	reducers: {
		setChatMessages: (state, action) => {
			const existingMessages = state.messagesData;
			const { chatId, messagesData } = action.payload;
			existingMessages[chatId] = messagesData;
			state.messagesData = existingMessages;
		},
		addStarredMessage: (state, action) => {
			const { starredMessageData } = action.payload;
			state.starredMessages[
				starredMessageData.messageId
			] = starredMessageData;
		},
		removeStarredMessage: (state, action) => {
			const { messageId } = action.payload;
			delete state.starredMessages[messageId];
		},
		// add initially starred messages to state when app loads
		setStarredMessage: (state, action) => {
			const { starredMessages } = action.payload;
			state.starredMessages = { ...starredMessages };
		},
	},
});

// exporting all functions given insidde the reducers property
export const {
	setChatMessages,
	setStarredMessage,
	addStarredMessage,
	removeStarredMessage,
} = messagesSlice.actions;

// this is a property comes with createSlice method. Not the 'reducers' given above.
export default messagesSlice.reducer;
