/**
 * Dashboard API Client
 * Handles all dashboard-related API calls
 */

import { env } from '@/shared/config/env';
import { DashboardStatistics, RecentActivity, OverduePayment } from '../types';

class DashboardApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = env.apiUrl;
    this.timeout = env.apiTimeout;
  }

  async getDashboardStatistics(
    accessToken: string,
    propertyId?: string
  ): Promise<DashboardStatistics> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const queryParams = new URLSearchParams();
      if (propertyId) queryParams.append('propertyId', propertyId);

      const url = `${this.baseUrl}/dashboard/statistics${queryParams.toString() ? `?${queryParams}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch dashboard statistics');
      }

      const data = await response.json();
      return data.statistics;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getRecentActivity(
    accessToken: string,
    propertyId?: string,
    limit: number = 10
  ): Promise<RecentActivity[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const queryParams = new URLSearchParams({ limit: limit.toString() });
      if (propertyId) queryParams.append('propertyId', propertyId);

      const url = `${this.baseUrl}/dashboard/recent-activity?${queryParams}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch recent activity');
      }

      const data = await response.json();
      return data.activities;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getOverduePayments(
    accessToken: string,
    propertyId?: string
  ): Promise<OverduePayment[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const queryParams = new URLSearchParams();
      if (propertyId) queryParams.append('propertyId', propertyId);

      const url = `${this.baseUrl}/dashboard/overdue-payments${queryParams.toString() ? `?${queryParams}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch overdue payments');
      }

      const data = await response.json();
      return data.overduePayments;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}

export const dashboardApi = new DashboardApiClient();

// Export mock API
export { mockDashboardApi } from './mockDashboardApi';

// Helper to get the right API client
export const getDashboardApi = () => {
  const { shouldUseMock } = require('@/shared/config/api.config');
  const useMock = shouldUseMock('dashboard');

  if (useMock) {
    const { mockDashboardApi } = require('./mockDashboardApi');
    return mockDashboardApi;
  }

  return dashboardApi;
};
