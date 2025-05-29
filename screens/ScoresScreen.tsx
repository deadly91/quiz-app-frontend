import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { jwtDecode } from "jwt-decode";
import { RootStackParamList } from "../src/navigation/RootNavigator";
import NeonScreen from "../components/NeonScreen";

interface TokenPayload {
  userId: string;
  nickname: string;
}

interface ScoreEntry {
  rank: number;
  nickname: string;
  score: number;
}

export default function ScoresScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchScores = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          navigation.replace("Login");
          return;
        }

        const decoded = jwtDecode<TokenPayload>(token);
        if (!decoded.userId) {
          navigation.replace("Login");
          return;
        }

        const res = await axios.get("http://10.0.2.2:3001/api/quiz/scores", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setScores(res.data);
      } catch (err) {
        console.error("Failed to load scores", err);
        setScores([]);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchScores();
  }, []);

  return (
    <NeonScreen showBottomBar>
      <Text style={styles.title}>🏆 LeaderBoard</Text>
      {loading ? (
        <ActivityIndicator color="#00ffcc" size="large" />
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.scoreItem}>
              <Text style={styles.rank}>{item.rank}.</Text>
              <Text style={styles.nickname}>{item.nickname || "Unknown"}</Text>
              <Text style={styles.score}>{item.score}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "#00ffcc",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  scoreItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    alignItems: "center",
  },
  rank: { color: "#00ffcc", fontWeight: "bold" },
  nickname: { color: "#fff", flex: 1, marginLeft: 10 },
  score: { color: "#00ffcc", fontWeight: "bold" },
});
