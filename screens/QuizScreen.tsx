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
import NeonButton from "../components/NeonButton";
import ScoreReveal from "../components/ScoreReveal"; // ✅ new import
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/RootNavigator";

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
  const [timer, setTimer] = useState(15);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const scoreRef = useRef(0);
  const countdown = useRef(new Animated.Value(1)).current;
  const currentQuestion = questions[currentIndex];
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchQuestions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("http://10.0.2.2:3001/api/quiz/random", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data.questions);
    } catch (err) {
      console.error("Error fetching questions:", err);
      Alert.alert("Error", "Failed to load quiz questions");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!hasStarted || !currentQuestion) return;

    setTimer(currentQuestion.timeLimit || 15);
    setSelectedOption(null);
    setFeedback("");
    countdown.setValue(1);

    const timeoutId = setTimeout(() => {
      if (!selectedOption) {
        handleTimeout();
      }
    }, (currentQuestion.timeLimit || 15) * 1000);

    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    Animated.timing(countdown, {
      toValue: 0,
      duration: (currentQuestion.timeLimit || 15) * 1000,
      useNativeDriver: false,
    }).start();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [currentIndex, hasStarted]);

  const handleSelect = (option: string) => {
    if (selectedOption) return;

    setSelectedOption(option);
    const isCorrect = option === currentQuestion.correctAnswer;
    setFeedback(isCorrect ? "✅ Correct!" : "❌ Wrong!");
    if (isCorrect) {
      scoreRef.current += 10;
      setScore((prev) => prev + 10);
    }
    setTimeout(goToNextQuestion, 1500);
  };

  const handleTimeout = () => {
    if (selectedOption) return;
    setFeedback("⏰ Time's up!");
    setTimeout(goToNextQuestion, 1500);
  };

  const goToNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      try {
        const token = await AsyncStorage.getItem("token");
        const finalScore = scoreRef.current;

        await axios.post(
          "http://10.0.2.2:3001/api/quiz/submit",
          {
            score: finalScore,
            totalQuestions: questions.length,
            correctAnswers: finalScore / 10, // assuming +10 per correct
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setHasFinished(true); // display animated score screen
      } catch (err) {
        console.error("Error submitting score:", err);
        Alert.alert("Error", "Could not submit score");
      }
    }
  };

  const progressWidth = countdown.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // ✅ Show final score reveal
  if (hasFinished) {
    return (
      <NeonScreen showBottomBar>
        <ScoreReveal finalScore={scoreRef.current} />
        <NeonButton
          label="🏠 Back to Home"
          iconName="house"
          onPress={() => navigation.navigate("Home")}
        />
      </NeonScreen>
    );
  }

  if (!hasStarted) {
    return (
      <NeonScreen showBottomBar>
        <Text style={styles.title}>🧠 Quiz Challenge</Text>
        <Text style={styles.rules}>10 Questions</Text>
        <Text style={styles.rules}>10 Points per correct answer</Text>
        <Text style={styles.rules}>Time limit: 15s/question</Text>
        <NeonButton
          label="Start Quiz"
          iconName="file-pen"
          onPress={() => setHasStarted(true)}
        />
      </NeonScreen>
    );
  }

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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00ffcc",
    textAlign: "center",
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  step: {
    fontSize: 16,
    color: "#00ffcc",
    textAlign: "center",
    marginTop: 20,
  },
  rules: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginVertical: 6,
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
