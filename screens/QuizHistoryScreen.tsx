import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NeonScreen from "../components/NeonScreen";

interface QuizHistoryEntry {
  _id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  category: string;
  date: string;
}

export default function QuizHistoryScreen() {
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axios.get(
          "http://10.0.2.2:3001/api/quiz/quiz-history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to load quiz history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <NeonScreen showBottomBar>
      <Text style={styles.title}>📜 Quiz History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00ffcc" />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.category}>🏷️ {item.category}</Text>
              <Text style={styles.score}>
                ✅ {item.correctAnswers}/{item.totalQuestions} • {item.score}{" "}
                pts
              </Text>
              <Text style={styles.date}>
                📅 {new Date(item.date).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "#00ffcc",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderColor: "#00ffcc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  category: {
    color: "#00ffcc",
    fontSize: 16,
    marginBottom: 4,
  },
  score: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    color: "#999",
    fontSize: 13,
  },
});
