import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NeonScreen from "../components/NeonScreen";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/RootNavigator";

interface Question {
  _id?: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  timeLimit: number;
}

export default function ManageQuestionsScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "ManageQuestions">
    >();
  const [questions, setQuestions] = useState<Question[]>([]);

  const fetchQuestions = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await axios.get("http://10.0.2.2:3001/api/admin/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    } catch {
      Alert.alert("Error", "Could not fetch questions");
    }
  };

  const handleDelete = async (id: string) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.delete(`http://10.0.2.2:3001/api/admin/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
    } catch {
      Alert.alert("Error", "Failed to delete question");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchQuestions();
    }, [])
  );

  return (
    <NeonScreen showBottomBar>
      <Text style={styles.title}>📚 Manage Questions</Text>

      <FlatList
        data={questions}
        keyExtractor={(item) => item._id!}
        contentContainerStyle={styles.scroll}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ marginBottom: 6 }}>
              <Text style={styles.qText}>{item.text}</Text>
              <Text style={styles.meta}>
                🏷️ {item.category} ⏱️ {item.timeLimit}s
              </Text>
            </View>

            {item.options.map((opt, idx) => (
              <Text
                key={idx}
                style={[
                  styles.option,
                  opt === item.correctAnswer && styles.correctAnswer,
                ]}
              >
                {opt}
              </Text>
            ))}

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item._id!)}
            >
              <Text style={styles.deleteText}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddQuestion")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 180 },
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
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#00ffcc",
  },
  qText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  meta: {
    color: "#888",
    fontSize: 12,
    marginBottom: 8,
  },
  option: {
    color: "#ccc",
    fontSize: 14,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderColor: "transparent",
  },
  correctAnswer: {
    color: "#00ffcc",
    fontWeight: "bold",
    borderColor: "#00ffcc",
  },
  deleteButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ff4444",
    borderRadius: 6,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#00ffcc",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    elevation: 5,
  },
  fabText: {
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
  },
});
