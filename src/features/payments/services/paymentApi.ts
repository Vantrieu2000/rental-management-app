/**
 * Payment API Client
 * Handles all payment-related API calls
 */

import { env } from '@/shared/config/env';
import {
  PaymentRecord,
  CreatePaymentDto,
  MarkPaidDto,
  PaymentFilters,
  FeeCalculation,
} from '../types';

class PaymentApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = env.apiUrl;
    this.timeout = env.apiTimeout;
  }

  async getPayments(accessToken: string, filters?: PaymentFilters): Promise<PaymentRecord[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const queryParams = new URLSearchParams();
      if (filters?.propertyId) queryParams.append('propertyId', filters.propertyId);
      if (filters?.roomId) queryParams.append('roomId', filters.roomId);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.startDate) queryParams.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) queryParams.append('endDate', filters.endDate.toISOString());

      const url = `${this.baseUrl}/payments${queryParams.toString() ? `?${queryParams}` : ''}`;

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
        throw new Error(error.message || 'Failed to fetch payments');
      }

      const data = await response.json();
      return data.payments;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getPaymentById(accessToken: string, id: string): Promise<PaymentRecord> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/payments/${id}`, {
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
        throw new Error(error.message || 'Failed to fetch payment');
      }

      const data = await response.json();
      return data.payment;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async createPayment(accessToken: string, data: CreatePaymentDto): Promise<PaymentRecord> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment');
      }

      const responseData = await response.json();
      return responseData.payment;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async markAsPaid(
    accessToken: string,
    id: string,
    data: MarkPaidDto
  ): Promise<PaymentRecord> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/payments/${id}/mark-paid`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to mark payment as paid');
      }

      const responseData = await response.json();
      return responseData.payment;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getOverduePayments(accessToken: string, propertyId: string): Promise<PaymentRecord[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/payments/overdue?propertyId=${propertyId}`, {
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
      return data.payments;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getPaymentHistory(accessToken: string, roomId: string): Promise<PaymentRecord[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/rooms/${roomId}/payment-history`, {
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
        throw new Error(error.message || 'Failed to fetch payment history');
      }

      const data = await response.json();
      return data.payments;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async calculateFees(
    accessToken: string,
    roomId: string,
    month: number,
    year: number
  ): Promise<FeeCalculation> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/payments/calculate-fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ roomId, month, year }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to calculate fees');
      }

      const data = await response.json();
      return data.calculation;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getPaymentStatistics(
    accessToken: string,
    propertyId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalRevenue: number;
    paidCount: number;
    unpaidCount: number;
    overdueCount: number;
    averagePaymentTime: number;
    latePaymentRate: number;
  }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const queryParams = new URLSearchParams({ propertyId });
      if (startDate) queryParams.append('startDate', startDate.toISOString());
      if (endDate) queryParams.append('endDate', endDate.toISOString());

      const response = await fetch(`${this.baseUrl}/payments/statistics?${queryParams}`, {
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
        throw new Error(error.message || 'Failed to fetch payment statistics');
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
}

export const paymentApi = new PaymentApiClient();

// Export mock API
export { mockPaymentApi } from './mockPaymentApi';

// Helper to get the right API client
export const getPaymentApi = () => {
  const { shouldUseMock } = require('@/shared/config/api.config');
  const useMock = shouldUseMock('payments');

  if (useMock) {
    const { mockPaymentApi } = require('./mockPaymentApi');
    return mockPaymentApi;
  }

  return paymentApi;
};
