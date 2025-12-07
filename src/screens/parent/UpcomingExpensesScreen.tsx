import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { UpcomingExpense } from '@/types';
import { api } from '@/services/api';

export default function UpcomingExpensesScreen() {
  const [expenses, setExpenses] = useState<UpcomingExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpcomingExpenses();
  }, []);

  const loadUpcomingExpenses = async () => {
    try {
      const data = await api.get<UpcomingExpense[]>('/upcoming-expenses');
      setExpenses(data.filter((e) => e.status === 'pending'));
    } catch (error) {
      console.error('Failed to load upcoming expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/upcoming-expenses/${id}/approve`);
      loadUpcomingExpenses();
      Alert.alert('Success', 'Expense request approved');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.put(`/upcoming-expenses/${id}/reject`);
      loadUpcomingExpenses();
      Alert.alert('Success', 'Expense request rejected');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to reject');
    }
  };

  const renderExpenseItem = ({ item }: { item: UpcomingExpense }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        <Text style={styles.expenseDescription}>{item.description}</Text>
        <Text style={styles.expenseDate}>
          Requested for: {new Date(item.requestedDate).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.approveButton]}
          onPress={() => handleApprove(item.id)}
        >
          <Text style={styles.approveButtonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleReject(item.id)}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Expenses</Text>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pending requests</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={loadUpcomingExpenses}
      />
    </View>
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
  expenseItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 8,
  },
  expenseInfo: {
    marginBottom: 12,
  },
  expenseCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  expenseDescription: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: '#666',
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#34C759',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

