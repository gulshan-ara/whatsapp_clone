import { getFirebaseApp } from "../firebaseHelper";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { child, getDatabase, ref, set } from "firebase/database";
import { authenticate } from "../../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const signUp = (firstName, lastName, email, password) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth();

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid, stsTokenManager } = result.user;
      const {accessToken, expirationTime} = stsTokenManager;

      const expiryDate = new Date(expirationTime);

      const userData = await createUser(firstName, lastName, email, uid);

      // redux toolkit code
      dispatch(authenticate({ token: accessToken, userData }));

      //storing user sign in data to device via async storage
      saveDataToStorage(accessToken, uid, expiryDate);
    } 
    catch (error) {
      console.log(error.message);
      const errorCode = error.code;

      let message = "Something went wrong";

      if (errorCode === "auth/email-already-in-use") {
        message = "This email is already in use";
      }

      throw new Error(message);
    }
  };
};

export const signIn = (email, password) => {
  console.log(email, password);
};

const createUser = async (firstName, lastName, email, userId) => {
  const firstLast = `${firstName} ${lastName}`;

  const userData = {
    firstName: firstName,
    lastName: lastName,
    firstLast: firstLast.toLowerCase(),
    email: email,
    userId: userId,
    signUpDate: new Date().toISOString(),
  };

  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `user/${userId}`);
  await set(childRef, userData);

  return userData;
};

const saveDataToStorage = (token, userId, expiryDate) => {
  AsyncStorage.setItem("userData", JSON.stringify({
    token,
    userId,
    expiryDate: expiryDate.toISOString()
  }))
}
