// src/screens/auth/Login.tsx
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import {
  Text,
  useTheme,
  TextInput as PaperInput,
  Button,
  Divider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigators/RootStackNavigator";

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;

export default function Login({ navigation }: LoginProps) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const disabled = loading || !email || !pw;

  const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: theme.colors.background },
    content: {
      minHeight: "100%",
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 24,
      backgroundColor: theme.colors.background,
    },
    card: {
      alignSelf: "center",
      width: "100%",
      maxWidth: 480,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 24,
    },
    center: { alignItems: "center" },
    logoWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      backgroundColor: `${theme.colors.primary}1A`,
    },
    hSpacer: { height: 8 },
    sectionSpacer: { height: 24 },
    inputSpacer: { height: 16 },
    row: { flexDirection: "row", alignItems: "center" },
    flex1: { flex: 1 },
    btn: {
      height: 48,
      justifyContent: "center",
      borderRadius: 12,
      backgroundColor: disabled
        ? theme.colors.surfaceVariant
        : theme.colors.primary,
    },
    socialBtn: {
      height: 44,
      justifyContent: "center",
      borderRadius: 12,
    },
    divider: { backgroundColor: theme.colors.outline + "33", height: 1 },
    link: { color: theme.colors.primary, fontWeight: "700" },
    sub: {
      color: theme.colors.onSurfaceVariant ?? theme.colors.outline,
      textAlign: "center",
    },
    onSurface: { color: theme.colors.onSurface },
    footer: { alignItems: "center", marginTop: 24 },
  });

  const handleLogin = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // navigation.replace("MainApp");
    }, 800);
  };

  return (
    <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
      <StatusBar
        backgroundColor="transparent"
        barStyle={theme.dark ? "light-content" : "dark-content"}
      />
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          {/* Single centered card */}
          <View style={styles.card}>
            {/* Header */}
            <View style={[styles.center, { marginBottom: 16 }]}>
              <View style={styles.logoWrap}>
                <Ionicons
                  name="wallet-outline"
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <Text
                variant="headlineLarge"
                style={[
                  styles.onSurface,
                  { fontWeight: "800", letterSpacing: -0.5 },
                ]}
              >
                Welcome back
              </Text>
              <View style={styles.hSpacer} />
              <Text variant="bodyMedium" style={styles.sub}>
                Sign in to continue managing your{" "}
                <Text style={styles.link}>FinWise</Text> finances.
              </Text>
            </View>

            {/* Form */}
            <View>
              <PaperInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                left={<PaperInput.Icon icon="email" />}
                placeholder="you@family.com"
                style={{ borderRadius: 12 }}
              />
              <View style={styles.inputSpacer} />
              <PaperInput
                mode="outlined"
                label="Password"
                value={pw}
                onChangeText={setPw}
                secureTextEntry={!showPw}
                autoCapitalize="none"
                autoComplete="password"
                left={<PaperInput.Icon icon="lock" />}
                right={
                  <PaperInput.Icon
                    icon={showPw ? "eye-off" : "eye"}
                    onPress={() => setShowPw((v) => !v)}
                  />
                }
                placeholder="••••••••"
                style={{ borderRadius: 12 }}
              />
              <View
                style={{
                  alignItems: "flex-end",
                  marginTop: 8,
                  marginBottom: 16,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    /* navigation.navigate("ForgotPassword") */
                  }}
                >
                  <Text variant="labelLarge" style={styles.link}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>

              <Button
                mode="contained"
                icon="login"
                onPress={handleLogin}
                loading={loading}
                disabled={disabled}
                style={styles.btn}
              >
                Sign in
              </Button>

              {/* Divider */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 24,
                }}
              >
                <View style={[styles.flex1, styles.divider]} />
                <Text style={[{ marginHorizontal: 12 }, styles.sub]}>or</Text>
                <View style={[styles.flex1, styles.divider]} />
              </View>

              {/* Social */}
              <View style={styles.row}>
                <View style={[styles.flex1, { marginRight: 8 }]}>
                  <Button
                    mode="outlined"
                    icon="google"
                    style={styles.socialBtn}
                    onPress={() => {}}
                  >
                    Google
                  </Button>
                </View>
                <View style={[styles.flex1, { marginLeft: 8 }]}>
                  <Button
                    mode="outlined"
                    icon="apple"
                    style={styles.socialBtn}
                    onPress={() => {}}
                  >
                    Apple
                  </Button>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text variant="bodyMedium" style={styles.sub}>
                  Don’t have an account?{" "}
                  <Text
                    onPress={() => navigation.navigate("Signup")}
                    style={styles.link}
                  >
                    Sign up
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
