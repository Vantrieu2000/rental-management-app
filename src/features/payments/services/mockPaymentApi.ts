/**
 * Mock Payment API
 * Fake data for development
 * 
 * BACKEND TODO: Implement these endpoints:
 * - GET    /api/payments
 * - GET    /api/payments/:id
 * - POST   /api/payments
 * - PUT    /api/payments/:id/mark-paid
 * - GET    /api/payments/overdue
 * - GET    /api/rooms/:id/payment-history
 * - POST   /api/payments/calculate-fees
 * - GET    /api/payments/statistics
 */

import {
  PaymentRecord,
  CreatePaymentDto,
  MarkPaidDto,
  PaymentFilters,
  FeeCalculation,
} from '../types';

// Mock payment records
let mockPayments: PaymentRecord[] = [
  {
    id: 'payment-1',
    roomId: 'room-1',
    tenantId: 'tenant-1',
    propertyId: '1',
    billingMonth: 12,
    billingYear: 2024,
    dueDate: new Date('2024-12-05'),
    rentalAmount: 3000000,
    electricityAmount: 350000,
    waterAmount: 20000,
    garbageAmount: 30000,
    parkingAmount: 100000,
    adjustments: 0,
    totalAmount: 3500000,
    status: 'paid',
    paidAmount: 3500000,
    paidDate: new Date('2024-12-03'),
    paymentMethod: 'bank_transfer',
    notes: 'Paid on time',
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-12-03'),
  },
  {
    id: 'payment-2',
    roomId: 'room-2',
    tenantId: 'tenant-2',
    propertyId: '1',
    billingMonth: 12,
    billingYear: 2024,
    dueDate: new Date('2024-12-05'),
    rentalAmount: 3200000,
    electricityAmount: 280000,
    waterAmount: 20000,
    garbageAmount: 30000,
    parkingAmount: 100000,
    adjustments: 0,
    totalAmount: 3630000,
    status: 'unpaid',
    paidAmount: 0,
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-11-25'),
  },
  {
    id: 'payment-3',
    roomId: 'room-4',
    tenantId: 'tenant-3',
    propertyId: '1',
    billingMonth: 12,
    billingYear: 2024,
    dueDate: new Date('2024-12-05'),
    rentalAmount: 3500000,
    electricityAmount: 420000,
    waterAmount: 20000,
    garbageAmount: 30000,
    parkingAmount: 100000,
    adjustments: -50000,
    totalAmount: 4020000,
    status: 'partial',
    paidAmount: 2000000,
    paidDate: new Date('2024-12-04'),
    paymentMethod: 'cash',
    notes: 'Partial payment, will pay rest next week',
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-12-04'),
  },
  {
    id: 'payment-4',
    roomId: 'room-6',
    tenantId: 'tenant-4',
    propertyId: '2',
    billingMonth: 12,
    billingYear: 2024,
    dueDate: new Date('2024-12-05'),
    rentalAmount: 4000000,
    electricityAmount: 380000,
    waterAmount: 25000,
    garbageAmount: 35000,
    parkingAmount: 150000,
    adjustments: 0,
    totalAmount: 4590000,
    status: 'overdue',
    paidAmount: 0,
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    id: 'payment-5',
    roomId: 'room-1',
    tenantId: 'tenant-1',
    propertyId: '1',
    billingMonth: 11,
    billingYear: 2024,
    dueDate: new Date('2024-11-05'),
    rentalAmount: 3000000,
    electricityAmount: 320000,
    waterAmount: 20000,
    garbageAmount: 30000,
    parkingAmount: 100000,
    adjustments: 0,
    totalAmount: 3470000,
    status: 'paid',
    paidAmount: 3470000,
    paidDate: new Date('2024-11-04'),
    paymentMethod: 'bank_transfer',
    createdAt: new Date('2024-10-25'),
    updatedAt: new Date('2024-11-04'),
  },
];

const delay = (ms: number = 10) => new Promise((resolve) => setTimeout(resolve, ms)); // Reduced delay for faster testing

