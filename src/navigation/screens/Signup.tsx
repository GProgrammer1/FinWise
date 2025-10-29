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

  const pwMatch = !cpw || pw === cpw;
  const valid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    pw.length >= 1 &&
    cpw.length >= 1 &&
    pwMatch &&
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
      backgroundColor: valid
        ? theme.colors.primary
        : theme.colors.surfaceVariant,
      opacity: valid ? 1 : 0.6,
    },
    socialBtn: { height: 44, justifyContent: "center", borderRadius: 12 },
    divider: { height: 1, backgroundColor: theme.colors.outline + "33" },
    link: { color: theme.colors.primary, fontWeight: "700" },
    sub: {
      color: theme.colors.onSurfaceVariant ?? theme.colors.outline,
      textAlign: "center",
    },
    onSurface: { color: theme.colors.onSurface },
    error: { color: theme.colors.error, marginTop: 6 },
    footer: { alignItems: "center", marginTop: 24 },
    termsRow: { flexDirection: "row", alignItems: "center" },
  });

  const handleSignup = async () => {
    if (!valid) return;
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
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
                left={<PaperInput.Icon icon="account" />}
                placeholder="e.g. Layal Barakat"
                style={{ borderRadius: 12 }}
              />
              <View style={styles.v16} />

              {/* Email */}
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
              <View style={styles.v16} />

              {/* Password */}
              <PaperInput
                mode="outlined"
                label="Password"
                value={pw}
                onChangeText={setPw}
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
                style={{ borderRadius: 12 }}
              />
              <View style={styles.v16} />

              {/* Confirm password */}
              <PaperInput
                mode="outlined"
                label="Confirm password"
                value={cpw}
                onChangeText={setCpw}
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
                style={{ borderRadius: 12 }}
                error={!!cpw && !pwMatch}
              />
              {!pwMatch && (
                <Text variant="labelSmall" style={styles.error}>
                  Passwords don’t match
                </Text>
              )}
              <View style={styles.v16} />

              {/* Terms */}
              <View style={styles.termsRow}>
                <Checkbox
                  status={agree ? "checked" : "unchecked"}
                  onPress={() => setAgree((a) => !a)}
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

              {/* Sign up */}
              <View style={styles.v16} />
              <Button
                mode="contained"
                icon="account-plus"
                onPress={handleSignup}
                loading={loading}
                disabled={!valid}
                style={styles.btn}
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
