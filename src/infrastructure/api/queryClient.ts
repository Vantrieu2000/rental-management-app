/**
 * TanStack Query Client Configuration
 * Centralized configuration for React Query
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { AppError, ErrorCode } from './types';

/**
 * Default query options
 */
const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Stale time: 5 minutes
    staleTime: 5 * 60 * 1000,

    // Cache time: 10 minutes
    gcTime: 10 * 60 * 1000,

    // Retry configuration
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof AppError && error.code === ErrorCode.UNAUTHORIZED) {
        return false;
      }

      // Don't retry on validation errors
      if (error instanceof AppError && error.code === ErrorCode.VALIDATION_ERROR) {
        return false;
      }

      // Don't retry on 404 errors
      if (error instanceof AppError && error.code === ErrorCode.NOT_FOUND) {
        return false;
      }

      // Retry up to 2 times for other errors
      return failureCount < 2;
    },

    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch on window focus in production
    refetchOnWindowFocus: process.env.NODE_ENV === 'production',

    // Refetch on reconnect
    refetchOnReconnect: true,

    // Don't refetch on mount by default
    refetchOnMount: false,
  },
  mutations: {
    // Retry mutations once
    retry: 1,

    // Retry delay for mutations
    retryDelay: 1000,
  },
};

/**
 * Create and configure Query Client
 */
export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: defaultQueryOptions,
  });
};

/**
 * Singleton Query Client instance
 */
export const queryClient = createQueryClient();

/**
 * Query client utilities
 */
export const queryClientUtils = {
  /**
   * Invalidate all queries for a specific entity
   */
  invalidateEntity: (entity: string) => {
    return queryClient.invalidateQueries({ queryKey: [entity] });
  },

  /**
   * Clear all cached data
   */
  clearCache: () => {
    return queryClient.clear();
  },

  /**
   * Remove specific queries
   */
  removeQueries: (queryKey: readonly unknown[]) => {
    return queryClient.removeQueries({ queryKey });
  },

  /**
   * Prefetch a query
   */
  prefetch: async <T>(
    queryKey: readonly unknown[],
    queryFn: () => Promise<T>,
    options?: { staleTime?: number }
  ) => {
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: options?.staleTime,
    });
  },

  /**
   * Set query data manually
   */
  setQueryData: <T>(queryKey: readonly unknown[], data: T) => {
    return queryClient.setQueryData(queryKey, data);
  },

  /**
   * Get query data
   */
  getQueryData: <T>(queryKey: readonly unknown[]): T | undefined => {
    return queryClient.getQueryData(queryKey);
  },

  /**
   * Cancel queries
   */
  cancelQueries: (queryKey: readonly unknown[]) => {
    return queryClient.cancelQueries({ queryKey });
  },
};
