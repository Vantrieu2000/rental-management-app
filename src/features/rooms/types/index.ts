/**
 * Room Types
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
  roomCode?: string;
  roomName?: string;
  status?: 'vacant' | 'occupied' | 'maintenance';
  rentalPrice?: number;
  electricityFee?: number;
  waterFee?: number;
  garbageFee?: number;
  parkingFee?: number;
}

export interface RoomFilters {
  propertyId?: string;
  status?: 'vacant' | 'occupied' | 'maintenance';
  search?: string;
  paymentStatus?: 'paid' | 'unpaid';
  minPrice?: number;
  maxPrice?: number;
}

export interface RoomWithTenant extends Room {
  tenant?: {
    id: string;
    name: string;
    phone: string;
  };
}
