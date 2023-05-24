import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        userData: null
    },
    reducers: {
        authenticate: (state, action) => {
            const payload = action.payload;
            state.token = payload.token;
            state.userData = payload.userData;
            // console.log(state);
        }
    }
});

export const authenticate = authSlice.actions.authenticate;
export default authSlice.reducer;
