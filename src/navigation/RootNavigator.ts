import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

// Define all route names and their expected params
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Scores: undefined;
  Quiz: undefined;
  AdminPanel: undefined;
  // QuizResult: { score: number; totalQuestions: number };
};

// Export type helpers for use in screens
export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

// Export the typed navigator
export const RootStack = createNativeStackNavigator<RootStackParamList>();
