import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface ChartWrapperProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function ChartWrapper({ title, children, style }: ChartWrapperProps) {
  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.chart}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  chart: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