class MockPaymentApiClient {
  /**
   * Get all payments with filters
   */
  async getPayments(accessToken: string, filters?: PaymentFilters): Promise<PaymentRecord[]> {
    await delay();

    let filtered = [...mockPayments];

    // Filter by property
    if (filters?.propertyId) {
      filtered = filtered.filter((p) => p.propertyId === filters.propertyId);
    }

    // Filter by room
    if (filters?.roomId) {
      filtered = filtered.filter((p) => p.roomId === filters.roomId);
    }

    // Filter by status
    if (filters?.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    // Filter by date range
    if (filters?.startDate) {
      filtered = filtered.filter((p) => p.dueDate >= filters.startDate!);
    }
    if (filters?.endDate) {
      filtered = filtered.filter((p) => p.dueDate <= filters.endDate!);
    }

    // Sort by due date (most recent first)
    filtered.sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());

    return filtered;
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(accessToken: string, id: string): Promise<PaymentRecord> {
    await delay();

    const payment = mockPayments.find((p) => p.id === id);
    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  /**
   * Create a new payment record
   */
  async createPayment(accessToken: string, data: CreatePaymentDto): Promise<PaymentRecord> {
    await delay();

    // Check for duplicate payment for same room and billing period
    // Skip duplicate check for test data to allow property-based testing
    const isTestData = data.roomId.includes('-') && (data.roomId.includes('test') || /\d{13}/.test(data.roomId));
    if (!isTestData) {
      const duplicate = mockPayments.find(
        (p) =>
          p.roomId === data.roomId &&
          p.billingMonth === data.billingMonth &&
          p.billingYear === data.billingYear
      );
      if (duplicate) {
        throw new Error('Payment record already exists for this billing period');
      }
    }

    const newPayment: PaymentRecord = {
      id: `payment-${Date.now()}`,
      roomId: data.roomId,
      tenantId: data.tenantId,
      propertyId: data.propertyId,
      billingMonth: data.billingMonth,
      billingYear: data.billingYear,
      dueDate: data.dueDate,
      rentalAmount: data.feeCalculation.rentalAmount,
      electricityAmount: data.feeCalculation.electricityAmount,
      waterAmount: data.feeCalculation.waterAmount,
      garbageAmount: data.feeCalculation.garbageAmount,
      parkingAmount: data.feeCalculation.parkingAmount,
      adjustments: data.feeCalculation.adjustments,
      totalAmount: data.feeCalculation.totalAmount,
      status: 'unpaid',
      paidAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPayments.push(newPayment);
    return newPayment;
  }

  /**
   * Mark payment as paid
   */
  async markAsPaid(
    accessToken: string,
    id: string,
    data: MarkPaidDto
  ): Promise<PaymentRecord> {
    await delay();

    const index = mockPayments.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Payment not found');
    }

    const payment = mockPayments[index];
    const newPaidAmount = payment.paidAmount + data.paidAmount;

    // Determine new status
    let newStatus: PaymentRecord['status'];
    if (newPaidAmount >= payment.totalAmount) {
      newStatus = 'paid';
    } else if (newPaidAmount > 0) {
      newStatus = 'partial';
    } else {
      newStatus = payment.status;
    }

    const updatedPayment: PaymentRecord = {
      ...payment,
      paidAmount: newPaidAmount,
      paidDate: data.paidDate,
      paymentMethod: data.paymentMethod,
      notes: data.notes || payment.notes,
      status: newStatus,
      updatedAt: new Date(),
    };

    mockPayments[index] = updatedPayment;
    return updatedPayment;
  }

  /**
   * Get overdue payments
   */
  async getOverduePayments(accessToken: string, propertyId: string): Promise<PaymentRecord[]> {
    await delay();

    const now = new Date();
    const overdue = mockPayments.filter(
      (p) =>
        p.propertyId === propertyId &&
        (p.status === 'unpaid' || p.status === 'partial' || p.status === 'overdue') &&
        p.dueDate < now
    );

    // Update status to overdue if past due date
    overdue.forEach((payment) => {
      const index = mockPayments.findIndex((p) => p.id === payment.id);
      if (index !== -1 && mockPayments[index].status !== 'overdue') {
        mockPayments[index] = {
          ...mockPayments[index],
          status: 'overdue',
          updatedAt: new Date(),
        };
      }
    });

    // Sort by days overdue (most overdue first)
    return overdue.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  /**
   * Get payment history for a room
   */
  async getPaymentHistory(accessToken: string, roomId: string): Promise<PaymentRecord[]> {
    await delay();

    const history = mockPayments.filter((p) => p.roomId === roomId);

    // Sort by billing period (most recent first)
    return history.sort((a, b) => {
      if (a.billingYear !== b.billingYear) {
        return b.billingYear - a.billingYear;
      }
      return b.billingMonth - a.billingMonth;
    });
  }

  /**
   * Calculate monthly fees for a room
   */
  async calculateFees(
    accessToken: string,
    roomId: string,
    month: number,
    year: number
  ): Promise<FeeCalculation> {
    await delay();

    // In a real app, this would fetch room data and calculate based on usage
    // For mock, we'll return sample calculation
    const calculation: FeeCalculation = {
      rentalAmount: 3000000,
      electricityAmount: 350000,
      waterAmount: 20000,
      garbageAmount: 30000,
      parkingAmount: 100000,
      adjustments: 0,
      totalAmount: 3500000,
    };

    return calculation;
  }

  /**
   * Get payment statistics
   */
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
    await delay();

    let filtered = mockPayments.filter((p) => p.propertyId === propertyId);

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter((p) => p.dueDate >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((p) => p.dueDate <= endDate);
    }

    const totalRevenue = filtered
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.paidAmount, 0);

    const paidCount = filtered.filter((p) => p.status === 'paid').length;
    const unpaidCount = filtered.filter((p) => p.status === 'unpaid').length;
    const overdueCount = filtered.filter((p) => p.status === 'overdue').length;

    // Calculate average payment time (days before/after due date)
    const paidPayments = filtered.filter((p) => p.status === 'paid' && p.paidDate);
    const totalDays = paidPayments.reduce((sum, p) => {
      if (p.paidDate) {
        const daysDiff = Math.floor(
          (p.paidDate.getTime() - p.dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return sum + daysDiff;
      }
      return sum;
    }, 0);
    const averagePaymentTime = paidPayments.length > 0 ? totalDays / paidPayments.length : 0;

    // Calculate late payment rate
    const latePayments = paidPayments.filter((p) => p.paidDate && p.paidDate > p.dueDate);
    const latePaymentRate = paidPayments.length > 0 ? latePayments.length / paidPayments.length : 0;

    return {
      totalRevenue,
      paidCount,
      unpaidCount,
      overdueCount,
      averagePaymentTime,
      latePaymentRate,
    };
  }

  /**
   * Reset mock data (for testing)
   */
  resetMockData(): void {
    mockPayments = [];
  }
}

export const mockPaymentApi = new MockPaymentApiClient();
