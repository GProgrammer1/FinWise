import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface TagProps {
  text: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function Tag({ text, selected = false, onPress, style }: TagProps) {
  return (
    <TouchableOpacity
      style={[styles.tag, selected && styles.tagSelected, style]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagSelected: {
    backgroundColor: '#007AFF',
  },
  text: {
    fontSize: 14,
    color: '#666',
  },
  textSelected: {
    color: '#fff',
  },
});

