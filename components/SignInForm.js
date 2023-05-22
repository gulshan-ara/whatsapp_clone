import {} from "react-native";
import React from "react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { Feather } from "@expo/vector-icons";

const SignInForm = () => {
  return (
    <>
      <Input label="Email" icon="mail" iconPack={Feather} iconSize={24} />
      <Input label="Password" icon="lock" iconPack={Feather} iconSize={24} />
      <SubmitButton
        title="Sign In"
        onPress={() => console.log("Button Pressed!")}
        style={{ marginTop: 20 }}
      />
    </>
  );
};

export default SignInForm;
