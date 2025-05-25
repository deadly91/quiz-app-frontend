import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import NeonScreen from "../components/NeonScreen";
import { RootStackParamList } from "../src/navigation/RootNavigator";
import ManageQuestionsScreen from "./ManageQuestionsScreen";
import ManageUsersScreen from "./ManageUsersScreen";
import MetricsScreen from "./MetricsScreen";
export default function AdminPanelScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <NeonScreen disableScroll showBottomBar>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Panel</Text>

        <NeonScreen.Button onPress={() => navigation.navigate("ManageUsers")}>
          Manage Users
        </NeonScreen.Button>

        <NeonScreen.Button
          onPress={() => navigation.navigate("ManageQuestions")}
        >
          Manage Questions
        </NeonScreen.Button>

        <NeonScreen.Button onPress={() => navigation.navigate("Metrics")}>
          View App Metrics
        </NeonScreen.Button>
      </View>
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00ffcc",
    textAlign: "center",
    marginBottom: 30,
  },
});
