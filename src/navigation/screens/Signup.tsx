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
  Image,
  Alert,
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
import * as ImagePicker from "expo-image-picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigators/RootStackNavigator";
import {
  signupStep1Schema,
  signupStep2ParentSchema,
  type SignupStep1FormData,
  type SignupStep2ParentFormData,
} from "../../utils/validation/authSchemas";
import { AuthService } from "../../services/authService";
import { COUNTRIES } from "../../constants/countries";
import {
  USER_ROLES,
  ID_IMAGE_QUALITY,
  ID_IMAGE_ASPECT_RATIO,
  PASSWORD_MIN_LENGTH,
  type UserRole,
} from "../../constants/auth";
import { CARD_MAX_WIDTH, MODAL_MAX_HEIGHT } from "../../constants/ui";

type SignupProps = NativeStackScreenProps<RootStackParamList, "Signup">;

type SignupRole = UserRole | null;

export default function Signup({ navigation }: SignupProps) {
  const theme = useTheme();

  // Step 1 state
  const [role, setRole] = useState<SignupRole>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [step, setStep] = useState(1);

  // Step 2 (PARENT only) state
  const [country, setCountry] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [monthlyIncomeBase, setMonthlyIncomeBase] = useState("");
  const [monthlyRentBase, setMonthlyRentBase] = useState("");
  const [monthlyLoansBase, setMonthlyLoansBase] = useState("");
  const [otherNotes, setOtherNotes] = useState("");
  const [idImage, setIdImage] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<
      Record<
        keyof SignupStep1FormData | keyof SignupStep2ParentFormData | "idImage",
        string
      >
    >
  >({});

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
      maxWidth: CARD_MAX_WIDTH,
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
    roleCard: {
      borderWidth: 2,
      borderColor: theme.colors.outline + "33",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      backgroundColor: theme.colors.surface,
    },
    roleCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}1A`,
    },
    stepIndicator: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
      justifyContent: "center",
    },
    stepDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.outline + "66",
      marginHorizontal: 4,
    },
    stepDotActive: {
      backgroundColor: theme.colors.primary,
      width: 24,
    },
    imagePicker: {
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: theme.colors.outline + "66",
      borderRadius: 12,
      padding: 24,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 150,
      marginBottom: 16,
    },
    imagePreview: {
      width: "100%",
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
    },
  });

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your photos to upload your ID."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: ID_IMAGE_ASPECT_RATIO as [number, number],
        quality: ID_IMAGE_QUALITY,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setIdImage({
          uri: asset.uri,
          type: "image/jpeg",
          name: `id-image-${Date.now()}.jpg`,
        });
        if (errors.idImage) {
          setErrors({ ...errors, idImage: undefined });
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleStep1Next = () => {
    setErrors({});

    const result = signupStep1Schema.safeParse({
      role,
      name,
      email,
      password: pw,
      confirmPassword: cpw,
      agreeToTerms: agree,
    });

    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // If CHILD, go directly to submit. If PARENT, go to step 2
    if (role === USER_ROLES.CHILD) {
      handleSubmit();
    } else {
      setStep(2);
    }
  };

  const handleStep2Back = () => {
    setStep(1);
    setErrors({});
  };

  const handleStep2Next = () => {
    setErrors({});

    const result = signupStep2ParentSchema.safeParse({
      country,
      numberOfChildren: numberOfChildren ? parseInt(numberOfChildren) : 0,
      monthlyIncomeBase: monthlyIncomeBase ? parseFloat(monthlyIncomeBase) : 0,
      monthlyRentBase: monthlyRentBase
        ? parseFloat(monthlyRentBase)
        : undefined,
      monthlyLoansBase: monthlyLoansBase
        ? parseFloat(monthlyLoansBase)
        : undefined,
      otherNotes: otherNotes || undefined,
    });

    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Check ID image for PARENT
    if (!idImage) {
      setErrors({ idImage: "ID image is required for parent accounts" });
      return;
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const step1Data: SignupStep1FormData = {
        role: role!,
        name,
        email,
        password: pw,
        confirmPassword: cpw,
        agreeToTerms: agree,
      };

      let step2Data: SignupStep2ParentFormData | undefined;
      if (role === USER_ROLES.PARENT) {
        step2Data = {
          country,
          numberOfChildren: parseInt(numberOfChildren),
          monthlyIncomeBase: parseFloat(monthlyIncomeBase),
          monthlyRentBase: monthlyRentBase
            ? parseFloat(monthlyRentBase)
            : undefined,
          monthlyLoansBase: monthlyLoansBase
            ? parseFloat(monthlyLoansBase)
            : undefined,
          otherNotes: otherNotes || undefined,
        };
      }

      const response = await AuthService.signup(
        step1Data,
        step2Data,
        idImage || undefined
      );

      if (response.success && response.data) {
        // TODO: Navigate to main app when available
        // navigation.replace("MainApp");
        Alert.alert(
          "Success",
          "Account created successfully! Please check your email for verification instructions."
        );
        navigation.replace("Login");
      } else {
        Alert.alert("Error", response.message || "Signup failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        "Signup failed. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validStep1 =
    role !== null &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    pw.length >= PASSWORD_MIN_LENGTH &&
    cpw.length >= PASSWORD_MIN_LENGTH &&
    agree &&
    !loading;

  const validStep2 =
    country.length === 2 &&
    numberOfChildren &&
    monthlyIncomeBase &&
    idImage !== null &&
    !loading;

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
          <View style={styles.card}>
            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              <View
                style={[styles.stepDot, step === 1 && styles.stepDotActive]}
              />
              {role === USER_ROLES.PARENT && (
                <View
                  style={[styles.stepDot, step === 2 && styles.stepDotActive]}
                />
              )}
            </View>

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
                {step === 1 ? "Create account" : "Parent Information"}
              </Text>
              <View style={styles.h8} />
              <Text variant="bodyMedium" style={styles.sub}>
                {step === 1
                  ? "Start your journey to financial freedom."
                  : "Please provide additional information and upload your ID."}
              </Text>
            </View>

            {step === 1 ? (
              <>
                {/* Role Selection */}
                <View style={{ marginBottom: 24 }}>
                  <Text
                    variant="labelLarge"
                    style={[styles.onSurface, { marginBottom: 12 }]}
                  >
                    Account Type *
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setRole(USER_ROLES.PARENT);
                      if (errors.role)
                        setErrors({ ...errors, role: undefined });
                    }}
                    style={[
                      styles.roleCard,
                      role === USER_ROLES.PARENT && styles.roleCardSelected,
                    ]}
                  >
                    <View style={styles.row}>
                      <Ionicons
                        name={
                          role === USER_ROLES.PARENT
                            ? "radio-button-on"
                            : "radio-button-off"
                        }
                        size={24}
                        color={
                          role === USER_ROLES.PARENT
                            ? theme.colors.primary
                            : theme.colors.outline
                        }
                      />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text variant="titleMedium" style={styles.onSurface}>
                          Parent Account
                        </Text>
                        <Text variant="bodySmall" style={styles.sub}>
                          Manage family finances and child accounts
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setRole(USER_ROLES.CHILD);
                      if (errors.role)
                        setErrors({ ...errors, role: undefined });
                    }}
                    style={[
                      styles.roleCard,
                      role === USER_ROLES.CHILD && styles.roleCardSelected,
                    ]}
                  >
                    <View style={styles.row}>
                      <Ionicons
                        name={
                          role === USER_ROLES.CHILD
                            ? "radio-button-on"
                            : "radio-button-off"
                        }
                        size={24}
                        color={
                          role === USER_ROLES.CHILD
                            ? theme.colors.primary
                            : theme.colors.outline
                        }
                      />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text variant="titleMedium" style={styles.onSurface}>
                          Child Account
                        </Text>
                        <Text variant="bodySmall" style={styles.sub}>
                          Simple account for children
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                {errors.role && <Text style={styles.error}>{errors.role}</Text>}

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
                  style={{ borderRadius: 12, marginTop: 16 }}
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
                    setEmail(text.toLowerCase());
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
                <View style={styles.v16} />

                {/* Password */}
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
                {!errors.password && (
                  <Text
                    variant="bodySmall"
                    style={[styles.sub, { marginTop: 4 }]}
                  >
                    Minimum {PASSWORD_MIN_LENGTH} characters
                  </Text>
                )}
                {errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}
                <View style={styles.v16} />

                {/* Confirm Password */}
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

                {/* Next Button */}
                <View style={styles.v16} />
                <Button
                  mode="contained"
                  icon="arrow-forward"
                  onPress={handleStep1Next}
                  loading={loading}
                  disabled={!validStep1}
                  style={styles.btn}
                  labelStyle={styles.btnLabel}
                  buttonColor={
                    validStep1
                      ? theme.colors.primary
                      : theme.colors.surfaceVariant
                  }
                >
                  {role === USER_ROLES.CHILD ? "Create Account" : "Continue"}
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
                      onPress={() => {
                        // TODO: Implement OAuth
                      }}
                    >
                      Google
                    </Button>
                  </View>
                  <View style={[styles.flex1, { marginLeft: 8 }]}>
                    <Button
                      mode="outlined"
                      icon="apple"
                      style={styles.socialBtn}
                      onPress={() => {
                        // TODO: Implement OAuth
                      }}
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
              </>
            ) : (
              <>
                {/* ID Image Upload */}
                <View>
                  <Text
                    variant="labelLarge"
                    style={[styles.onSurface, { marginBottom: 12 }]}
                  >
                    ID Document *
                  </Text>
                  {idImage ? (
                    <View>
                      <Image
                        source={{ uri: idImage.uri }}
                        style={styles.imagePreview}
                        resizeMode="cover"
                      />
                      <Button
                        mode="outlined"
                        icon="camera"
                        onPress={pickImage}
                        style={{ marginBottom: 16 }}
                      >
                        Change Image
                      </Button>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.imagePicker}
                      onPress={pickImage}
                    >
                      <Ionicons
                        name="camera-outline"
                        size={48}
                        color={theme.colors.outline}
                      />
                      <View style={styles.v16} />
                      <Text variant="bodyMedium" style={styles.sub}>
                        Tap to upload ID document
                      </Text>
                      <Text variant="bodySmall" style={styles.sub}>
                        Required for parent accounts
                      </Text>
                    </TouchableOpacity>
                  )}
                  {errors.idImage && (
                    <Text style={styles.error}>{errors.idImage}</Text>
                  )}
                </View>

                <View style={styles.v16} />

                {/* Country */}
                <TouchableOpacity
                  onPress={() => setShowCountryPicker(!showCountryPicker)}
                >
                  <PaperInput
                    mode="outlined"
                    label="Country *"
                    value={
                      COUNTRIES.find((c) => c.code === country)?.name || country
                    }
                    left={<PaperInput.Icon icon="earth" />}
                    right={
                      <PaperInput.Icon
                        icon={showCountryPicker ? "chevron-up" : "chevron-down"}
                      />
                    }
                    placeholder="Select country"
                    placeholderTextColor={theme.colors.onSurfaceVariant + "66"}
                    style={{ borderRadius: 12 }}
                    error={!!errors.country}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                {showCountryPicker && (
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: theme.colors.outline,
                      borderRadius: 12,
                      maxHeight: MODAL_MAX_HEIGHT,
                      marginTop: 8,
                      backgroundColor: theme.colors.surface,
                      position: "relative",
                      zIndex: 1000,
                    }}
                  >
                    <ScrollView keyboardShouldPersistTaps="handled">
                      {COUNTRIES.map((c) => (
                        <TouchableOpacity
                          key={c.code}
                          onPress={() => {
                            setCountry(c.code);
                            setShowCountryPicker(false);
                            if (errors.country)
                              setErrors({ ...errors, country: undefined });
                          }}
                          style={{
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.outline + "33",
                          }}
                        >
                          <Text style={styles.onSurface}>{c.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
                {errors.country && (
                  <Text style={styles.error}>{errors.country}</Text>
                )}
                <View style={styles.v16} />

                {/* Number of Children */}
                <PaperInput
                  mode="outlined"
                  label="Number of Children *"
                  value={numberOfChildren}
                  onChangeText={(text) => {
                    setNumberOfChildren(text.replace(/[^0-9]/g, ""));
                    if (errors.numberOfChildren)
                      setErrors({ ...errors, numberOfChildren: undefined });
                  }}
                  keyboardType="number-pad"
                  left={<PaperInput.Icon icon="account-group" />}
                  placeholder="0"
                  placeholderTextColor={theme.colors.onSurfaceVariant + "66"}
                  style={{ borderRadius: 12 }}
                  error={!!errors.numberOfChildren}
                />
                {errors.numberOfChildren && (
                  <Text style={styles.error}>{errors.numberOfChildren}</Text>
                )}
                <View style={styles.v16} />

                {/* Monthly Income */}
                <PaperInput
                  mode="outlined"
                  label="Monthly Income *"
                  value={monthlyIncomeBase}
                  onChangeText={(text) => {
                    setMonthlyIncomeBase(text.replace(/[^0-9.]/g, ""));
                    if (errors.monthlyIncomeBase)
                      setErrors({ ...errors, monthlyIncomeBase: undefined });
                  }}
                  keyboardType="decimal-pad"
                  left={<PaperInput.Icon icon="currency-usd" />}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.onSurfaceVariant + "66"}
                  style={{ borderRadius: 12 }}
                  error={!!errors.monthlyIncomeBase}
                />
                {errors.monthlyIncomeBase && (
                  <Text style={styles.error}>{errors.monthlyIncomeBase}</Text>
                )}
                <View style={styles.v16} />

                {/* Monthly Rent */}
                <PaperInput
                  mode="outlined"
                  label="Monthly Rent (Optional)"
                  value={monthlyRentBase}
                  onChangeText={(text) => {
                    setMonthlyRentBase(text.replace(/[^0-9.]/g, ""));
                  }}
                  keyboardType="decimal-pad"
                  left={<PaperInput.Icon icon="home" />}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.onSurfaceVariant + "66"}
                  style={{ borderRadius: 12 }}
                />
                <View style={styles.v16} />

                {/* Monthly Loans */}
                <PaperInput
                  mode="outlined"
                  label="Monthly Loans (Optional)"
                  value={monthlyLoansBase}
                  onChangeText={(text) => {
                    setMonthlyLoansBase(text.replace(/[^0-9.]/g, ""));
                  }}
                  keyboardType="decimal-pad"
                  left={<PaperInput.Icon icon="credit-card" />}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.onSurfaceVariant + "66"}
                  style={{ borderRadius: 12 }}
                />
                <View style={styles.v16} />

                {/* Other Notes */}
                <PaperInput
                  mode="outlined"
                  label="Additional Notes (Optional)"
                  value={otherNotes}
                  onChangeText={setOtherNotes}
                  multiline
                  numberOfLines={3}
                  left={<PaperInput.Icon icon="note-text" />}
                  placeholder="Any additional information..."
                  placeholderTextColor={theme.colors.onSurfaceVariant + "66"}
                  style={{ borderRadius: 12 }}
                />

                {/* Buttons */}
                <View style={styles.v24} />
                <View style={styles.row}>
                  <View style={[styles.flex1, { marginRight: 8 }]}>
                    <Button
                      mode="outlined"
                      icon="arrow-back"
                      onPress={handleStep2Back}
                      disabled={loading}
                      style={styles.btn}
                    >
                      Back
                    </Button>
                  </View>
                  <View style={[styles.flex1, { marginLeft: 8 }]}>
                    <Button
                      mode="contained"
                      icon="check-circle"
                      onPress={handleStep2Next}
                      loading={loading}
                      disabled={!validStep2}
                      style={styles.btn}
                      labelStyle={styles.btnLabel}
                      buttonColor={
                        validStep2
                          ? theme.colors.primary
                          : theme.colors.surfaceVariant
                      }
                    >
                      Create Account
                    </Button>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
