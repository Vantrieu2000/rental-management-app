import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getDashboardStatistics } from '../api/dashboardApi';
import { DashboardStatistics } from '../types/dashboard.types';

const DASHBOARD_QUERY_KEY = ['dashboard', 'statistics'];

// Cache time: 5 minutes
const STALE_TIME = 5 * 60 * 1000;
const CACHE_TIME = 10 * 60 * 1000;

export const useDashboardStats = (): UseQueryResult<DashboardStatistics, Error> => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboardStatistics,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

// Export query key for manual invalidation
export { DASHBOARD_QUERY_KEY };
