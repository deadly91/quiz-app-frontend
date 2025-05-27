import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/RootNavigator";
import NeonScreen from "../components/NeonScreen";
import NeonButton from "../components/NeonButton";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
        text2: "Please confirm your password correctly.",
      });
      return;
    }

    try {
      await axios.post("http://10.0.2.2:3001/api/auth/register", {
        email,
        password,
        nickname,
      });

      Toast.show({
        type: "success",
        text1: "🎉 Registration successful!",
        text2: "You can now login.",
      });
      navigation.replace("Login");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: err.response?.data?.error || "Something went wrong",
      });
    }
  };

  return (
    <NeonScreen>
      <NeonScreen.Title>🧠 Sign Up for Quiz Nexus</NeonScreen.Title>

      <NeonScreen.Input
        placeholder="Nickname"
        value={nickname}
        onChangeText={setNickname}
      />
      <NeonScreen.Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <NeonScreen.Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <NeonScreen.Input
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <NeonButton
        label="Register"
        iconName="pen-to-square"
        onPress={handleRegister}
      />

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ marginTop: 20, textAlign: "center", color: "#0099ff" }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </NeonScreen>
  );
}
