// src/screens/auth/ForgotPassword.tsx
import React, { useState } from "react";
import {
  View,
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
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigators/RootStackNavigator";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../../utils/validation/authSchemas";
import { AuthService } from "../../services/authService";

type ForgotPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "ForgotPassword"
>;

export default function ForgotPassword({ navigation }: ForgotPasswordProps) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ForgotPasswordFormData, string>>
  >({});
  const [success, setSuccess] = useState(false);

  const disabled = loading || !email;

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
    btn: {
      height: 48,
      justifyContent: "center",
      borderRadius: 12,
    },
    btnLabel: {
      color: theme.colors.onPrimary,
      fontFamily: "Inter_400Regular",
    },
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
    success: {
      color: theme.colors.primary,
      fontSize: 14,
      marginTop: 8,
      fontFamily: "Inter_400Regular",
    },
  });

  const handleForgotPassword = async () => {
    setErrors({});
    setSuccess(false);

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ForgotPasswordFormData, string>> =
        {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ForgotPasswordFormData] =
            err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      await AuthService.forgotPassword(email);
      setSuccess(true);
    } catch (error: any) {
      setErrors({
        email: error.response?.data?.message || "Failed to send reset email",
      });
    } finally {
      setLoading(false);
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
          <View style={styles.card}>
            <View style={[styles.center, { marginBottom: 16 }]}>
              <View style={styles.logoWrap}>
                <Ionicons
                  name="lock-closed-outline"
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
                Reset Password
              </Text>
              <View style={styles.hSpacer} />
              <Text variant="bodyMedium" style={styles.sub}>
                {success
                  ? "Check your email for reset instructions"
                  : "Enter your email to receive password reset instructions"}
              </Text>
            </View>

            {!success ? (
              <View>
                <PaperInput
                  mode="outlined"
                  label="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
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
                {errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}

                <View style={styles.sectionSpacer} />

                <Button
                  mode="contained"
                  icon="email-send"
                  onPress={handleForgotPassword}
                  loading={loading}
                  disabled={disabled}
                  style={styles.btn}
                  labelStyle={styles.btnLabel}
                  buttonColor={
                    disabled
                      ? theme.colors.surfaceVariant
                      : theme.colors.primary
                  }
                >
                  Send Reset Link
                </Button>

                <View style={styles.footer}>
                  <Text variant="bodyMedium" style={styles.sub}>
                    Remember your password?{" "}
                    <Text
                      onPress={() => navigation.navigate("Login")}
                      style={styles.link}
                    >
                      Sign in
                    </Text>
                  </Text>
                </View>
              </View>
            ) : (
              <View>
                <View
                  style={{
                    backgroundColor: `${theme.colors.primary}1A`,
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 24,
                  }}
                >
                  <Text style={styles.success} variant="bodyMedium">
                    If an account exists with this email, a password reset link
                    has been sent. Please check your inbox.
                  </Text>
                </View>

                <Button
                  mode="contained"
                  icon="arrow-back"
                  onPress={() => navigation.navigate("Login")}
                  style={styles.btn}
                  labelStyle={styles.btnLabel}
                >
                  Back to Sign In
                </Button>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
