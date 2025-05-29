import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import NeonScreen from "../components/NeonScreen";
import NeonButton from "../components/NeonButton";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../src/navigation/RootNavigator";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type QuizResultScreenRouteProp = RouteProp<RootStackParamList, "QuizResult">;

export default function QuizResultScreen() {
  const navigation = useNavigation();
  const route = useRoute<QuizResultScreenRouteProp>();
  const { score = 0, correctAnswers = 0, totalQuestions = 10 } = route.params;

  const scoreVal = useSharedValue(0);
  const correctVal = useSharedValue(0);
  const incorrectVal = useSharedValue(0);

  useEffect(() => {
    scoreVal.value = withTiming(score, { duration: 1500 });
    correctVal.value = withTiming(correctAnswers, { duration: 1500 });
    incorrectVal.value = withTiming(totalQuestions - correctAnswers, {
      duration: 1500,
    });
  }, []);

  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 }],
  }));

  const renderStat = (
    label: string,
    value: Animated.SharedValue<number>,
    color: string
  ) => {
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: 1,
    }));
    return (
      <View style={styles.statContainer}>
        <Text style={styles.statLabel}>{label}</Text>
        <Animated.Text style={[styles.statValue, { color }, animatedStyle]}>
          {Math.round(value.value)}
        </Animated.Text>
      </View>
    );
  };

  return (
    <NeonScreen showBottomBar>
      <Text style={styles.title}>🎉 Quiz Complete</Text>

      <Animated.Text style={[styles.score, scoreStyle]}>
        {Math.round(scoreVal.value)} pts
      </Animated.Text>

      {renderStat("Correct Answers", correctVal, "#00ffcc")}
      {renderStat("Incorrect Answers", incorrectVal, "#ff4444")}
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00ffcc",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  score: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#00ffcc",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "#00ffcc",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  statLabel: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    textShadowColor: "#00ffcc",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
