import React, { useEffect } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
} from "react-native-reanimated";

interface NeonButtonProps {
  onPress: () => void;
  label: string;
  iconName?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function NeonButton({
  onPress,
  label,
  iconName = "bolt",
  style,
  textStyle,
}: NeonButtonProps) {
  const glow = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    glow.value = withRepeat(withTiming(1.05, { duration: 1000 }), -1, true);
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const staticShadow = {
    shadowColor: "#00ffe0",
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  } as ViewStyle;

  return (
    <Animated.View
      style={[styles.glowWrapper, staticShadow, glowStyle, pressStyle, style]}
    >
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.95))}
        onPressOut={() => {
          scale.value = withSpring(1);
          onPress();
        }}
        style={styles.button}
      >
        {iconName && (
          <FontAwesome6
            name={iconName}
            size={16}
            color="#00ffe0"
            style={{ marginRight: 6 }}
            solid
          />
        )}
        <Text style={[styles.text, textStyle]}>{label.toUpperCase()}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glowWrapper: {
    borderRadius: 10,
    marginHorizontal: 40,
    marginTop: 30,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderWidth: 2,
    borderColor: "#00ffe0",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  text: {
    color: "#00ffe0",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
