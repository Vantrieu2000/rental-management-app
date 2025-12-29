/**
 * Payment Types
 */

export interface PaymentRecord {
  id: string;
  roomId: string;
  tenantId: string;
  propertyId: string;

  // Billing period
  billingMonth: number;
  billingYear: number;
  dueDate: Date;

  // Amounts
  rentalAmount: number;
  electricityAmount: number;
  waterAmount: number;
  garbageAmount: number;
  parkingAmount: number;
  adjustments: number;
  totalAmount: number;

  // Payment info
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  paidAmount: number;
  paidDate?: Date;
  paymentMethod?: 'cash' | 'bank_transfer' | 'e_wallet';
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface FeeCalculation {
  rentalAmount: number;
  electricityAmount: number;
  waterAmount: number;
  garbageAmount: number;
  parkingAmount: number;
  adjustments: number;
  totalAmount: number;
}

export interface ItemizedBill {
  roomCode: string;
  roomName: string;
  tenantName: string;
  billingPeriod: string;
  dueDate: Date;
  items: BillItem[];
  adjustments: number;
  totalAmount: number;
}

export interface BillItem {
  description: string;
  amount: number;
}

export interface RateHistory {
  id: string;
  roomId: string;
  propertyId: string;
  effectiveDate: Date;
  electricityRate: number;
  waterRate: number;
  garbageRate: number;
  parkingRate: number;
  createdAt: Date;
}

export interface CreatePaymentDto {
  roomId: string;
  tenantId: string;
  propertyId: string;
  billingMonth: number;
  billingYear: number;
  dueDate: Date;
  feeCalculation: FeeCalculation;
}

export interface MarkPaidDto {
  paidAmount: number;
  paidDate: Date;
  paymentMethod: 'cash' | 'bank_transfer' | 'e_wallet';
  notes?: string;
}

export interface PaymentFilters {
  propertyId?: string;
  roomId?: string;
  status?: PaymentRecord['status'];
  startDate?: Date;
  endDate?: Date;
}
