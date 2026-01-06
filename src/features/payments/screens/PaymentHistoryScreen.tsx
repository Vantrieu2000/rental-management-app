/**
 * Payment History Screen
 * Displays payment history for a specific room
 */

import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Text, Card, Chip, ActivityIndicator, Button, Searchbar } from 'react-native-paper';
import { format } from 'date-fns';
import type { PaymentsStackScreenProps } from '@/shared/types/navigation';
import { usePaymentHistory, usePaymentStatistics } from '../hooks/usePayments';
import { PaymentRecord } from '../types';

type Props = PaymentsStackScreenProps<'PaymentHistory'>;

export default function PaymentHistoryScreen({ navigation, route }: Props) {
  const { roomId, propertyId } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentRecord['status'] | 'all'>('all');

  const {
    data: payments,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = usePaymentHistory(roomId);

  const { data: statistics } = usePaymentStatistics(propertyId);

  // Filter payments
  const filteredPayments = payments?.filter((payment) => {
    // Status filter
    if (statusFilter !== 'all' && payment.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const monthYear = `${payment.billingMonth}/${payment.billingYear}`;
      const amount = payment.totalAmount.toString();
      return monthYear.includes(query) || amount.includes(query);
    }

    return true;
  });

  const getStatusColor = (status: PaymentRecord['status']) => {
    switch (status) {
      case 'paid':
        return '#4caf50';
      case 'partial':
        return '#ff9800';
      case 'unpaid':
        return '#9e9e9e';
      case 'overdue':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusLabel = (status: PaymentRecord['status']) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'partial':
        return 'Partial';
      case 'unpaid':
        return 'Unpaid';
      case 'overdue':
        return 'Overdue';
      default:
        return status;
    }
  };

  const renderPaymentItem = ({ item }: { item: PaymentRecord }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('PaymentDetail', { payment: item })}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={styles.period}>
            {format(new Date(item.billingYear, item.billingMonth - 1), 'MMMM yyyy')}
          </Text>
          <Chip
            mode="flat"
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.statusText}
          >
            {getStatusLabel(item.status)}
          </Chip>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>
              Total Amount:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {item.totalAmount.toLocaleString('vi-VN')} ₫
            </Text>
          </View>

          {item.paidAmount > 0 && (
            <View style={styles.row}>
              <Text variant="bodyMedium" style={styles.label}>
                Paid Amount:
              </Text>
              <Text variant="bodyMedium" style={[styles.value, styles.paidAmount]}>
                {item.paidAmount.toLocaleString('vi-VN')} ₫
              </Text>
            </View>
          )}

          {item.status === 'partial' && (
            <View style={styles.row}>
              <Text variant="bodyMedium" style={styles.label}>
                Remaining:
              </Text>
              <Text variant="bodyMedium" style={[styles.value, styles.remaining]}>
                {(item.totalAmount - item.paidAmount).toLocaleString('vi-VN')} ₫
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.label}>
              Due Date:
            </Text>
            <Text variant="bodySmall" style={styles.value}>
              {format(new Date(item.dueDate), 'dd/MM/yyyy')}
            </Text>
          </View>

          {item.paidDate && (
            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.label}>
                Paid Date:
              </Text>
              <Text variant="bodySmall" style={styles.value}>
                {format(new Date(item.paidDate), 'dd/MM/yyyy')}
              </Text>
            </View>
          )}

          {item.paymentMethod && (
            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.label}>
                Method:
              </Text>
              <Text variant="bodySmall" style={styles.value}>
                {item.paymentMethod === 'cash'
                  ? 'Cash'
                  : item.paymentMethod === 'bank_transfer'
                  ? 'Bank Transfer'
                  : 'E-Wallet'}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Loading payment history...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="bodyLarge" style={styles.errorText}>
          Failed to load payment history
        </Text>
        <Button mode="contained" onPress={() => refetch()} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Statistics Summary */}
      {statistics && (
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total Revenue
                </Text>
                <Text variant="titleMedium" style={styles.statValue}>
                  {statistics.totalRevenue.toLocaleString('vi-VN')} ₫
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Paid
                </Text>
                <Text variant="titleMedium" style={[styles.statValue, { color: '#4caf50' }]}>
                  {statistics.paidCount}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Overdue
                </Text>
                <Text variant="titleMedium" style={[styles.statValue, { color: '#f44336' }]}>
                  {statistics.overdueCount}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <Searchbar
          placeholder="Search by month/year or amount"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <View style={styles.statusFilters}>
          <Chip
            selected={statusFilter === 'all'}
            onPress={() => setStatusFilter('all')}
            style={styles.filterChip}
          >
            All
          </Chip>
          <Chip
            selected={statusFilter === 'paid'}
            onPress={() => setStatusFilter('paid')}
            style={styles.filterChip}
          >
            Paid
          </Chip>
          <Chip
            selected={statusFilter === 'unpaid'}
            onPress={() => setStatusFilter('unpaid')}
            style={styles.filterChip}
          >
            Unpaid
          </Chip>
          <Chip
            selected={statusFilter === 'overdue'}
            onPress={() => setStatusFilter('overdue')}
            style={styles.filterChip}
          >
            Overdue
          </Chip>
        </View>
      </View>

      {/* Payment List */}
      <FlatList
        data={filteredPayments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No payment history found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
  },
  statsCard: {
    margin: 16,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontWeight: '600',
  },
  filtersContainer: {
    padding: 16,
    paddingTop: 8,
  },
  searchBar: {
    marginBottom: 12,
  },
  statusFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  period: {
    fontWeight: '600',
  },
  statusChip: {
    height: 32,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  cardBody: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: '500',
  },
  paidAmount: {
    color: '#4caf50',
  },
  remaining: {
    color: '#f57c00',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
});
