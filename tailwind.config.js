/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // NativeWind preset adds RN-friendly core plugins
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Bridge Paper theme tokens to Tailwind via CSS variables
        primary: "var(--color-primary)",
        "on-primary": "var(--color-on-primary)",
        surface: "var(--color-surface)",
        "on-surface": "var(--color-on-surface)",
        background: "var(--color-background)",
        "on-background": "var(--color-on-background)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        outline: "var(--color-outline)",
        error: "var(--color-error)",
      },
    },
  },
  plugins: [],
};
