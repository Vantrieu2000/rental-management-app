import { PropertyType } from '../constants/propertyTypes';

export interface Property {
  _id: string;
  id: string;
  name: string;
  address: string;
  type: PropertyType;
  totalRooms: number;
  
  // Default rates for utilities
  defaultElectricityRate?: number;
  defaultWaterRate?: number;
  defaultGarbageRate?: number;
  defaultParkingRate?: number;
  
  // Billing settings
  billingDayOfMonth?: number;
  reminderDaysBefore?: number;
  
  // Statistics (computed from rooms)
  occupiedRooms?: number;
  vacantRooms?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyDto {
  name: string;
  address: string;
  type?: PropertyType; // Optional - only for UI, not sent to backend
  totalRooms: number;
  defaultElectricityRate?: number;
  defaultWaterRate?: number;
  defaultGarbageRate?: number;
  defaultParkingRate?: number;
  billingDayOfMonth?: number;
  reminderDaysBefore?: number;
}

export interface UpdatePropertyDto {
  name?: string;
  address?: string;
  type?: PropertyType;
  totalRooms?: number;
  defaultElectricityRate?: number;
  defaultWaterRate?: number;
  defaultGarbageRate?: number;
  defaultParkingRate?: number;
  billingDayOfMonth?: number;
  reminderDaysBefore?: number;
}

export interface PropertyStatistics {
  totalProperties: number;
  totalRooms: number;
  totalOccupiedRooms: number;
  totalVacantRooms: number;
}
