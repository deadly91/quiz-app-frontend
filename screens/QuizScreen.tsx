import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NeonScreen from "../components/NeonScreen";
import { useNavigation } from "@react-navigation/native";

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  timeLimit: number;
}

export default function QuizScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [timer, setTimer] = useState(10);
  const [score, setScore] = useState(0);
  const countdown = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const currentQuestion = questions[currentIndex];

  const fetchQuestions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("http://10.0.2.2:3001/api/quiz/random", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data.questions);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load quiz questions");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!currentQuestion) return;

    setTimer(currentQuestion.timeLimit || 10);
    setSelectedOption(null);
    setFeedback("");
    countdown.setValue(1);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    Animated.timing(countdown, {
      toValue: 0,
      duration: (currentQuestion.timeLimit || 10) * 1000,
      useNativeDriver: false,
    }).start();

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleSelect = (option: string) => {
    if (selectedOption) return;

    setSelectedOption(option);
    const isCorrect = option === currentQuestion.correctAnswer;
    setFeedback(isCorrect ? "✅ Correct!" : "❌ Wrong!");
    if (isCorrect) setScore((prev) => prev + 10);

    setTimeout(goToNextQuestion, 1500);
  };

  const handleTimeout = () => {
    if (selectedOption) return;
    setFeedback("⏰ Time's up!");
    setTimeout(goToNextQuestion, 1500);
  };

  const goToNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      try {
        const token = await AsyncStorage.getItem("token");
        await axios.post(
          "http://10.0.2.2:3001/api/quiz/submit",
          { score },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Alert.alert("Quiz Complete", `You scored ${score} points!`);
        navigation.goBack();
      } catch (err) {
        Alert.alert("Error", "Could not submit score");
      }
    }
  };

  const progressWidth = countdown.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  if (questions.length === 0 || !currentQuestion) {
    return (
      <NeonScreen showBottomBar>
        <ActivityIndicator size="large" color="#00ffcc" />
      </NeonScreen>
    );
  }

  return (
    <NeonScreen showBottomBar>
      <Text style={styles.step}>
        Question {currentIndex + 1} of {questions.length}
      </Text>

      <Text style={styles.title}>{currentQuestion.text}</Text>

      <View style={styles.timerBar}>
        <Animated.View style={[styles.progress, { width: progressWidth }]} />
      </View>
      <Text style={styles.timerText}>{timer}s</Text>

      {currentQuestion.options.map((option, index) => {
        const isSelected = selectedOption === option;
        const isCorrect = option === currentQuestion.correctAnswer;

        let bgColor = "#2a2a3d";
        if (selectedOption) {
          if (isSelected && isCorrect) bgColor = "#00cc66";
          else if (isSelected) bgColor = "#ff4444";
          else if (isCorrect) bgColor = "#00cc66";
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelect(option)}
            style={[styles.option, { backgroundColor: bgColor }]}
            disabled={!!selectedOption}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        );
      })}

      {!!feedback && <Text style={styles.feedback}>{feedback}</Text>}
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  step: {
    fontSize: 16,
    color: "#00ffcc",
    textAlign: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00ffcc",
    textAlign: "center",
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: "#00ffcc",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  feedback: {
    textAlign: "center",
    fontSize: 18,
    color: "#00ffcc",
    marginTop: 20,
    fontWeight: "bold",
  },
  timerBar: {
    height: 10,
    backgroundColor: "#555",
    borderRadius: 6,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  progress: {
    height: 10,
    backgroundColor: "#00ffcc",
  },
  timerText: {
    color: "#00ffcc",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
});
