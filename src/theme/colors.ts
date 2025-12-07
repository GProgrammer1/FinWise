export const colors = {
  light: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FFC107',
    error: '#FF3B30',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#E0E0E0',
  },
  dark: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    success: '#30D158',
    warning: '#FFD60A',
    error: '#FF453A',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#98989D',
    textTertiary: '#636366',
    border: '#38383A',
  },
};

export type ColorScheme = keyof typeof colors;

