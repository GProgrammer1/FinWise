// src/screens/auth/Signup.tsx
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
  Checkbox,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigators/RootStackNavigator";
import { signupSchema, type SignupFormData } from "../../utils/validation/authSchemas";
import { API_URL } from "@env";

type SignupProps = NativeStackScreenProps<RootStackParamList, "Signup">;

export default function Signup({ navigation }: SignupProps) {
  const theme = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});

  const valid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    pw.length >= 1 &&
    cpw.length >= 1 &&
    agree &&
    !loading;

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
    h8: { height: 8 },
    v16: { height: 16 },
    v24: { height: 24 },
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
    socialBtn: { height: 44, justifyContent: "center", borderRadius: 12 },
    divider: { height: 1, backgroundColor: theme.colors.outline + "33" },
    link: { color: theme.colors.primary, fontWeight: "700" },
    sub: {
      color: theme.colors.onSurfaceVariant ?? theme.colors.outline,
      textAlign: "center",
    },
    onSurface: { color: theme.colors.onSurface },
    error: { 
      color: theme.colors.error, 
      fontSize: 12, 
      marginTop: 4,
      fontFamily: "Inter_400Regular",
    },
    footer: { alignItems: "center", marginTop: 24 },
    termsRow: { flexDirection: "row", alignItems: "center" },
  });

  const handleSignup = async () => {
    // Clear previous errors
    setErrors({});

    // Validate with Zod
    const result = signupSchema.safeParse({
      name,
      email,
      password: pw,
      confirmPassword: cpw,
      agreeToTerms: agree,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof SignupFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      // Example API call (uncomment when ready)
      // const response = await fetch(`${API_URL}/auth/signup`, {
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
      console.error('Signup error:', error);
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
          showsVerticalScrollIndicator={false}
        >
          {/* Single centered card */}
          <View style={styles.card}>
            {/* Header */}
            <View style={[styles.center, { marginBottom: 16 }]}>
              <View style={styles.logoWrap}>
                <Ionicons
                  name="person-add-outline"
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
                Create account
              </Text>
              <View style={styles.h8} />
              <Text variant="bodyMedium" style={styles.sub}>
                Start your journey to{" "}
                <Text style={styles.link}>financial freedom</Text>.
              </Text>
            </View>

            {/* Form */}
            <View>
              {/* Name */}
              <PaperInput
                mode="outlined"
                label="Full name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                autoCapitalize="words"
                autoComplete="name"
                left={<PaperInput.Icon icon="account" />}
                placeholder="e.g. Layal Barakat"
                placeholderTextColor={theme.colors.onSurfaceVariant + "66"}
                style={{ borderRadius: 12 }}
                error={!!errors.name}
              />
              {errors.name && <Text style={styles.error}>{errors.name}</Text>}
              <View style={styles.v16} />

              {/* Email */}
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
              <View style={styles.v16} />

              {/* Password */}
              <PaperInput
                mode="outlined"
                label="Password"
                value={pw}
                onChangeText={(text) => {
                  setPw(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
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
              {errors.password && <Text style={styles.error}>{errors.password}</Text>}
              <View style={styles.v16} />

              {/* Confirm password */}
              <PaperInput
                mode="outlined"
                label="Confirm password"
                value={cpw}
                onChangeText={(text) => {
                  setCpw(text);
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
              <View style={styles.v16} />

              {/* Terms */}
              <View style={styles.termsRow}>
                <Checkbox
                  status={agree ? "checked" : "unchecked"}
                  onPress={() => {
                    setAgree((a) => !a);
                    if (errors.agreeToTerms) 
                      setErrors({ ...errors, agreeToTerms: undefined });
                  }}
                />
                <Text
                  variant="bodyMedium"
                  style={[styles.sub, { textAlign: "left", flex: 1 }]}
                >
                  I agree to the{" "}
                  <Text style={styles.link}>Terms & Conditions</Text> and{" "}
                  <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
              </View>
              {errors.agreeToTerms && (
                <Text style={[styles.error, { marginLeft: 8 }]}>
                  {errors.agreeToTerms}
                </Text>
              )}

              {/* Sign up */}
              <View style={styles.v16} />
              <Button
                mode="contained"
                icon="account-plus"
                onPress={handleSignup}
                loading={loading}
                disabled={!valid}
                style={styles.btn}
                labelStyle={styles.btnLabel}
                buttonColor={valid ? theme.colors.primary : theme.colors.surfaceVariant}
              >
                Create account
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
                  Already have an account?{" "}
                  <Text
                    onPress={() => navigation.navigate("Login")}
                    style={styles.link}
                  >
                    Sign in
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
