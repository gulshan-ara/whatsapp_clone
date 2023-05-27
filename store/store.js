import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

export const store = configureStore({
	// reducers are basically slices of states and that contains properties and actions needed to update a state.
	reducer: {
		auth: authSlice, // slice is a collection of reducer logic.
	},
});
