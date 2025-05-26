import React from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/RootNavigator";
import NeonScreen from "../components/NeonScreen";

export default function AdminPanelScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const createAnimatedButton = (
    label: string,
    route: keyof RootStackParamList
  ) => {
    const scale = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start(() => {
        navigation.navigate(route);
      });
    };

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.neonButton}
        >
          <Text style={styles.neonButtonText}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <NeonScreen showBottomBar>
      <View style={styles.container}>
        <Text style={styles.title}>🛠 Admin Panel</Text>
        {createAnimatedButton("👥 Manage Users", "ManageUsers")}
        {createAnimatedButton("❓ Manage Questions", "ManageQuestions")}
        {createAnimatedButton("📊 View App Metrics", "Metrics")}
      </View>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-start",
    gap: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00ffcc",
    textAlign: "center",
    marginBottom: 30,
  },
  neonButton: {
    backgroundColor: "#1a1a2e",
    borderColor: "#00ffcc",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#00ffcc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  neonButtonText: {
    color: "#00ffcc",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
