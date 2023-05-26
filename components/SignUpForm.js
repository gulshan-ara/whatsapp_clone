import { ActivityIndicator, Alert } from "react-native";
import React, { useCallback, useReducer, useState, useEffect } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signUp } from "../utils/actions/authActions";
import colors from "../constants/colors";


// initial values of form
const initialState = {
  inputValues: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
  inputValidities: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};

// main component
const SignUpForm = () => {
  // dispatch function from redux for updating states by passing actions  
  const dispatch = useDispatch();

  // state handler for error messages
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // reducer hook for handling all form input states
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  // input change handler for all form values
  /** due to useCallback, this function only runs when any of the fields input value changes */
  const inputChangeHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  // useEffect hook for rendering alert if error occurs
  useEffect(() => {
    if (error) {
      Alert.alert("Error : ", error);
    }
  }, [error]);

  // authentication handler
  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      // sign up actions for updating the authentication states
      const action = signUp(
        formState.inputValues.firstName,
        formState.inputValues.lastName,
        formState.inputValues.email,
        formState.inputValues.password
      );
      
      // setting error to null because it's a successful signup
      setError(null);
      // passing the actions to update the state by using dispatch function.
      await dispatch(action);
  
    } catch (error) {
      console.log(error.message);
      // updating error state because it's a unsuccessful sign up
      setError(error.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  return (
    <>
      <Input
        id="firstName"
        label="First name"
        icon="user-o"
        iconPack={FontAwesome}
        iconSize={24}
        autoCapitalize="none"
        onInputChanged={inputChangeHandler}
        errorText={formState.inputValidities["firstName"]}
      />
      <Input
        id="lastName"
        label="Last name"
        icon="user-o"
        iconPack={FontAwesome}
        iconSize={24}
        autoCapitalize="none"
        onInputChanged={inputChangeHandler}
        errorText={formState.inputValidities["lastName"]}
      />
      <Input
        id="email"
        label="Email"
        icon="mail"
        iconPack={Feather}
        iconSize={24}
        autoCapitalize="none"
        onInputChanged={inputChangeHandler}
        keyboardType="email-address"
        errorText={formState.inputValidities["email"]}
      />
      <Input
        id="password"
        label="Password"
        icon="lock"
        iconPack={Feather}
        iconSize={24}
        autoCapitalize="none"
        secureTextEntry
        onInputChanged={inputChangeHandler}
        errorText={formState.inputValidities["password"]}
      />
      {isLoading ? (
        <ActivityIndicator
          size={"small"}
          color={colors.primary}
          style={{ marginTop: 10 }}
        />
      ) : (
        <SubmitButton
          title="Sign Up"
          onPress={authHandler}
          style={{ marginTop: 20 }}
          disabled={!formState.formIsValid}
        />
      )}
    </>
  );
};

export default SignUpForm;
