import {} from "react-native";
import React, { useCallback, useReducer } from "react";
import { Feather } from "@expo/vector-icons";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signIn } from "../utils/actions/authActions";

const initialState = {
  inputValues: {
    email: "",
    password: "",
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignInForm = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangeHandler = useCallback((inputId, inputValue) => {
    const result = validateInput(inputId, inputValue);
    dispatchFormState({ inputId, validationResult: result, inputValue });
  }, [dispatchFormState]);

  const authHandler = () => {
    signIn(
      formState.inputValues.email,
      formState.inputValues.password
    );
  }


  return (
    <>
      <Input
        id="email"
        label="Email"
        icon="mail"
        iconPack={Feather}
        iconSize={24}
        autoCapitalize="none"
        keyboardType="email-address"
        onInputChanged={inputChangeHandler}
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
      <SubmitButton
        title="Sign In"
        onPress={authHandler}
        style={{ marginTop: 20 }}
        disabled={!formState.formIsValid}
      />
    </>
  );
};

export default SignInForm;
