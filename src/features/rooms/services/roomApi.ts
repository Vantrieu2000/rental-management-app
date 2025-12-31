/**
 * Room API Client
 * Handles all room-related API calls
 */

import { env } from '@/shared/config/env';
import {
  Room,
  CreateRoomDto,
  UpdateRoomDto,
  UpdateTenantDto,
  RoomFilters,
  RoomsResponse,
  RoomResponse,
} from '../types';

class RoomApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = env.apiUrl;
    this.timeout = env.apiTimeout;
  }

  async getRooms(accessToken: string, filters?: RoomFilters): Promise<RoomsResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const queryParams = new URLSearchParams();
      
      // Property filter
      if (filters?.propertyId) {
        queryParams.append('propertyId', filters.propertyId);
      }
      
      // Status filter
      if (filters?.status && filters.status.length > 0) {
        filters.status.forEach((s) => queryParams.append('status', s));
      }
      
      // Payment status filter (if backend supports it)
      if (filters?.paymentStatus && filters.paymentStatus.length > 0) {
        filters.paymentStatus.forEach((ps) => queryParams.append('paymentStatus', ps));
      }
      
      // Search query
      if (filters?.searchQuery) {
        queryParams.append('search', filters.searchQuery);
      }
      
      // Price range filters
      if (filters?.minPrice !== undefined && filters.minPrice > 0) {
        queryParams.append('minPrice', filters.minPrice.toString());
      }
      
      if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
        queryParams.append('maxPrice', filters.maxPrice.toString());
      }

      // Pagination parameters
      if (filters?.page !== undefined && filters.page > 0) {
        queryParams.append('page', filters.page.toString());
      }
      
      if (filters?.limit !== undefined && filters.limit > 0) {
        queryParams.append('limit', filters.limit.toString());
      }

      const url = `${this.baseUrl}/rooms${queryParams.toString() ? `?${queryParams}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch rooms');
      }

      const data = await response.json();
      
      // Map backend response to frontend format
      // Backend returns { data: [...], total, page, limit }
      // Each room has _id instead of id
      if (data.data && Array.isArray(data.data)) {
        data.data = data.data.map((room: any) => ({
          ...room,
          id: room._id, // Map _id to id
        }));
      }
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getRoomById(accessToken: string, id: string): Promise<Room> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log('RoomApiClient.getRoomById called');
      console.log('URL:', `${this.baseUrl}/rooms/${id}`);
      console.log('Room ID:', id);
      console.log('Has accessToken:', !!accessToken);
      
      const response = await fetch(`${this.baseUrl}/rooms/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.error('API error response:', error);
        throw new Error(error.message || 'Failed to fetch room');
      }

      const data = await response.json();
      console.log('Room data received:', data);
      
      // Backend returns room directly, not wrapped in { data: {...} }
      // Map _id to id for frontend consistency
      const room: Room = {
        id: data._id,
        propertyId: data.propertyId,
        roomCode: data.roomCode,
        roomName: data.roomName,
        status: data.status,
        rentalPrice: data.rentalPrice,
        electricityFee: data.electricityFee,
        waterFee: data.waterFee,
        garbageFee: data.garbageFee,
        parkingFee: data.parkingFee,
        currentTenant: data.currentTenant,
        paymentStatus: data.paymentStatus,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
      
      console.log('Mapped room:', room);
      return room;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('getRoomById error:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async createRoom(accessToken: string, data: CreateRoomDto): Promise<Room> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log('RoomApiClient.createRoom called');
      console.log('URL:', `${this.baseUrl}/rooms`);
      console.log('Data:', data);
      console.log('Has accessToken:', !!accessToken);
      
      const response = await fetch(`${this.baseUrl}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.error('API error response:', error);
        throw new Error(error.message || 'Failed to create room');
      }

      const responseData: RoomResponse = await response.json();
      console.log('Room created successfully:', responseData);
      return responseData.data;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('createRoom error:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async updateRoom(accessToken: string, id: string, data: UpdateRoomDto): Promise<Room> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/rooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update room');
      }

      const responseData: RoomResponse = await response.json();
      return responseData.data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async deleteRoom(accessToken: string, id: string): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/rooms/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete room');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async updateTenant(accessToken: string, roomId: string, data: UpdateTenantDto): Promise<Room> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log('RoomApiClient.updateTenant called');
      console.log('URL:', `${this.baseUrl}/rooms/${roomId}/tenant`);
      console.log('Data:', data);
      
      const response = await fetch(`${this.baseUrl}/rooms/${roomId}/tenant`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.error('API error response:', error);
        throw new Error(error.message || 'Failed to update tenant');
      }

      const responseData = await response.json();
      console.log('Tenant updated successfully:', responseData);
      
      // Backend returns room directly, map _id to id
      const room: Room = {
        id: responseData._id,
        propertyId: responseData.propertyId,
        roomCode: responseData.roomCode,
        roomName: responseData.roomName,
        status: responseData.status,
        rentalPrice: responseData.rentalPrice,
        electricityFee: responseData.electricityFee,
        waterFee: responseData.waterFee,
        garbageFee: responseData.garbageFee,
        parkingFee: responseData.parkingFee,
        currentTenant: responseData.currentTenant,
        paymentStatus: responseData.paymentStatus,
        createdAt: responseData.createdAt,
        updatedAt: responseData.updatedAt,
      };
      
      return room;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('updateTenant error:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async removeTenant(accessToken: string, roomId: string): Promise<Room> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log('RoomApiClient.removeTenant called');
      console.log('URL:', `${this.baseUrl}/rooms/${roomId}/tenant`);
      
      const response = await fetch(`${this.baseUrl}/rooms/${roomId}/tenant`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.error('API error response:', error);
        throw new Error(error.message || 'Failed to remove tenant');
      }

      const responseData = await response.json();
      console.log('Tenant removed successfully:', responseData);
      
      // Backend returns room directly, map _id to id
      const room: Room = {
        id: responseData._id,
        propertyId: responseData.propertyId,
        roomCode: responseData.roomCode,
        roomName: responseData.roomName,
        status: responseData.status,
        rentalPrice: responseData.rentalPrice,
        electricityFee: responseData.electricityFee,
        waterFee: responseData.waterFee,
        garbageFee: responseData.garbageFee,
        parkingFee: responseData.parkingFee,
        currentTenant: responseData.currentTenant,
        paymentStatus: responseData.paymentStatus,
        createdAt: responseData.createdAt,
        updatedAt: responseData.updatedAt,
      };
      
      return room;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('removeTenant error:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}

export const roomApi = new RoomApiClient();

// Export mock API
export { mockRoomApi } from './mockRoomApi';

// Helper to get the right API client
export const getRoomApi = () => {
  const { shouldUseMock } = require('@/shared/config/api.config');
  const useMock = shouldUseMock('rooms');

  if (useMock) {
    const { mockRoomApi } = require('./mockRoomApi');
    return mockRoomApi;
  }

  return roomApi;
};
