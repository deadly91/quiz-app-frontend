import React from "react";
import RootNavigator from "./src/navigation/AppNavigator";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <>
      <RootNavigator />
      <Toast />
    </>
  );
}
