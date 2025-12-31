/**
 * Dashboard Screen
 * Main dashboard showing property overview and statistics
 */

import React, { useMemo } from 'react';
import { ScrollView, RefreshControl, StyleSheet, View } from 'react-native';
import { Text, Divider, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { DashboardStackScreenProps } from '@/shared/types/navigation';
import { useDashboardStatistics, useRecentActivity, useOverduePayments } from '../hooks/useDashboard';
import {
  StatCard,
  ActivityItem,
  OverdueAlert,
  QuickActions,
  RevenueChart,
  OccupancyChart,
} from '../components';
import { Loading, ErrorState } from '@/shared/components';
import { RevenueData, OccupancyData } from '../types';

type Props = DashboardStackScreenProps<'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  // Fetch dashboard data
  const {
    data: statistics,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStatistics();

  const {
    data: recentActivity,
    isLoading: isLoadingActivity,
    error: activityError,
    refetch: refetchActivity,
  } = useRecentActivity(5);

  const {
    data: overduePayments,
    isLoading: isLoadingOverdue,
    error: overdueError,
    refetch: refetchOverdue,
  } = useOverduePayments();

  // Combined loading and error states
  const isLoading = isLoadingStats || isLoadingActivity || isLoadingOverdue;
  const error = statsError || activityError || overdueError;

  // Refresh handler
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchStats(), refetchActivity(), refetchOverdue()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Mock chart data (in production, this would come from API)
  const revenueData: RevenueData[] = useMemo(
    () => [
      { month: 'Jan', revenue: 120000000 },
      { month: 'Feb', revenue: 125000000 },
      { month: 'Mar', revenue: 118000000 },
      { month: 'Apr', revenue: 130000000 },
      { month: 'May', revenue: 126000000 },
      { month: 'Jun', revenue: 135000000 },
    ],
    []
  );

  const occupancyData: OccupancyData[] = useMemo(
    () => [
      { month: 'Jan', occupancyRate: 82 },
      { month: 'Feb', occupancyRate: 85 },
      { month: 'Mar', occupancyRate: 80 },
      { month: 'Apr', occupancyRate: 88 },
      { month: 'May', occupancyRate: 84 },
      { month: 'Jun', occupancyRate: 86 },
    ],
    []
  );

  // Quick actions
  const quickActions = useMemo(
    () => [
      {
        id: 'add-room',
        label: t('dashboard.addRoom', 'Add Room'),
        icon: 'home-plus' as const,
        color: '#2196F3',
        onPress: () => navigation.getParent()?.navigate('RoomsTab', { screen: 'RoomList' }),
      },
      {
        id: 'record-payment',
        label: t('dashboard.recordPayment', 'Record Payment'),
        icon: 'cash-plus' as const,
        color: '#4CAF50',
        onPress: () => navigation.getParent()?.navigate('PaymentsTab'),
      },
      {
        id: 'add-tenant',
        label: t('dashboard.addTenant', 'Add Tenant'),
        icon: 'account-plus' as const,
        color: '#FF9800',
        onPress: () => navigation.getParent()?.navigate('RoomsTab', { screen: 'RoomList' }),
      },
      {
        id: 'reports',
        label: t('dashboard.reports', 'Reports'),
        icon: 'file-chart' as const,
        color: '#9C27B0',
        onPress: () => navigation.getParent()?.navigate('ReportsTab'),
      },
    ],
    [navigation, t]
  );

  // Show loading state on initial load
  if (isLoading && !statistics) {
    return <Loading />;
  }

  // Show error state
  if (error && !statistics) {
    return (
      <ErrorState
        message={error.message}
        onRetry={() => {
          refetchStats();
          refetchActivity();
          refetchOverdue();
        }}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary]}
        />
      }
    >
      {/* Overdue Payments Alert */}
      {overduePayments && overduePayments.length > 0 && (
        <OverdueAlert
          overduePayments={overduePayments}
          onPress={() => navigation.getParent()?.navigate('NotificationsTab')}
        />
      )}

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Statistics Cards */}
      {statistics && (
        <View style={styles.statsContainer}>
          <StatCard
            title={t('dashboard.totalRooms', 'Total Rooms')}
            value={statistics.totalRooms}
            icon="home-group"
            color="#2196F3"
          />
          <StatCard
            title={t('dashboard.occupiedRooms', 'Occupied Rooms')}
            value={statistics.occupiedRooms}
            icon="home-account"
            color="#4CAF50"
            subtitle={`${statistics.occupancyRate}% occupancy`}
          />
          <StatCard
            title={t('dashboard.unpaidRooms', 'Unpaid Rooms')}
            value={statistics.unpaidRooms}
            icon="alert-circle"
            color="#F44336"
            subtitle={`${statistics.unpaidAmount.toLocaleString('vi-VN')} VND`}
          />
          <StatCard
            title={t('dashboard.totalRevenue', 'Total Revenue')}
            value={`${(statistics.totalRevenue / 1000000).toFixed(1)}M`}
            icon="cash-multiple"
            color="#9C27B0"
            subtitle="VND"
          />
        </View>
      )}

      {/* Charts */}
      <View style={styles.chartsContainer}>
        <RevenueChart data={revenueData} title={t('dashboard.revenueTrends', 'Revenue Trends')} />
        <OccupancyChart
          data={occupancyData}
          title={t('dashboard.occupancyRate', 'Occupancy Rate')}
        />
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          {t('dashboard.recentActivity', 'Recent Activity')}
        </Text>
        <Divider style={styles.divider} />
        {recentActivity && recentActivity.length > 0 ? (
          recentActivity.map((activity) => <ActivityItem key={activity.id} activity={activity} />)
        ) : (
          <Text variant="bodyMedium" style={styles.emptyText}>
            {t('dashboard.noRecentActivity', 'No recent activity')}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  statsContainer: {
    marginBottom: 16,
  },
  chartsContainer: {
    marginBottom: 16,
  },
  activityContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    marginVertical: 24,
  },
});
