/**
 * Room API Client
 * Handles all room-related API calls
 */

import { env } from '@/shared/config/env';
import { Room, CreateRoomDto, UpdateRoomDto, RoomFilters, RoomWithTenant } from '../types';

class RoomApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = env.apiUrl;
    this.timeout = env.apiTimeout;
  }

  async getRooms(accessToken: string, filters?: RoomFilters): Promise<Room[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const queryParams = new URLSearchParams();
      if (filters?.propertyId) queryParams.append('propertyId', filters.propertyId);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.paymentStatus) queryParams.append('paymentStatus', filters.paymentStatus);
      if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());

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
      return data.rooms;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getRoomById(accessToken: string, id: string): Promise<RoomWithTenant> {
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

      const data = await response.json();
      return data.room;
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create room');
      }

      const responseData = await response.json();
      return responseData.room;
    } catch (error) {
      clearTimeout(timeoutId);
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

      const responseData = await response.json();
      return responseData.room;
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

  async searchRooms(accessToken: string, query: string, propertyId?: string): Promise<Room[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const queryParams = new URLSearchParams({ q: query });
      if (propertyId) queryParams.append('propertyId', propertyId);

      const response = await fetch(`${this.baseUrl}/rooms/search?${queryParams}`, {
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
        throw new Error(error.message || 'Failed to search rooms');
      }

      const data = await response.json();
      return data.rooms;
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
