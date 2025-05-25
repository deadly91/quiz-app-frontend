import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
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
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [category, setCategory] = useState("react-native");
  const [timeLimit, setTimeLimit] = useState("10");

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

  const handleAdd = async () => {
    if (!text || options.some((opt) => !opt) || !correctAnswer || !category) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }
    if (!options.includes(correctAnswer)) {
      Alert.alert("Error", "Correct answer must be one of the options");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        "http://10.0.2.2:3001/api/admin/questions/add-question",
        {
          text,
          options,
          correctAnswer,
          category,
          timeLimit: Number(timeLimit),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowForm(false);
      setText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setCategory("react-native");
      setTimeLimit("10");
      fetchQuestions();
    } catch (err) {
      Alert.alert("Error", "Failed to add question");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <NeonScreen showBottomBar>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>📚 Manage Questions</Text>

        {questions.map((item) => (
          <View key={item._id} style={styles.card}>
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
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowForm(!showForm)}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Add Question Form */}
      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>➕ Add Question</Text>
          <TextInput
            placeholder="Question Text"
            placeholderTextColor="#aaa"
            value={text}
            onChangeText={setText}
            style={styles.input}
          />
          {options.map((opt, i) => (
            <TextInput
              key={i}
              placeholder={`Option ${i + 1}`}
              placeholderTextColor="#aaa"
              value={opt}
              onChangeText={(val) => {
                const newOpts = [...options];
                newOpts[i] = val;
                setOptions(newOpts);
              }}
              style={styles.input}
            />
          ))}
          <TextInput
            placeholder="Correct Answer"
            placeholderTextColor="#aaa"
            value={correctAnswer}
            onChangeText={setCorrectAnswer}
            style={styles.input}
          />
          <TextInput
            placeholder="Category"
            placeholderTextColor="#aaa"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />
          <TextInput
            placeholder="Time Limit (seconds)"
            placeholderTextColor="#aaa"
            value={timeLimit}
            onChangeText={setTimeLimit}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity onPress={handleAdd} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowForm(false)}
            style={[styles.saveButton, { backgroundColor: "#555" }]}
          >
            <Text style={styles.saveText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 180,
  },
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
  fab: {
    position: "absolute",
    bottom: 90, // just above footer and bottom bar
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
  form: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#00ffcc",
    zIndex: 20,
  },
  formTitle: {
    color: "#00ffcc",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2a2a3d",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderColor: "#00ffcc",
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: "#00cc66",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
