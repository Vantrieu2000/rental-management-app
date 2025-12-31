/**
 * Tenant Portal Types
 */

export interface TenantRoomInfo {
  id: string;
  roomCode: string;
  roomName: string;
  propertyName: string;
  propertyAddress: string;
  rentalPrice: number;
  electricityFee: number;
  waterFee: number;
  garbageFee: number;
  parkingFee: number;
  tenant: {
    name: string;
    phone: string;
    moveInDate: string;
    paymentDueDay: number;
  };
}

export interface TenantPaymentInfo {
  id: string;
  billingMonth: number;
  billingYear: number;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'unpaid' | 'partial' | 'overdue';
  rentalAmount: number;
  electricityAmount: number;
  waterAmount: number;
  garbageAmount: number;
  parkingAmount: number;
  adjustments: number;
}

export interface TenantPaymentHistory {
  id: string;
  billingMonth: number;
  billingYear: number;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'unpaid' | 'partial' | 'overdue';
  paidDate?: string;
}

export interface TenantPaymentResult {
  room: TenantRoomInfo;
  latestPayment: TenantPaymentInfo | null;
  paymentHistory: TenantPaymentHistory[];
}

export interface CheckPaymentDto {
  phone: string;
}
