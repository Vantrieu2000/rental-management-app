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

// Fake rooms data - EMPTY (use real backend)
let mockRooms: Room[] = [];

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
  async getRooms(accessToken: string, filters?: RoomFilters): Promise<{ data: Room[]; total: number }> {
    await delay();

    let filtered = [...mockRooms];

    // Filter by property
    if (filters?.propertyId) {
      filtered = filtered.filter((r) => r.propertyId === filters.propertyId);
    }

    // Filter by status
    if (filters?.status && filters.status.length > 0) {
      filtered = filtered.filter((r) => filters.status!.includes(r.status));
    }

    // Filter by payment status (mock - just return all for now)
    // In real app, this would check payment records

    // Search by code, name, or tenant
    if (filters?.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.roomCode.toLowerCase().includes(searchLower) ||
          r.roomName.toLowerCase().includes(searchLower) ||
          (r.currentTenantId && mockTenants[r.currentTenantId]?.name.toLowerCase().includes(searchLower))
      );
    }

    // Filter by price range
    if (filters?.minPrice !== undefined) {
      filtered = filtered.filter((r) => r.rentalPrice >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter((r) => r.rentalPrice <= filters.maxPrice!);
    }

    return {
      data: filtered,
      total: filtered.length,
    };
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

  /**
   * Reset mock data (for testing)
   */
  resetMockData(): void {
    mockRooms = [];
  }

  /**
   * Add test room data directly (for testing)
   */
  addTestRoom(room: Room): void {
    mockRooms.push(room);
  }
}

export const mockRoomApi = new MockRoomApiClient();
