import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NeonScreen from "../components/NeonScreen";

interface Metrics {
  totalUsers: number;
  bannedUsers: number;
  totalQuizzes: number;
  totalQuestions: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  mostUsedCategory: string;
  newUsersThisWeek: number;
  activeUsersThisWeek: number;
}

export default function MetricsScreen() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("http://10.0.2.2:3001/api/admin/metrics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMetrics(res.data);
    } catch (err) {
      console.error("Failed to fetch metrics", err);
      Alert.alert("Error", "Failed to fetch metrics from the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <NeonScreen showBottomBar>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>📊 App Metrics</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#00ffcc" />
        ) : metrics ? (
          <View style={styles.container}>
            <Text style={styles.metric}>
              👥 Total Users: {metrics.totalUsers}
            </Text>
            <Text style={styles.metric}>
              🚫 Banned Users: {metrics.bannedUsers}
            </Text>
            <Text style={styles.metric}>
              🧠 Total Quizzes Taken: {metrics.totalQuizzes}
            </Text>
            <Text style={styles.metric}>
              ❓ Total Questions: {metrics.totalQuestions}
            </Text>
            <Text style={styles.metric}>
              📈 Average Score: {metrics.averageScore.toFixed(2)}
            </Text>
            <Text style={styles.metric}>
              🏆 Highest Score: {metrics.highestScore}
            </Text>
            <Text style={styles.metric}>
              💀 Lowest Score: {metrics.lowestScore}
            </Text>
            <Text style={styles.metric}>
              🆕 New Users (7d): {metrics.newUsersThisWeek}
            </Text>
            <Text style={styles.metric}>
              🟢 Active Users (7d): {metrics.activeUsersThisWeek}
            </Text>
          </View>
        ) : (
          <Text style={styles.metric}>No metrics available.</Text>
        )}
      </ScrollView>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "#00ffcc",
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 16,
  },
  container: {
    paddingHorizontal: 24,
    gap: 16,
  },
  metric: {
    fontSize: 18,
    color: "#fff",
    backgroundColor: "#1a1a2e",
    padding: 12,
    borderRadius: 8,
  },
  scroll: {
    flexGrow: 1,
    paddingVertical: 16,
  },
});
