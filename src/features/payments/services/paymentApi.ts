/**
 * Payment API Service
 * Handles all payment-related API calls
 */

import { env } from '@/shared/config/env';

export interface RecordUsageDto {
  electricityUsage: number;
  waterUsage: number;
  previousElectricityReading?: number;
  currentElectricityReading?: number;
  previousWaterReading?: number;
  currentWaterReading?: number;
  adjustments?: number;
  notes?: string;
}

export interface Payment {
  _id: string;
  roomId: string;
  tenantId: string;
  propertyId: string;
  billingMonth: number;
  billingYear: number;
  dueDate: string;
  rentalAmount: number;
  electricityAmount: number;
  waterAmount: number;
  garbageAmount: number;
  parkingAmount: number;
  adjustments: number;
  totalAmount: number;
  status: string;
  paidAmount: number;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
  electricityUsage: number;
  waterUsage: number;
  previousElectricityReading: number;
  currentElectricityReading: number;
  previousWaterReading: number;
  currentWaterReading: number;
  createdAt: string;
  updatedAt: string;
}

class PaymentApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.apiUrl;
  }

  /**
   * Record utility usage for a room
   */
  async recordUsage(
    accessToken: string,
    roomId: string,
    usageData: RecordUsageDto,
  ): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/payments/usage?roomId=${roomId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(usageData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to record usage');
    }

    return response.json();
  }

  /**
   * Get payment history for a room
   */
  async getPaymentHistory(
    accessToken: string,
    roomId: string,
    limit?: number,
  ): Promise<Payment[]> {
    const url = new URL(`${this.baseUrl}/payments/history/${roomId}`);
    if (limit) {
      url.searchParams.append('limit', limit.toString());
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get payment history');
    }

    return response.json();
  }

  /**
   * Update payment usage for an existing payment
   */
  async updatePaymentUsage(
    accessToken: string,
    paymentId: string,
    usageData: RecordUsageDto,
  ): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/payments/${paymentId}/usage`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(usageData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update usage');
    }

    return response.json();
  }

  /**
   * Mark payment as paid
   */
  async markAsPaid(
    accessToken: string,
    paymentId: string,
    paidAmount?: number,
    paymentMethod?: string,
    notes?: string,
  ): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/payments/${paymentId}/mark-paid`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        paidAmount,
        paidDate: new Date().toISOString(),
        paymentMethod,
        notes,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to mark as paid');
    }

    return response.json();
  }
}

export const paymentApi = new PaymentApi();

// Singleton getter
export const getPaymentApi = () => paymentApi;
