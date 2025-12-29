/**
 * Notification Hooks
 * TanStack Query hooks for notification data
 */

import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../services/notificationApi';
import { NotificationFilters } from '../types';

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: NotificationFilters) => [...notificationKeys.lists(), filters] as const,
  summary: (propertyId?: string) => [...notificationKeys.all, 'summary', propertyId] as const,
};

/**
 * Hook to fetch notifications
 */
export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: async () => {
      // TODO: Get real access token from auth store
      const accessToken = 'mock-token';
      return notificationApi.getNotifications(accessToken, filters);
    },
    // Refetch every 30 seconds to keep notifications up to date
    refetchInterval: 30000,
  });
}

/**
 * Hook to fetch notification summary
 */
export function useNotificationSummary(propertyId?: string) {
  return useQuery({
    queryKey: notificationKeys.summary(propertyId),
    queryFn: async () => {
      const accessToken = 'mock-token';
      return notificationApi.getNotificationSummary(accessToken, propertyId);
    },
    // Refetch every 30 seconds
    refetchInterval: 30000,
  });
}
