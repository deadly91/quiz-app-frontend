import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import NeonScreen from "../components/NeonScreen";
import NeonButton from "../components/NeonButton";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/RootNavigator";

export default function ChangePasswordScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        "http://10.0.2.2:3001/api/user/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Success", "Password changed successfully");
      navigation.goBack();
    } catch (err: any) {
      console.error(
        "Password change error:",
        err.response?.data || err.message
      );
      Alert.alert(
        "Error",
        err.response?.data?.error || "Failed to change password"
      );
    }
  };

  return (
    <NeonScreen showBottomBar>
      <Text style={styles.title}>🔐 Change Password</Text>
      <TextInput
        placeholder="Current Password"
        secureTextEntry
        style={styles.input}
        value={oldPassword}
        onChangeText={setOldPassword}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="New Password"
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#aaa"
      />
      <NeonButton
        iconName="check"
        label="Update Password"
        onPress={handleChangePassword}
      />
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    color: "#00ffcc",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#1a1a2e",
    borderColor: "#00ffcc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    color: "#fff",
  },
});
