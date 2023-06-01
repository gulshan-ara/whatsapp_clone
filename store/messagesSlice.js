import { createSlice } from "@reduxjs/toolkit";

// states and actions needed for updating the state of authentication forms.
const messagesSlice = createSlice({
	name: "messages",
	// initial states of the authentication form
	initialState: {
		messagesData: {},
	},
	// reducers property contains methods for updating the states stored in initialState property.
	reducers: {
		setChatMessages: (state, action) => {
			const existingMessages = state.messagesData;
			const { chatId, messagesData } = action.payload;
			existingMessages[chatId] = messagesData;
			state.messagesData = existingMessages;
		},
	},
});

// exporting all functions given insidde the reducers property
export const setChatMessages = messagesSlice.actions.setChatMessages;

// this is a property comes with createSlice method. Not the 'reducers' given above.
export default messagesSlice.reducer;
