import { createSlice } from "@reduxjs/toolkit";

// states and actions needed for updating the state of authentication forms.
const authSlice = createSlice({
  name: "auth",
  // initial states of the authentication form
  initialState: {
    token: null,
    userData: null,
    didTryAutoLogin: false,
  },
  // reducers property contains methods for updating the states stored in initialState property.
  reducers: {
    authenticate: (state, action) => {
      const payload = action.payload;
      state.token = payload.token;
      state.userData = payload.userData;
      state.didTryAutoLogin = true;
    },
    setDidTryAutoLogin: (state, action) => {
      state.didTryAutoLogin = true;
    },
    logOut: (state, action) => {
      state.token = null;
      state.userData = null;
      state.didTryAutoLogin = false;
    },
    updateLoggedInUserData: (state, action) => {
      state.userData = {...state.userData, ...action.payload.newData}
    }
  },
});

// exporting all functions given insidde the reducers property
export const authenticate = authSlice.actions.authenticate;
export const setDidTryAutoLogin = authSlice.actions.setDidTryAutoLogin;
export const logOut = authSlice.actions.logOut;
export const updateLoggedInUserData = authSlice.actions.updateLoggedInUserData;

// this is a property comes with createSlice method. Not the 'reducers' given above.
export default authSlice.reducer;
