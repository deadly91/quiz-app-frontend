import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import NeonScreen from "../components/NeonScreen";
import NeonButton from "../components/NeonButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/RootNavigator";

interface TokenPayload {
  userId: string;
  nickname: string;
  role: string;
}

export default function HomeScreen() {
  const [nickname, setNickname] = useState("Player");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode<TokenPayload>(token);
        setNickname(decoded.nickname);
        setIsAdmin(decoded.role === "admin");
      } catch (err) {
        console.error("Failed to decode token:", err);
        setNickname("Player");
      }
    };

    fetchUser();
  }, []);

  return (
    <NeonScreen showBottomBar>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.greeting}>
            Hello, <Text style={styles.nickname}>{nickname}</Text>!
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.description}>
            Welcome to the React Native Quiz Game
          </Text>
          <Text style={styles.subtext}>
            A fast way to test and improve your React Native fundamentals.
          </Text>
        </View>

        {isAdmin && (
          <>
            <NeonButton
              label="Admin Panel"
              iconName="screwdriver-wrench"
              onPress={() => navigation.navigate("AdminPanel")}
              textStyle={{ fontSize: 16 }}
              style={{ marginHorizontal: 40, marginTop: 20 }}
            />
            <Text style={styles.adminSubtitle}>
              Manage users, questions, and metrics
            </Text>
          </>
        )}
      </View>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  card: {
    backgroundColor: "#1a1a2e",
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 14,
    elevation: 4,
  },
  greeting: {
    fontSize: 24,
    color: "#00ffcc",
    fontWeight: "bold",
    textAlign: "center",
  },
  nickname: {
    color: "#fff",
  },
  description: {
    fontSize: 18,
    color: "#00ffcc",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  subtext: {
    fontSize: 14,
    color: "#00ffcc",
    textAlign: "center",
  },
  adminSubtitle: {
    color: "#ccc",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
});
