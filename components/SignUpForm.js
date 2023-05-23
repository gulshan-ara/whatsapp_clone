import {} from "react-native";
import React from "react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { validateInput } from "../utils/actions/formActions";

const SignUpForm = () => {
  
  const inputChangeHandler = (inputId, inputValue) => {
    console.log(validateInput(inputId, inputValue));
  };

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
      />
      <Input
        id="lastName"
        label="Last name"
        icon="user-o"
        iconPack={FontAwesome}
        iconSize={24}
        autoCapitalize="none"
        onInputChanged={inputChangeHandler}
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
        title="Sign Up"
        onPress={() => console.log("Button Pressed!")}
        style={{ marginTop: 20 }}
      />
    </>
  );
};

export default SignUpForm;
