import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  GestureResponderEvent,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BottomButtonsBar from "./BottomButtonsBar";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../src/navigation/RootNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface NeonScreenProps {
  children: React.ReactNode;
  showBottomBar?: boolean;
  disableScroll?: boolean;
}

export default function NeonScreen({
  children,
  showBottomBar = false,
  disableScroll = false,
}: NeonScreenProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const Wrapper = disableScroll ? View : KeyboardAwareScrollView;
  const wrapperProps = disableScroll
    ? { style: styles.inner }
    : {
        contentContainerStyle: styles.inner,
        enableOnAndroid: true,
        extraScrollHeight: 100,
        keyboardShouldPersistTaps: "handled" as const,
      };

  return (
    <View style={styles.container}>
      <Wrapper {...wrapperProps}>
        <View style={styles.content}>{children}</View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © Gil Sasi {new Date().getFullYear()}. All rights reserved.
          </Text>
        </View>
      </Wrapper>

      {showBottomBar && (
        <BottomButtonsBar
          items={[
            {
              icon: "🏠",
              label: "Home",
              onPress: () => navigation.navigate("Home"),
            },
            {
              icon: "🧠",
              label: "Quiz",
              onPress: () => navigation.navigate("Quiz"),
            },
            {
              icon: "🧾",
              label: "Scores",
              onPress: () => navigation.navigate("Scores"),
            },
            {
              icon: "🚪",
              label: "Logout",
              onPress: async () => {
                await AsyncStorage.removeItem("token");
                navigation.replace("Login");
              },
            },
          ]}
        />
      )}
    </View>
  );
}

NeonScreen.Title = function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
};

NeonScreen.Input = function Input(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor="#ccc"
    />
  );
};

NeonScreen.Button = function Button({
  onPress,
  children,
}: {
  onPress: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0e1b" },
  inner: { flexGrow: 1, justifyContent: "space-between" },
  content: { padding: 30 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00ffcc",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1a1a2e",
    color: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#00ffcc",
  },
  button: {
    backgroundColor: "#00ff73",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 12,
  },
  footerText: {
    color: "#777",
    fontSize: 12,
  },
});
