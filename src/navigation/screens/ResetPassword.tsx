// src/screens/auth/ResetPassword.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Linking,
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
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../../utils/validation/authSchemas";
import { AuthService } from "../../services/authService";

type ResetPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "ResetPassword"
>;

export default function ResetPassword({
  navigation,
  route,
}: ResetPasswordProps) {
  const theme = useTheme();
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ResetPasswordFormData, string>>
  >({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get token from route params or from deep link
    const routeToken = route.params?.token;
    if (routeToken) {
      setToken(routeToken);
    } else {
      // Check for deep link
      Linking.getInitialURL().then((url) => {
        if (url) {
          const params = new URLSearchParams(url.split("?")[1]);
          const tokenParam = params.get("token");
          if (tokenParam) {
            setToken(tokenParam);
          }
        }
      });

      // Listen for deep links while app is running
      const subscription = Linking.addEventListener("url", (event) => {
        const params = new URLSearchParams(event.url.split("?")[1]);
        const tokenParam = params.get("token");
        if (tokenParam) {
          setToken(tokenParam);
        }
      });

      return () => subscription.remove();
    }
  }, [route.params]);

  const disabled =
    loading || !password || !confirmPassword || !token || password !== confirmPassword;

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

  const handleResetPassword = async () => {
    if (!token) {
      setErrors({ password: "Reset token is missing" });
      return;
    }

    setErrors({});
    setSuccess(false);

    const result = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof ResetPasswordFormData, string>
      > = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ResetPasswordFormData] =
            err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      await AuthService.resetPassword({ token, password });
      setSuccess(true);
      // Navigate to login after a delay
      setTimeout(() => {
        navigation.replace("Login");
      }, 2000);
    } catch (error: any) {
      setErrors({
        password:
          error.response?.data?.message ||
          "Failed to reset password. The link may have expired.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={[styles.center, { marginBottom: 16 }]}>
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color={theme.colors.error}
              />
              <View style={styles.hSpacer} />
              <Text variant="headlineSmall" style={styles.onSurface}>
                Invalid Reset Link
              </Text>
              <View style={styles.hSpacer} />
              <Text variant="bodyMedium" style={styles.sub}>
                The password reset link is invalid or has expired.
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.btn}
              labelStyle={styles.btnLabel}
            >
              Request New Link
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
                  name="lock-open-outline"
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
                Set New Password
              </Text>
              <View style={styles.hSpacer} />
              <Text variant="bodyMedium" style={styles.sub}>
                {success
                  ? "Password reset successful! Redirecting to login..."
                  : "Enter your new password below"}
              </Text>
            </View>

            {!success ? (
              <View>
                <PaperInput
                  mode="outlined"
                  label="New Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                  autoComplete="password-new"
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

                <View style={styles.inputSpacer} />

                <PaperInput
                  mode="outlined"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  secureTextEntry={!showCpw}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  left={<PaperInput.Icon icon="lock-check" />}
                  right={
                    <PaperInput.Icon
                      icon={showCpw ? "eye-off" : "eye"}
                      onPress={() => setShowCpw((v) => !v)}
                    />
                  }
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.onSurfaceVariant + "66"}
                  style={{ borderRadius: 12 }}
                  error={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <Text style={styles.error}>{errors.confirmPassword}</Text>
                )}

                <View style={styles.sectionSpacer} />

                <Button
                  mode="contained"
                  icon="check-circle"
                  onPress={handleResetPassword}
                  loading={loading}
                  disabled={disabled}
                  style={styles.btn}
                  labelStyle={styles.btnLabel}
                  buttonColor={
                    disabled ? theme.colors.surfaceVariant : theme.colors.primary
                  }
                >
                  Reset Password
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
              <View style={styles.center}>
                <Ionicons
                  name="checkmark-circle"
                  size={64}
                  color={theme.colors.primary}
                />
                <View style={styles.hSpacer} />
                <Text variant="headlineSmall" style={styles.onSurface}>
                  Success!
                </Text>
                <View style={styles.hSpacer} />
                <Text variant="bodyMedium" style={styles.sub}>
                  Your password has been reset successfully.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

