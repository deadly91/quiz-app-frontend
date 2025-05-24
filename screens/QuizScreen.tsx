import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import NeonScreen from "../components/NeonScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/RootNavigator";

const sampleQuestion = {
  question: "What is the capital of France?",
  options: ["Berlin", "Madrid", "Paris", "Rome"],
  answer: "Paris",
};

interface TokenPayload {
  userId: string;
  nickname: string;
}

export default function QuizScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          navigation.replace("Login");
          return;
        }

        const decoded = jwtDecode<TokenPayload>(token);
        if (!decoded?.userId) {
          navigation.replace("Login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        navigation.replace("Login");
      }
    };

    checkAuth();
  }, []);

  const handleSelect = (option: string) => {
    if (!answered) {
      setSelected(option);
      setAnswered(true);
    }
  };

  const isCorrect = (option: string) => {
    return answered && option === sampleQuestion.answer;
  };

  const isWrong = (option: string) => {
    return answered && option === selected && option !== sampleQuestion.answer;
  };

  return (
    <NeonScreen showBottomBar>
      <NeonScreen.Title>{sampleQuestion.question}</NeonScreen.Title>

      {sampleQuestion.options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => handleSelect(option)}
          style={[
            styles.option,
            isCorrect(option) && styles.correct,
            isWrong(option) && styles.wrong,
          ]}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  option: {
    backgroundColor: "#1a1a2e",
    borderColor: "#00ffcc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  correct: {
    backgroundColor: "#00c851",
  },
  wrong: {
    backgroundColor: "#ff4444",
  },
});
