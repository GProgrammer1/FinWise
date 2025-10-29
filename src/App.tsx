// App.tsx
import React, { useEffect } from "react";
import { Text, useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { darkTheme, lightTheme } from "./theme/theme";
import IntroSlides from "./navigation/screens/IntroSlides";


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
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <IntroSlides onDone={() => {}
        }/>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
