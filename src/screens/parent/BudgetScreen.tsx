import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BudgetRecommendation } from '@/types';
import { api } from '@/services/api';

export default function BudgetScreen() {
  const [budget, setBudget] = useState<BudgetRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = async () => {
    try {
      const data = await api.get<BudgetRecommendation>('/budget/recommendations');
      setBudget(data);
    } catch (error) {
      console.error('Failed to load budget:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !budget) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading budget recommendations...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budget Recommendations</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recommended Monthly Budget</Text>
        <Text style={styles.totalAmount}>${budget.total.toFixed(2)}</Text>
        <View style={styles.safetyScore}>
          <Text style={styles.safetyScoreLabel}>Safety Score</Text>
          <View style={styles.scoreBar}>
            <View
              style={[styles.scoreFill, { width: `${budget.safetyScore}%` }]}
            />
          </View>
          <Text style={styles.safetyScoreValue}>{budget.safetyScore}/100</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {budget.categories.map((cat, index) => {
          const percentage = (cat.current / cat.recommended) * 100;
          return (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{cat.category}</Text>
                <Text style={styles.categoryAmount}>
                  ${cat.current.toFixed(2)} / ${cat.recommended.toFixed(2)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(percentage, 100)}%` },
                    percentage > 100 && styles.progressOver,
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Insights</Text>
        {budget.insights.map((insight, index) => (
          <View key={index} style={styles.insightItem}>
            <Text style={styles.insightText}>• {insight}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  safetyScore: {
    marginTop: 12,
  },
  safetyScoreLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#34C759',
  },
  safetyScoreValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  categoryItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  categoryAmount: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressOver: {
    backgroundColor: '#FF3B30',
  },
  insightItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
  },
});

