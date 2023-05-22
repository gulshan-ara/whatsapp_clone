import {} from "react-native";
import React from "react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { Feather, FontAwesome } from "@expo/vector-icons";

const SignUpForm = () => {
  return (
    <>
      <Input
        label="First name"
        icon="user-o"
        iconPack={FontAwesome}
        iconSize={24}
      />
      <Input
        label="Last name"
        icon="user-o"
        iconPack={FontAwesome}
        iconSize={24}
      />
      <Input label="Email" icon="mail" iconPack={Feather} iconSize={24} />
      <Input label="Password" icon="lock" iconPack={Feather} iconSize={24} />
      <SubmitButton
        title="Sign Up"
        onPress={() => console.log("Button Pressed!")}
        style={{ marginTop: 20 }}
      />
    </>
  );
};

export default SignUpForm;
