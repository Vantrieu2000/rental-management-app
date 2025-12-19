/**
 * Core entity types for the rental management application
 */

export interface Room {
  id: string;
  propertyId: string;
  roomCode: string;
  roomName: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  
  // Pricing
  rentalPrice: number;
  electricityFee: number;
  waterFee: number;
  garbageFee: number;
  parkingFee: number;
  
  // Current tenant
  currentTenantId?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email?: string;
  idNumber?: string;
  
  // Rental info
  roomId: string;
  moveInDate: Date;
  moveOutDate?: Date;
  
  // Emergency contact
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

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

export interface Property {
  id: string;
  name: string;
  address: string;
  totalRooms: number;
  
  // Default rates
  defaultElectricityRate: number;
  defaultWaterRate: number;
  defaultGarbageRate: number;
  defaultParkingRate: number;
  
  // Billing settings
  billingDayOfMonth: number;
  reminderDaysBefore: number;
  
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
