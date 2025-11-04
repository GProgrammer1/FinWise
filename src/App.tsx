// App.tsx
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { darkTheme, lightTheme } from "./theme/theme";
import RootStackNavigator from "./navigation/navigators/RootStackNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync(); // keep splash until fonts are ready

export default function App() {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }

    // Log token presence in AsyncStorage
    const checkTokens = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      console.log("[App] Token check:");
      console.log("[App] Access token present:", accessToken ? "YES" : "NO");
      console.log("[App] Access token length:", accessToken?.length || 0);
      console.log("[App] Refresh token present:", refreshToken ? "YES" : "NO");
      console.log("[App] Refresh token length:", refreshToken?.length || 0);
    };

    checkTokens();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <RootStackNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
