import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

interface Props {
  finalScore: number;
}

export default function ScoreReveal({ finalScore }: Props) {
  const score = useSharedValue(0);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const updateDisplay = (val: number) => {
      setDisplayScore(Math.round(val));
    };

    // Animate score and update UI during animation
    score.value = withTiming(finalScore, { duration: 1500 }, (finished) => {
      if (finished) {
        runOnJS(setDisplayScore)(finalScore); // make sure it's exact at the end
      }
    });

    const frameLoop = () => {
      "worklet";
      runOnJS(setDisplayScore)(Math.round(score.value));
      if (score.value < finalScore) {
        requestAnimationFrame(frameLoop);
      }
    };

    requestAnimationFrame(frameLoop);
  }, [finalScore]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Score:</Text>
      <Text style={styles.score}>{displayScore}</Text>
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
