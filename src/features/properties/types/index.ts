/**
 * Property Types
 */

export interface Property {
  id: string;
  name: string;
  address: string;
  totalRooms: number;

  // Default utility rates
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

export interface CreatePropertyDto {
  name: string;
  address: string;
  totalRooms: number;
  defaultElectricityRate: number;
  defaultWaterRate: number;
  defaultGarbageRate: number;
  defaultParkingRate: number;
  billingDayOfMonth: number;
  reminderDaysBefore: number;
}

export interface UpdatePropertyDto {
  name?: string;
  address?: string;
  totalRooms?: number;
  defaultElectricityRate?: number;
  defaultWaterRate?: number;
  defaultGarbageRate?: number;
  defaultParkingRate?: number;
  billingDayOfMonth?: number;
  reminderDaysBefore?: number;
}

export interface PropertyFilters {
  search?: string;
  ownerId?: string;
}

export interface PropertyStatistics {
  propertyId: string;
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  totalRevenue: number;
  unpaidAmount: number;
  occupancyRate: number;
}
