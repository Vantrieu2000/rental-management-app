/**
 * Tenant API Client
 * Handles all tenant-related API calls
 */

import { env } from '@/shared/config/env';
import {
  Tenant,
  CreateTenantDto,
  UpdateTenantDto,
  AssignTenantDto,
  VacateTenantDto,
  TenantFilters,
  TenantHistory,
} from '../types';

class TenantApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = env.apiUrl;
    this.timeout = env.apiTimeout;
  }

  async getTenants(accessToken: string, filters?: TenantFilters): Promise<Tenant[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const queryParams = new URLSearchParams();
      if (filters?.roomId) queryParams.append('roomId', filters.roomId);
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.isActive !== undefined)
        queryParams.append('isActive', filters.isActive.toString());

      const url = `${this.baseUrl}/tenants${queryParams.toString() ? `?${queryParams}` : ''}`;

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
        throw new Error(error.message || 'Failed to fetch tenants');
      }

      const data = await response.json();
      return data.tenants;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getTenantById(accessToken: string, id: string): Promise<Tenant> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/tenants/${id}`, {
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
        throw new Error(error.message || 'Failed to fetch tenant');
      }

      const data = await response.json();
      return data.tenant;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async createTenant(accessToken: string, data: CreateTenantDto): Promise<Tenant> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/tenants`, {
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
        throw new Error(error.message || 'Failed to create tenant');
      }

      const responseData = await response.json();
      return responseData.tenant;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async updateTenant(accessToken: string, id: string, data: UpdateTenantDto): Promise<Tenant> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/tenants/${id}`, {
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
        throw new Error(error.message || 'Failed to update tenant');
      }

      const responseData = await response.json();
      return responseData.tenant;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async deleteTenant(accessToken: string, id: string): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/tenants/${id}`, {
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
        throw new Error(error.message || 'Failed to delete tenant');
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

  async assignTenant(accessToken: string, data: AssignTenantDto): Promise<Tenant> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/rooms/${data.roomId}/assign-tenant`, {
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
        throw new Error(error.message || 'Failed to assign tenant');
      }

      const responseData = await response.json();
      return responseData.tenant;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async vacateTenant(accessToken: string, data: VacateTenantDto): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/rooms/${data.roomId}/vacate`, {
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
        throw new Error(error.message || 'Failed to vacate tenant');
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

  async getTenantHistory(accessToken: string, roomId: string): Promise<TenantHistory[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/rooms/${roomId}/tenant-history`, {
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
        throw new Error(error.message || 'Failed to fetch tenant history');
      }

      const data = await response.json();
      return data.history;
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

export const tenantApi = new TenantApiClient();

// Export mock API
export { mockTenantApi } from './mockTenantApi';

// Helper to get the right API client
export const getTenantApi = () => {
  const { shouldUseMock } = require('@/shared/config/api.config');
  const useMock = shouldUseMock('tenants');

  if (useMock) {
    const { mockTenantApi } = require('./mockTenantApi');
    return mockTenantApi;
  }

  return tenantApi;
};
