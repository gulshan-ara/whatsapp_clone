import { createSlice } from "@reduxjs/toolkit";

// states and actions needed for updating the state of authentication forms.
const chatSlice = createSlice({
	name: "chats",
	// initial states of the authentication form
	initialState: {
		chatsData: {},
	},
	// reducers property contains methods for updating the states stored in initialState property.
	reducers: {
		setChatsData: (state, action) => {
			state.chatsData = { ...action.payload.chatsData };
		},
	},
});

// exporting all functions given insidde the reducers property
export const setChatsData = chatSlice.actions.setChatsData;

// this is a property comes with createSlice method. Not the 'reducers' given above.
export default chatSlice.reducer;
