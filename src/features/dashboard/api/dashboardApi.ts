import { apiClient } from '@/infrastructure/api/client';
import { DashboardStatistics } from '../types/dashboard.types';
import i18n from '@/infrastructure/i18n/config';

/**
 * Get dashboard statistics for the current user
 */
export const getDashboardStatistics = async (): Promise<DashboardStatistics> => {
  try {
    // Get current language for Accept-Language header
    const currentLanguage = i18n.language || 'en';
    
    const response = await apiClient.get<DashboardStatistics>(
      '/dashboard/statistics',
      {
        headers: {
          'Accept-Language': currentLanguage,
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch dashboard statistics:', error);
    throw error;
  }
};
