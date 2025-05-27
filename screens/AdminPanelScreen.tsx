import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/RootNavigator";
import NeonScreen from "../components/NeonScreen";
import NeonButton from "../components/NeonButton";

export default function AdminPanelScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <NeonScreen showBottomBar>
      <View style={styles.container}>
        <Text style={styles.title}>🛠 Admin Panel</Text>

        <NeonButton
          label="Manage Users"
          iconName="users-gear"
          onPress={() => navigation.navigate("ManageUsers")}
          style={styles.button}
          textStyle={styles.buttonText}
        />

        <NeonButton
          label="Manage Questions"
          iconName="circle-question"
          onPress={() => navigation.navigate("ManageQuestions")}
          style={styles.button}
          textStyle={styles.buttonText}
        />

        <NeonButton
          label="View App Metrics"
          iconName="chart-line"
          onPress={() => navigation.navigate("Metrics")}
          style={styles.button}
          textStyle={styles.buttonText}
        />
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
  button: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
  },
});
