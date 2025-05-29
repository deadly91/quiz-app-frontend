import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

interface Props {
  finalScore: number;
}

export default function ScoreReveal({ finalScore }: Props) {
  const score = useSharedValue(0);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    score.value = withTiming(finalScore, { duration: 1500 });
    const interval = setInterval(() => {
      // Safely read the value from JS side
      score.value >= finalScore
        ? clearInterval(interval)
        : setDisplayScore((prev) => {
            const next = prev + 1;
            return next > finalScore ? finalScore : next;
          });
    }, 30);
    return () => clearInterval(interval);
  }, [finalScore]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(1.1, { duration: 500 }) }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Score:</Text>
      <Animated.Text style={[styles.score, animatedStyle]}>
        {displayScore}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
  },
  label: {
    fontSize: 20,
    color: "#aaa",
    marginBottom: 10,
  },
  score: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#00ffcc",
    textShadowColor: "#00ffcc",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
