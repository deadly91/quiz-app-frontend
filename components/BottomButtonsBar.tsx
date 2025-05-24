import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../src/navigation/RootNavigator";
interface Item {
  icon: string;
  label: string;
  onPress?: () => void;
}

export default function BottomButtonsBar({ items }: { items: Item[] }) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={item.label === "Logout" ? handleLogout : item.onPress}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#0e0e1b",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  button: {
    alignItems: "center",
  },
  icon: {
    fontSize: 22,
    color: "#00ffcc",
  },
  label: {
    fontSize: 12,
    color: "#00ffcc",
    marginTop: 2,
  },
});
