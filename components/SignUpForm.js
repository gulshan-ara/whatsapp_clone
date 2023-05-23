import {} from "react-native";
import React from "react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { Feather, FontAwesome } from "@expo/vector-icons";
import {
  validateEmail,
  validatePassword,
  validateString,
} from "../utils/validationConstraints";

const SignUpForm = () => {
  const inputChangeHandler = (inputId, inputValue) => {
    if (inputId === "firstName" || inputId === "lastName") {
      console.log(validateString(inputId, inputValue));
    } else if (inputId === "email") {
      console.log(validateEmail(inputId, inputValue));
    } else if (inputId === "password") {
      console.log(validatePassword(inputId, inputValue));
    }
  };

  return (
    <>
      <Input
        id="firstName"
        label="First name"
        icon="user-o"
        iconPack={FontAwesome}
        iconSize={24}
        onInputChanged={inputChangeHandler}
      />
      <Input
        id="lastName"
        label="Last name"
        icon="user-o"
        iconPack={FontAwesome}
        iconSize={24}
        onInputChanged={inputChangeHandler}
      />
      <Input
        id="email"
        label="Email"
        icon="mail"
        iconPack={Feather}
        iconSize={24}
        onInputChanged={inputChangeHandler}
      />
      <Input
        id="password"
        label="Password"
        icon="lock"
        iconPack={Feather}
        iconSize={24}
        onInputChanged={inputChangeHandler}
      />
      <SubmitButton
        title="Sign Up"
        onPress={() => console.log("Button Pressed!")}
        style={{ marginTop: 20 }}
      />
    </>
  );
};

export default SignUpForm;
