import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NeonScreen from "../components/NeonScreen";

interface Metrics {
  totalQuizzes: number;
  bestScore: number;
}

export default function MetricsScreen() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axios.get("http://10.0.2.2:3001/api/user/metrics", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMetrics(res.data);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
      Alert.alert("Error", "Failed to load metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <NeonScreen showBottomBar disableScroll>
      <Text style={styles.title}>📊 Your Quiz Stats</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00ffcc" />
      ) : metrics ? (
        <View style={styles.card}>
          <Text style={styles.label}>Total Quizzes Completed</Text>
          <Text style={styles.value}>{metrics.totalQuizzes}</Text>

          <Text style={styles.label}>Best Score</Text>
          <Text style={styles.value}>{metrics.bestScore}</Text>
        </View>
      ) : (
        <Text style={styles.empty}>No metrics found.</Text>
      )}
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "#00ffcc",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1a1a2e",
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 10,
  },
  value: {
    fontSize: 22,
    color: "#00ffcc",
    fontWeight: "bold",
  },
  empty: {
    color: "#888",
    textAlign: "center",
  },
});
