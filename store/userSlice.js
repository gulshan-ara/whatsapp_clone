import { createSlice } from "@reduxjs/toolkit";

// states and actions needed for updating the state of authentication forms.
const userSlice = createSlice({
	name: "users",
	// initial states of the authentication form
	initialState: {
		storedUsers: {},
	},
	// reducers property contains methods for updating the states stored in initialState property.
	reducers: {
		setStoredUsers: (state, action) => {
			const newUsers = action.payload.newUsers;
			const existingUsers = state.storedUsers;

			const usersArray = Object.values(newUsers);
			for (let i = 0; i < usersArray.length; i++) {
				const userData = usersArray[i];
				existingUsers[userData.userId] = userData;
			}
			state.storedUsers = existingUsers;
		},
	},
});

// exporting all functions given insidde the reducers property
export const setStoredUsers = userSlice.actions.setStoredUsers;

// this is a property comes with createSlice method. Not the 'reducers' given above.
export default userSlice.reducer;
