import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import NeonScreen from "../components/NeonScreen";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../src/navigation/RootNavigator";

export default function AddQuestionScreen() {
  const navigation = useNavigation<RootStackNavigationProp<"AddQuestion">>();

  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [category, setCategory] = useState("react-native");
  const [timeLimit, setTimeLimit] = useState("15");

  const handleAdd = async () => {
    if (!text || options.some((opt) => !opt) || !correctAnswer || !category) {
      Alert.alert(
        "Error",
        "Please fill out all fields and select a correct answer."
      );
      return;
    }

    if (!options.includes(correctAnswer)) {
      Alert.alert("Error", "Correct answer must match one of the options.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        "http://10.0.2.2:3001/api/admin/questions/add-question",
        {
          text,
          options,
          correctAnswer,
          category,
          timeLimit: Number(timeLimit),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Success", "Question added!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to add question");
    }
  };

  return (
    <NeonScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>➕ Add Question</Text>

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
                const updated = [...options];
                updated[i] = val;
                setOptions(updated);
              }}
              style={styles.input}
            />
          ))}

          <Text style={styles.subTitle}>Select Correct Answer</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={correctAnswer}
              onValueChange={setCorrectAnswer}
              dropdownIconColor="#00ffcc"
              style={styles.picker}
            >
              <Picker.Item label="Select correct answer..." value="" />
              {options.map((opt, i) => (
                <Picker.Item
                  key={i}
                  label={opt || `Option ${i + 1}`}
                  value={opt}
                />
              ))}
            </Picker>
          </View>

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
            onPress={() => navigation.goBack()}
            style={[styles.saveButton, { backgroundColor: "#555" }]}
          >
            <Text style={styles.saveText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 150,
  },
  title: {
    fontSize: 22,
    color: "#00ffcc",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
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
  subTitle: {
    color: "#00ffcc",
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  pickerWrapper: {
    backgroundColor: "#2a2a3d",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00ffcc",
    marginBottom: 10,
  },
  picker: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#00cc66",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
