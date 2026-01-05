import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatCard } from '../components/StatCard';
import { OccupancyIndicator } from '../components/OccupancyIndicator';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguageStore } from '@/store/languageStore';

export const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch, isRefetching } = useDashboardStats();
  const { loadLanguage } = useLanguageStore();

  // Load saved language preference on mount
  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  const handleRefresh = () => {
    refetch();
  };

  const formatLastUpdated = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>{t('dashboard.loading')}</Text>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{t('dashboard.error')}</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <Button mode="contained" onPress={handleRefresh} style={styles.retryButton}>
          {t('dashboard.retry')}
        </Button>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <Text>{t('dashboard.noData')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            {t('dashboard.title')}
          </Text>
          <Text variant="bodySmall" style={styles.lastUpdated}>
            {t('dashboard.lastUpdated', {
              time: formatLastUpdated(data.timestamp),
            })}
          </Text>
        </View>

        {/* Statistics Cards */}
        <StatCard
          icon="home-city"
          label={t('dashboard.totalProperties')}
          value={data.totalProperties}
          color="#2196F3"
          format="number"
        />

        <StatCard
          icon="door"
          label={t('dashboard.totalRooms')}
          value={data.totalRooms}
          color="#9C27B0"
          format="number"
        />

        <StatCard
          icon="door-open"
          label={t('dashboard.occupiedRooms')}
          value={data.occupiedRooms}
          color="#4CAF50"
          format="number"
        />

        <StatCard
          icon="account-group"
          label={t('dashboard.totalTenants')}
          value={data.totalTenants}
          color="#FF9800"
          format="number"
        />

        <StatCard
          icon="cash-multiple"
          label={t('dashboard.currentMonthRevenue')}
          value={data.currentMonthRevenue}
          color="#4CAF50"
          format="currency"
        />

        <StatCard
          icon="clock-alert-outline"
          label={t('dashboard.pendingPayments')}
          value={data.pendingPayments}
          color="#FF9800"
          format="currency"
        />

        <StatCard
          icon="alert-circle"
          label={t('dashboard.overduePayments')}
          value={data.overduePayments}
          color="#F44336"
          format="currency"
        />

        {/* Occupancy Indicator */}
        <OccupancyIndicator rate={data.occupancyRate} />

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lastUpdated: {
    opacity: 0.6,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  bottomSpacing: {
    height: 24,
  },
});
