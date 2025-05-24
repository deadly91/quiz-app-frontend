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

interface Score {
  _id?: string;
  email: string;
  score: number;
}

export default function ScoresScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [scores, setScores] = useState<Score[]>([]);
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
        setScores([
          { email: "Player 1", score: 0 },
          { email: "Player 2", score: 0 },
          { email: "Player 3", score: 0 },
          { email: "Player 4", score: 0 },
          { email: "Player 5", score: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchScores();
  }, []);

  return (
    <NeonScreen showBottomBar disableScroll>
      <Text style={styles.title}>🏆 Scoreboard</Text>
      {loading ? (
        <ActivityIndicator color="#00ffcc" size="large" />
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.scoreItem}>
              <Text style={styles.rank}>{index + 1}.</Text>
              <Text style={styles.email}>{item.email}</Text>
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
  },
  rank: { color: "#00ffcc", fontWeight: "bold" },
  email: { color: "#fff", flex: 1, marginLeft: 10 },
  score: { color: "#00ffcc", fontWeight: "bold" },
});
//scores
