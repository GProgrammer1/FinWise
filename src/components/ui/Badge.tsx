import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  style?: ViewStyle;
}

export default function Badge({ text, variant = 'primary', style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  primary: {
    backgroundColor: '#E3F2FD',
  },
  success: {
    backgroundColor: '#E8F5E9',
  },
  warning: {
    backgroundColor: '#FFF3E0',
  },
  error: {
    backgroundColor: '#FFEBEE',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryText: {
    color: '#1976D2',
  },
  successText: {
    color: '#388E3C',
  },
  warningText: {
    color: '#F57C00',
  },
  errorText: {
    color: '#D32F2F',
  },
});

