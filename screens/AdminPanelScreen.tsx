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

export default function AdminPanelScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [form, setForm] = useState<Omit<Question, "_id">>({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    category: "react-native",
    timeLimit: 10,
  });

  const fetchQuestions = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await axios.get("http://10.0.2.2:3001/api/admin/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post("http://10.0.2.2:3001/api/admin/add-question", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
      Alert.alert("Question added!");
      setForm({
        text: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        category: "react-native",
        timeLimit: 10,
      });
    } catch (err) {
      Alert.alert("Error", "Failed to add question");
    }
  };

  const handleDelete = async (id: string) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.delete(`http://10.0.2.2:3001/admin/questions/${id}`, {
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
    <NeonScreen disableScroll showBottomBar>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Panel - Manage Questions</Text>

        <TextInput
          style={styles.input}
          placeholder="Question text"
          value={form.text}
          onChangeText={(text) => setForm({ ...form, text })}
        />

        {form.options.map((opt, idx) => (
          <TextInput
            key={idx}
            style={styles.input}
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChangeText={(text) =>
              setForm({
                ...form,
                options: form.options.map((o, i) => (i === idx ? text : o)),
              })
            }
          />
        ))}

        <TextInput
          style={styles.input}
          placeholder="Correct answer"
          value={form.correctAnswer}
          onChangeText={(text) => setForm({ ...form, correctAnswer: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Category"
          value={form.category}
          onChangeText={(text) => setForm({ ...form, category: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Time limit (seconds)"
          keyboardType="numeric"
          value={form.timeLimit.toString()}
          onChangeText={(text) =>
            setForm({ ...form, timeLimit: parseInt(text) || 10 })
          }
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Question</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={questions}
        keyExtractor={(item) => item._id!}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.qText}>{item.text}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item._id!)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      />
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 20,
    color: "#00ffcc",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#1a1a2e",
    color: "#fff",
    borderColor: "#00ffcc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#00ff73",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#29293d",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  qText: { color: "#fff", fontSize: 16 },
  deleteButton: {
    backgroundColor: "#ff4444",
    marginTop: 8,
    padding: 6,
    borderRadius: 6,
  },
  deleteText: { color: "#fff", textAlign: "center" },
});
