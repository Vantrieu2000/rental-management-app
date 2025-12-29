/**
 * Notifications Screen
 * Displays list of unpaid/overdue payments
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotifications, useNotificationSummary } from '../hooks/useNotifications';
import { NotificationCard } from '../components/NotificationCard';
import { NotificationFilters } from '../types';

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [filters, setFilters] = useState<NotificationFilters>({});

  const { data: notifications, isLoading, refetch, isRefetching } = useNotifications(filters);
  const { data: summary } = useNotificationSummary(filters.propertyId);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Handle notification press - navigate to payment details
  const handleNotificationPress = (notificationId: string) => {
    // TODO: Navigate to payment details or record payment screen
    // navigation.navigate('RecordPayment', { paymentId: notification.paymentId });
  };

  // Render summary header
  const renderSummary = () => {
    if (!summary) return null;

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Payment Overview</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.totalUnpaid}</Text>
            <Text style={styles.summaryLabel}>Unpaid</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, styles.overdueValue]}>
              {summary.totalOverdue}
            </Text>
            <Text style={styles.summaryLabel}>Overdue</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, styles.amountValue]}>
              {formatCurrency(summary.totalAmount)}
            </Text>
            <Text style={styles.summaryLabel}>Total Due</Text>
          </View>
        </View>
        {summary.mostOverdueDays > 0 && (
          <View style={styles.alertBanner}>
            <Text style={styles.alertText}>
              ⚠️ Most overdue payment: {summary.mostOverdueDays} days
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Render filter buttons
  const renderFilters = () => {
    return (
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, !filters.status && styles.filterButtonActive]}
          onPress={() => setFilters({ ...filters, status: undefined })}
        >
          <Text
            style={[styles.filterButtonText, !filters.status && styles.filterButtonTextActive]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.status === 'unpaid' && styles.filterButtonActive,
          ]}
          onPress={() => setFilters({ ...filters, status: 'unpaid' })}
        >
          <Text
            style={[
              styles.filterButtonText,
              filters.status === 'unpaid' && styles.filterButtonTextActive,
            ]}
          >
            Unpaid
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.status === 'partial' && styles.filterButtonActive,
          ]}
          onPress={() => setFilters({ ...filters, status: 'partial' })}
        >
          <Text
            style={[
              styles.filterButtonText,
              filters.status === 'partial' && styles.filterButtonTextActive,
            ]}
          >
            Partial
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.minDaysOverdue !== undefined && styles.filterButtonActive,
          ]}
          onPress={() =>
            setFilters({
              ...filters,
              minDaysOverdue: filters.minDaysOverdue === undefined ? 1 : undefined,
            })
          }
        >
          <Text
            style={[
              styles.filterButtonText,
              filters.minDaysOverdue !== undefined && styles.filterButtonTextActive,
            ]}
          >
            Overdue
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>✓</Text>
        <Text style={styles.emptyTitle}>All caught up!</Text>
        <Text style={styles.emptyText}>No unpaid or overdue payments at the moment.</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            onPress={() => handleNotificationPress(item.id)}
          />
        )}
        ListHeaderComponent={
          <>
            {renderSummary()}
            {renderFilters()}
            {notifications && notifications.length > 0 && (
              <Text style={styles.listTitle}>
                {notifications.length} {notifications.length === 1 ? 'Notification' : 'Notifications'}
              </Text>
            )}
          </>
        }
        ListEmptyComponent={renderEmptyState()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={['#2196F3']} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#757575',
  },
  listContent: {
    padding: 16,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 4,
  },
  overdueValue: {
    color: '#D32F2F',
  },
  amountValue: {
    fontSize: 16,
    color: '#212121',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  alertBanner: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F57C00',
  },
  alertText: {
    fontSize: 14,
    color: '#E65100',
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
});
