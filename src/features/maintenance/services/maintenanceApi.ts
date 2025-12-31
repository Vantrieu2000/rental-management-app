/**
 * Maintenance API Client
 * Handles all maintenance-related API calls
 */

import { env } from '@/shared/config/env';
import {
  MaintenanceRequest,
  CreateMaintenanceRequestDto,
  UpdateMaintenanceRequestDto,
  ResolveMaintenanceRequestDto,
  MaintenanceFilters,
} from '../types';

class MaintenanceApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = env.apiUrl;
    this.timeout = env.apiTimeout;
  }

  /**
   * Get all maintenance requests with optional filters
   */
  async getMaintenanceRequests(
    accessToken: string,
    filters?: MaintenanceFilters
  ): Promise<MaintenanceRequest[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const queryParams = new URLSearchParams();
      if (filters?.propertyId) {
        queryParams.append('propertyId', filters.propertyId);
      }
      if (filters?.roomId) {
        queryParams.append('roomId', filters.roomId);
      }
      if (filters?.status) {
        queryParams.append('status', filters.status);
      }
      if (filters?.priority) {
        queryParams.append('priority', filters.priority);
      }
      if (filters?.startDate) {
        queryParams.append('startDate', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        queryParams.append('endDate', filters.endDate.toISOString());
      }

      const url = `${this.baseUrl}/maintenance${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

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
        throw new Error(error.message || 'Failed to fetch maintenance requests');
      }

      const data = await response.json();
      return data.maintenanceRequests.map((req: any) => ({
        ...req,
        reportedDate: new Date(req.reportedDate),
        scheduledDate: req.scheduledDate ? new Date(req.scheduledDate) : undefined,
        completedDate: req.completedDate ? new Date(req.completedDate) : undefined,
        createdAt: new Date(req.createdAt),
        updatedAt: new Date(req.updatedAt),
      }));
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Get maintenance request by ID
   */
  async getMaintenanceRequestById(
    accessToken: string,
    id: string
  ): Promise<MaintenanceRequest> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/maintenance/${id}`, {
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
        throw new Error(error.message || 'Failed to fetch maintenance request');
      }

      const data = await response.json();
      return {
        ...data.maintenanceRequest,
        reportedDate: new Date(data.maintenanceRequest.reportedDate),
        scheduledDate: data.maintenanceRequest.scheduledDate
          ? new Date(data.maintenanceRequest.scheduledDate)
          : undefined,
        completedDate: data.maintenanceRequest.completedDate
          ? new Date(data.maintenanceRequest.completedDate)
          : undefined,
        createdAt: new Date(data.maintenanceRequest.createdAt),
        updatedAt: new Date(data.maintenanceRequest.updatedAt),
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Create a new maintenance request
   */
  async createMaintenanceRequest(
    accessToken: string,
    data: CreateMaintenanceRequestDto
  ): Promise<MaintenanceRequest> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/maintenance`, {
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
        throw new Error(error.message || 'Failed to create maintenance request');
      }

      const responseData = await response.json();
      return {
        ...responseData.maintenanceRequest,
        reportedDate: new Date(responseData.maintenanceRequest.reportedDate),
        createdAt: new Date(responseData.maintenanceRequest.createdAt),
        updatedAt: new Date(responseData.maintenanceRequest.updatedAt),
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Update maintenance request
   */
  async updateMaintenanceRequest(
    accessToken: string,
    id: string,
    data: UpdateMaintenanceRequestDto
  ): Promise<MaintenanceRequest> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/maintenance/${id}`, {
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
        throw new Error(error.message || 'Failed to update maintenance request');
      }

      const responseData = await response.json();
      return {
        ...responseData.maintenanceRequest,
        reportedDate: new Date(responseData.maintenanceRequest.reportedDate),
        scheduledDate: responseData.maintenanceRequest.scheduledDate
          ? new Date(responseData.maintenanceRequest.scheduledDate)
          : undefined,
        completedDate: responseData.maintenanceRequest.completedDate
          ? new Date(responseData.maintenanceRequest.completedDate)
          : undefined,
        createdAt: new Date(responseData.maintenanceRequest.createdAt),
        updatedAt: new Date(responseData.maintenanceRequest.updatedAt),
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Delete maintenance request
   */
  async deleteMaintenanceRequest(accessToken: string, id: string): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/maintenance/${id}`, {
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
        throw new Error(error.message || 'Failed to delete maintenance request');
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Resolve maintenance request
   */
  async resolveMaintenanceRequest(
    accessToken: string,
    id: string,
    data: ResolveMaintenanceRequestDto
  ): Promise<MaintenanceRequest> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/maintenance/${id}/resolve`, {
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
        throw new Error(error.message || 'Failed to resolve maintenance request');
      }

      const responseData = await response.json();
      return {
        ...responseData.maintenanceRequest,
        reportedDate: new Date(responseData.maintenanceRequest.reportedDate),
        completedDate: new Date(responseData.maintenanceRequest.completedDate),
        createdAt: new Date(responseData.maintenanceRequest.createdAt),
        updatedAt: new Date(responseData.maintenanceRequest.updatedAt),
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Upload photo for maintenance request
   */
  async uploadPhoto(
    accessToken: string,
    id: string,
    photoUri: string
  ): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout * 3); // Longer timeout for uploads

      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'maintenance-photo.jpg',
      } as any);

      const response = await fetch(`${this.baseUrl}/maintenance/${id}/photos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload photo');
      }

      const data = await response.json();
      return data.photoUrl;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Upload timeout');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}

export const maintenanceApi = new MaintenanceApiClient();

// Export mock API for development
export { mockMaintenanceApi } from './mockMaintenanceApi';

// Helper to get the right API client
export const getMaintenanceApi = () => {
  const { shouldUseMock } = require('@/shared/config/api.config');
  const useMock = shouldUseMock('maintenance');

  if (useMock) {
    const { mockMaintenanceApi } = require('./mockMaintenanceApi');
    return mockMaintenanceApi;
  }

  return maintenanceApi;
};
