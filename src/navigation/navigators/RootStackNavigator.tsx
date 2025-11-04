import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IntroSlides from "../screens/IntroSlides";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import ForgotPassword from "../screens/ForgotPassword";
import ResetPassword from "../screens/ResetPassword";

export type RootStackParamList = {
  IntroSlides: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const INTRO_SEEN_KEY = "@finwise_intro_seen";

export default function RootStackNavigator() {
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean | null>(null);

  useEffect(() => {
    checkIntroStatus();
  }, []);

  const checkIntroStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(INTRO_SEEN_KEY);
      setHasSeenIntro(value === "true");
    } catch (error) {
      console.error("Error checking intro status:", error);
      setHasSeenIntro(false);
    }
  };

  // Show nothing while checking intro status
  if (hasSeenIntro === null) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
      initialRouteName={hasSeenIntro ? "Login" : "IntroSlides"}
    >
      <Stack.Screen name="IntroSlides" component={IntroSlides} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}
