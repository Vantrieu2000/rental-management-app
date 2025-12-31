/**
 * Dashboard Hooks
 * Custom hooks for dashboard data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { getDashboardApi } from '../services/dashboardApi';
import { DashboardStatistics, RecentActivity, OverduePayment } from '../types';

const dashboardApi = getDashboardApi();

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  statistics: (propertyId?: string) => [...dashboardKeys.all, 'statistics', propertyId] as const,
  recentActivity: (propertyId?: string, limit?: number) =>
    [...dashboardKeys.all, 'recent-activity', propertyId, limit] as const,
  overduePayments: (propertyId?: string) =>
    [...dashboardKeys.all, 'overdue-payments', propertyId] as const,
};

/**
 * Hook to fetch dashboard statistics
 */
export function useDashboardStatistics() {
  const token = useAuthStore((state) => state.token);
  const selectedPropertyId = useUIStore((state) => state.selectedPropertyId);

  return useQuery<DashboardStatistics, Error>({
    queryKey: dashboardKeys.statistics(selectedPropertyId || undefined),
    queryFn: async () => {
      if (!token) throw new Error('No authentication token');
      return dashboardApi.getDashboardStatistics(token, selectedPropertyId || undefined);
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch recent activity
 */
export function useRecentActivity(limit: number = 10) {
  const token = useAuthStore((state) => state.token);
  const selectedPropertyId = useUIStore((state) => state.selectedPropertyId);

  return useQuery<RecentActivity[], Error>({
    queryKey: dashboardKeys.recentActivity(selectedPropertyId || undefined, limit),
    queryFn: async () => {
      if (!token) throw new Error('No authentication token');
      return dashboardApi.getRecentActivity(token, selectedPropertyId || undefined, limit);
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch overdue payments
 */
export function useOverduePayments() {
  const token = useAuthStore((state) => state.token);
  const selectedPropertyId = useUIStore((state) => state.selectedPropertyId);

  return useQuery<OverduePayment[], Error>({
    queryKey: dashboardKeys.overduePayments(selectedPropertyId || undefined),
    queryFn: async () => {
      if (!token) throw new Error('No authentication token');
      return dashboardApi.getOverduePayments(token, selectedPropertyId || undefined);
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
