/**
 * Room API Client
 * Handles all room-related API calls
 */

import { env } from '@/shared/config/env';
import {
  Room,
  CreateRoomDto,
  UpdateRoomDto,
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
      const response = await fetch(`${this.baseUrl}/rooms/${id}`, {
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
        throw new Error(error.message || 'Failed to fetch room');
      }

      const data: RoomResponse = await response.json();
      return data.data;
    } catch (error) {
      clearTimeout(timeoutId);
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
