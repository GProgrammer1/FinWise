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
import {
  loginSchema,
  type LoginFormData,
} from "../../utils/validation/authSchemas";
import { API_URL } from "@env";

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;

export default function Login({ navigation }: LoginProps) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});

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
    },
    btnLabel: {
      color: theme.colors.onPrimary,
      fontFamily: "Inter_400Regular",
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
    error: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: 4,
      fontFamily: "Inter_400Regular",
    },
  });

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({});

    // Validate with Zod
    const result = loginSchema.safeParse({ email, password: pw });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof LoginFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      // Example API call (uncomment when ready)
      // const response = await fetch(`${API_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(result.data),
      // });

      setTimeout(() => {
        setLoading(false);
        // navigation.replace("MainApp");
      }, 800);
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
    }
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
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                left={<PaperInput.Icon icon="email" />}
                placeholder="you@family.com"
                placeholderTextColor={theme.colors.onSurfaceVariant + "66"}
                style={{ borderRadius: 12 }}
                error={!!errors.email}
              />
              {errors.email && <Text style={styles.error}>{errors.email}</Text>}

              <View style={styles.inputSpacer} />

              <PaperInput
                mode="outlined"
                label="Password"
                value={pw}
                onChangeText={(text) => {
                  setPw(text);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
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
                placeholderTextColor={theme.colors.onSurfaceVariant + "66"}
                style={{ borderRadius: 12 }}
                error={!!errors.password}
              />
              {errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

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
                labelStyle={styles.btnLabel}
                buttonColor={
                  disabled ? theme.colors.surfaceVariant : theme.colors.primary
                }
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
                  Don't have an account?{" "}
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
