import {} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateInput } from "../utils/actions/formActions";

const SignInForm = () => {

  const inputChangeHandler = (inputId, inputValue) => {
    console.log(validateInput(inputId, inputValue));
  };

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
      />
      <SubmitButton
        title="Sign In"
        onPress={() => console.log("Button Pressed!")}
        style={{ marginTop: 20 }}
      />
    </>
  );
};

export default SignInForm;
