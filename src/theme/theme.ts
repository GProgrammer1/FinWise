// theme.ts
import {
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
  MD3Theme,
} from "react-native-paper";

// Brand palette tuned for a finance app: trustful greens/blues with clear contrasts
const brand = {
  primary: "#16a34a", // emerald (confirmations, primary actions)
  onPrimary: "#ffffff",
  primaryContainer: "#a7f3d0",
  onPrimaryContainer: "#064e3b",

  secondary: "#0ea5e9", // sky blue (accents, secondary actions)
  onSecondary: "#ffffff",
  secondaryContainer: "#bae6fd",
  onSecondaryContainer: "#0c4a6e",

  tertiary: "#8b5cf6", // violet (highlights, charts)
  onTertiary: "#ffffff",
  tertiaryContainer: "#e9d5ff",
  onTertiaryContainer: "#4c1d95",

  error: "#ef4444",
  onError: "#ffffff",
  errorContainer: "#fecaca",
  onErrorContainer: "#7f1d1d",

  // Neutrals / surfaces
  backgroundLight: "#0b0f14", // subtle deep background (for dark elevation)
  surfaceLight: "#101825",
  backgroundDark: "#0b0f14",
  surfaceDark: "#101825",

  outline: "#94a3b8",
};

// Global font override for MD3 (Paper v5 supports overriding all variants at once)
export const fonts = configureFonts({
  // This sets the fontFamily for all MD3 text variants
  config: { fontFamily: "Inter_400Regular" },
}); 

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brand.primary,
    onPrimary: brand.onPrimary,
    primaryContainer: brand.primaryContainer,
    onPrimaryContainer: brand.onPrimaryContainer,

    secondary: brand.secondary,
    onSecondary: brand.onSecondary,
    secondaryContainer: brand.secondaryContainer,
    onSecondaryContainer: brand.onSecondaryContainer,

    tertiary: brand.tertiary,
    onTertiary: brand.onTertiary,
    tertiaryContainer: brand.tertiaryContainer,
    onTertiaryContainer: brand.onTertiaryContainer,

    background: "#0f1623", // slightly brighter than base for light mode
    onBackground: "#e5e7eb",

    surface: "#101825",
    onSurface: "#e5e7eb",

    surfaceVariant: "#1b2433",
    onSurfaceVariant: "#cbd5e1",

    outline: brand.outline,
    error: brand.error,
    onError: brand.onError,
    errorContainer: brand.errorContainer,
    onErrorContainer: brand.onErrorContainer,

    // inverse tokens (used in chips, etc.)
    inverseSurface: "#e5e7eb",
    inverseOnSurface: "#0f1623",
    inversePrimary: brand.primary,
  },
  fonts,
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  // You can choose "adaptive" or "exact" mode on Paper’s dark theme.
  colors: {
    ...MD3DarkTheme.colors,
    primary: brand.primary,
    onPrimary: brand.onPrimary,
    primaryContainer: "#065f46",
    onPrimaryContainer: "#d1fae5",

    secondary: brand.secondary,
    onSecondary: brand.onSecondary,
    secondaryContainer: "#075985",
    onSecondaryContainer: "#e0f2fe",

    tertiary: brand.tertiary,
    onTertiary: brand.onTertiary,
    tertiaryContainer: "#5b21b6",
    onTertiaryContainer: "#f3e8ff",

    background: brand.backgroundDark,
    onBackground: "#e5e7eb",

    surface: brand.surfaceDark,
    onSurface: "#e5e7eb",

    surfaceVariant: "#131b28",
    onSurfaceVariant: "#cbd5e1",

    outline: brand.outline,
    error: brand.error,
    onError: brand.onError,
    errorContainer: "#7f1d1d",
    onErrorContainer: "#fecaca",

    inverseSurface: "#e5e7eb",
    inverseOnSurface: "#0b0f14",
    inversePrimary: brand.primary,
  },
  fonts,
};
