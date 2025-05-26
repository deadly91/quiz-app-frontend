import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/RootNavigator";
import NeonScreen from "../components/NeonScreen";

export default function AdminPanelScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <NeonScreen showBottomBar>
      <View style={styles.container}>
        <Text style={styles.title}>🛠 Admin Panel</Text>

        <TouchableOpacity
          style={styles.neonButton}
          onPress={() => navigation.navigate("ManageUsers")}
        >
          <Text style={styles.neonButtonText}>👥 Manage Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.neonButton}
          onPress={() => navigation.navigate("ManageQuestions")}
        >
          <Text style={styles.neonButtonText}>❓ Manage Questions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.neonButton}
          onPress={() => navigation.navigate("Metrics")}
        >
          <Text style={styles.neonButtonText}>📊 View App Metrics</Text>
        </TouchableOpacity>
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
