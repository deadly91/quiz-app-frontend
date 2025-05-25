import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../../screens/LoginScreen";
import RegisterScreen from "../../screens/RegisterScreen";
import HomeScreen from "../../screens/HomeScreen";
import ScoresScreen from "../../screens/ScoresScreen";
import { RootStack } from "./RootNavigator";
import QuizScreen from "../../screens/QuizScreen";
import AdminPanelScreen from "../../screens/AdminPanelScreen";
import ManageUsersScreen from "../../screens/ManageUsersScreen";
import ManageQuestionsScreen from "../../screens/ManageQuestionsScreen";
import MetricsScreen from "../../screens/MetricsScreen";
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0e0e1b",
          },
          headerTintColor: "#00ffcc",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
        }}
      >
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Scores" component={ScoresScreen} />
        <RootStack.Screen name="Quiz" component={QuizScreen} />
        <RootStack.Screen
          name="AdminPanel"
          component={AdminPanelScreen}
          options={{ title: "Admin Panel" }}
        />
        <RootStack.Screen name="ManageUsers" component={ManageUsersScreen} />
        <RootStack.Screen
          name="ManageQuestions"
          component={ManageQuestionsScreen}
        />
        <RootStack.Screen name="Metrics" component={MetricsScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
