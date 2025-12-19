/**
 * Mock Room API
 * Fake data for development
 * 
 * BACKEND TODO: Implement these endpoints:
 * - GET    /api/rooms
 * - GET    /api/rooms/:id
 * - POST   /api/rooms
 * - PUT    /api/rooms/:id
 * - DELETE /api/rooms/:id
 * - GET    /api/rooms/search?q=...
 */

import { Room, CreateRoomDto, UpdateRoomDto, RoomFilters, RoomWithTenant } from '../types';

// Fake rooms data
let mockRooms: Room[] = [
  // Property 1: Nhà trọ Hòa Bình
  {
    id: 'room-1',
    propertyId: '1',
    roomCode: 'P101',
    roomName: 'Phòng 101',
    status: 'occupied',
    rentalPrice: 3000000,
    electricityFee: 3500,
    waterFee: 20000,
    garbageFee: 30000,
    parkingFee: 100000,
    currentTenantId: 'tenant-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'room-2',
    propertyId: '1',
    roomCode: 'P102',
    roomName: 'Phòng 102',
    status: 'occupied',
    rentalPrice: 3200000,
    electricityFee: 3500,
    waterFee: 20000,
    garbageFee: 30000,
    parkingFee: 100000,
    currentTenantId: 'tenant-2',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'room-3',
    propertyId: '1',
    roomCode: 'P103',
    roomName: 'Phòng 103',
    status: 'vacant',
    rentalPrice: 3000000,
    electricityFee: 3500,
    waterFee: 20000,
    garbageFee: 30000,
    parkingFee: 100000,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'room-4',
    propertyId: '1',
    roomCode: 'P201',
    roomName: 'Phòng 201',
    status: 'occupied',
    rentalPrice: 3500000,
    electricityFee: 3500,
    waterFee: 20000,
    garbageFee: 30000,
    parkingFee: 100000,
    currentTenantId: 'tenant-3',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'room-5',
    propertyId: '1',
    roomCode: 'P202',
    roomName: 'Phòng 202',
    status: 'maintenance',
    rentalPrice: 3500000,
    electricityFee: 3500,
    waterFee: 20000,
    garbageFee: 30000,
    parkingFee: 100000,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },

  // Property 2: Chung cư Mini An Phú
  {
    id: 'room-6',
    propertyId: '2',
    roomCode: 'A101',
    roomName: 'Căn A101',
    status: 'occupied',
    rentalPrice: 4000000,
    electricityFee: 3800,
    waterFee: 25000,
    garbageFee: 35000,
    parkingFee: 150000,
    currentTenantId: 'tenant-4',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'room-7',
    propertyId: '2',
    roomCode: 'A102',
    roomName: 'Căn A102',
    status: 'occupied',
    rentalPrice: 4200000,
    electricityFee: 3800,
    waterFee: 25000,
    garbageFee: 35000,
    parkingFee: 150000,
    currentTenantId: 'tenant-5',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'room-8',
    propertyId: '2',
    roomCode: 'B101',
    roomName: 'Căn B101',
    status: 'vacant',
    rentalPrice: 3800000,
    electricityFee: 3800,
    waterFee: 25000,
    garbageFee: 35000,
    parkingFee: 150000,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },

  // Property 3: Nhà trọ Sinh Viên
  {
    id: 'room-9',
    propertyId: '3',
    roomCode: 'SV01',
    roomName: 'Phòng SV01',
    status: 'occupied',
    rentalPrice: 2000000,
    electricityFee: 3200,
    waterFee: 18000,
    garbageFee: 25000,
    parkingFee: 80000,
    currentTenantId: 'tenant-6',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 'room-10',
    propertyId: '3',
    roomCode: 'SV02',
    roomName: 'Phòng SV02',
    status: 'occupied',
    rentalPrice: 2000000,
    electricityFee: 3200,
    waterFee: 18000,
    garbageFee: 25000,
    parkingFee: 80000,
    currentTenantId: 'tenant-7',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 'room-11',
    propertyId: '3',
    roomCode: 'SV03',
    roomName: 'Phòng SV03',
    status: 'vacant',
    rentalPrice: 2000000,
    electricityFee: 3200,
    waterFee: 18000,
    garbageFee: 25000,
    parkingFee: 80000,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
];

// Mock tenant data for rooms
const mockTenants: Record<string, { id: string; name: string; phone: string }> = {
  'tenant-1': { id: 'tenant-1', name: 'Nguyễn Văn A', phone: '0901234567' },
  'tenant-2': { id: 'tenant-2', name: 'Trần Thị B', phone: '0912345678' },
  'tenant-3': { id: 'tenant-3', name: 'Lê Văn C', phone: '0923456789' },
  'tenant-4': { id: 'tenant-4', name: 'Phạm Thị D', phone: '0934567890' },
  'tenant-5': { id: 'tenant-5', name: 'Hoàng Văn E', phone: '0945678901' },
  'tenant-6': { id: 'tenant-6', name: 'Vũ Thị F', phone: '0956789012' },
  'tenant-7': { id: 'tenant-7', name: 'Đặng Văn G', phone: '0967890123' },
};

const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

class MockRoomApiClient {
  /**
   * Get all rooms with filters
   */
  async getRooms(accessToken: string, filters?: RoomFilters): Promise<Room[]> {
    await delay();

    let filtered = [...mockRooms];

    // Filter by property
    if (filters?.propertyId) {
      filtered = filtered.filter((r) => r.propertyId === filters.propertyId);
    }

    // Filter by status
    if (filters?.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    // Search by code or name
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.roomCode.toLowerCase().includes(searchLower) ||
          r.roomName.toLowerCase().includes(searchLower)
      );
    }

    // Filter by price range
    if (filters?.minPrice !== undefined) {
      filtered = filtered.filter((r) => r.rentalPrice >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter((r) => r.rentalPrice <= filters.maxPrice!);
    }

    return filtered;
  }

  /**
   * Get room by ID
   */
  async getRoomById(accessToken: string, id: string): Promise<RoomWithTenant> {
    await delay();

    const room = mockRooms.find((r) => r.id === id);
    if (!room) {
      throw new Error('Room not found');
    }

    // Add tenant info if occupied
    const roomWithTenant: RoomWithTenant = { ...room };
    if (room.currentTenantId && mockTenants[room.currentTenantId]) {
      roomWithTenant.tenant = mockTenants[room.currentTenantId];
    }

    return roomWithTenant;
  }

  /**
   * Create a new room
   */
  async createRoom(accessToken: string, data: CreateRoomDto): Promise<Room> {
    await delay();

    // Check for duplicate room code in the same property
    const duplicate = mockRooms.find(
      (r) => r.propertyId === data.propertyId && r.roomCode === data.roomCode
    );
    if (duplicate) {
      throw new Error('Room code already exists in this property');
    }

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      ...data,
      status: 'vacant',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRooms.push(newRoom);
    return newRoom;
  }

  /**
   * Update room
   */
  async updateRoom(accessToken: string, id: string, data: UpdateRoomDto): Promise<Room> {
    await delay();

    const index = mockRooms.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Room not found');
    }

    // Check for duplicate room code if updating
    if (data.roomCode) {
      const duplicate = mockRooms.find(
        (r) =>
          r.id !== id &&
          r.propertyId === mockRooms[index].propertyId &&
          r.roomCode === data.roomCode
      );
      if (duplicate) {
        throw new Error('Room code already exists in this property');
      }
    }

    const updatedRoom: Room = {
      ...mockRooms[index],
      ...data,
      updatedAt: new Date(),
    };

    mockRooms[index] = updatedRoom;
    return updatedRoom;
  }

  /**
   * Delete room
   */
  async deleteRoom(accessToken: string, id: string): Promise<void> {
    await delay();

    const index = mockRooms.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Room not found');
    }

    // In real app, should archive payment history instead of deleting
    mockRooms.splice(index, 1);
  }

  /**
   * Search rooms
   */
  async searchRooms(accessToken: string, query: string, propertyId?: string): Promise<Room[]> {
    await delay();

    const searchLower = query.toLowerCase();
    let results = mockRooms.filter(
      (r) =>
        r.roomCode.toLowerCase().includes(searchLower) ||
        r.roomName.toLowerCase().includes(searchLower)
    );

    if (propertyId) {
      results = results.filter((r) => r.propertyId === propertyId);
    }

    return results;
  }
}

export const mockRoomApi = new MockRoomApiClient();
