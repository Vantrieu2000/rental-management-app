/**
 * Room Types
 * Type definitions for the Rooms Management feature
 */

// Room status types
export type RoomStatus = 'vacant' | 'occupied' | 'maintenance';
export type PaymentStatus = 'paid' | 'unpaid' | 'overdue';

// Current tenant information
export interface CurrentTenant {
  id: string;
  name: string;
  phone: string;
  moveInDate: string;
  paymentDueDay: number; // Day of month (1-31)
}

// Room entity
export interface Room {
  id: string;
  propertyId: string;
  roomCode: string;
  roomName: string;
  status: RoomStatus;

  // Pricing
  rentalPrice: number;
  electricityFee: number;
  waterFee: number;
  garbageFee: number;
  parkingFee: number;

  // Current tenant
  currentTenant?: CurrentTenant;

  // Payment info
  paymentStatus?: PaymentStatus;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Form Data Types
export interface CreateRoomDto {
  propertyId: string;
  roomCode: string;
  roomName: string;
  rentalPrice: number;
  electricityFee: number;
  waterFee: number;
  garbageFee: number;
  parkingFee: number;
}

export interface UpdateRoomDto {
  roomName?: string;
  rentalPrice?: number;
  electricityFee?: number;
  waterFee?: number;
  garbageFee?: number;
  parkingFee?: number;
}

export interface UpdateTenantDto {
  name?: string;
  phone?: string;
  moveInDate?: string;
  paymentDueDay?: number; // Day of month (1-31)
}

// Filter Types
export interface RoomFilters {
  propertyId?: string;
  status?: RoomStatus[];
  paymentStatus?: PaymentStatus[];
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// API Response Types
export interface RoomsResponse {
  data: Room[];
  total: number;
  page: number;
  limit: number;
}

export interface RoomResponse {
  data: Room;
}

// Payment record for room detail screen
export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  status: PaymentStatus;
}

// Extended room with payment history
export interface RoomWithPayments extends Room {
  paymentHistory?: PaymentRecord[];
}
