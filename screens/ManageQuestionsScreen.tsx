import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NeonScreen from "../components/NeonScreen";

interface Question {
  _id?: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  timeLimit: number;
}

export default function ManageQuestionsScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await axios.get("http://10.0.2.2:3001/api/admin/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions", err);
      Alert.alert("Error", "Could not fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.delete(`http://10.0.2.2:3001/api/admin/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
    } catch (err) {
      Alert.alert("Error", "Failed to delete question");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <NeonScreen showBottomBar disableScroll>
      <Text style={styles.title}>📚 Manage Questions</Text>
      <FlatList
        data={questions}
        keyExtractor={(item) => item._id!}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.qText}>{item.text}</Text>
            <Text style={styles.meta}>
              🏷️ {item.category} ⏱️ {item.timeLimit}s
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item._id!)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
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
    marginBottom: 10,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  qText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  meta: {
    color: "#888",
    fontSize: 12,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
