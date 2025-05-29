import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NeonScreen from "../components/NeonScreen";
import NeonButton from "../components/NeonButton";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/RootNavigator";

interface ProfileData {
  nickname: string;
  totalPoints: number;
}

export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const res = await axios.get("http://10.0.2.2:3001/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        Alert.alert("Error", "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    Alert.alert("Are you sure?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const token = await AsyncStorage.getItem("token");
          try {
            await axios.delete("http://10.0.2.2:3001/api/user", {
              headers: { Authorization: `Bearer ${token}` },
            });
            await AsyncStorage.removeItem("token");
            navigation.replace("Login");
          } catch {
            Alert.alert("Error", "Failed to delete account.");
          }
        },
      },
    ]);
  };

  return (
    <NeonScreen showBottomBar>
      <Text style={styles.title}>👤 Your Profile</Text>
      {profile && (
        <View style={styles.infoBox}>
          <Text style={styles.label}>Nickname: {profile.nickname}</Text>
          <Text style={styles.label}>Total Points: {profile.totalPoints}</Text>
        </View>
      )}
      <NeonButton
        iconName="key"
        label="Change Password"
        onPress={() => navigation.navigate("ChangePassword")}
      />
      <NeonButton
        iconName="clock-rotate-left"
        label="Quiz History"
        onPress={() => navigation.navigate("QuizHistory")}
      />
      <NeonButton
        iconName="user-xmark"
        label="Delete My Account"
        onPress={handleDeleteAccount}
      />
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "#00ffcc",
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "#1a1a2e",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00ffcc",
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
  },
});
