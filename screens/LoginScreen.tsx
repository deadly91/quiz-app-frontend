import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/RootNavigator";
import Toast from "react-native-toast-message";
import NeonScreen from "../components/NeonScreen";
import NeonButton from "../components/NeonButton";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://10.0.2.2:3001/api/auth/login", {
        email,
        password,
      });
      await AsyncStorage.setItem("token", res.data.token);

      Toast.show({
        type: "success",
        text1: "Login successful",
      });
      navigation.replace("Home");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: err.response?.data?.error || "Something went wrong",
      });
    }
  };

  return (
    <NeonScreen>
      <NeonScreen.Title>🚀 Quiz Nexus</NeonScreen.Title>

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

      <NeonButton
        label="Login"
        iconName="right-to-bracket"
        onPress={handleLogin}
      />

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ marginTop: 20, textAlign: "center", color: "#0099ff" }}>
          No account? Register
        </Text>
      </TouchableOpacity>
    </NeonScreen>
  );
}
