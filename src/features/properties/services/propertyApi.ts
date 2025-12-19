/**
 * Property API Client
 * Handles all property-related API calls
 */

import { env } from '@/shared/config/env';
import {
  Property,
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyFilters,
  PropertyStatistics,
} from '../types';

class PropertyApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = env.apiUrl;
    this.timeout = env.apiTimeout;
  }

  /**
   * Get all properties with optional filters
   */
  async getProperties(
    accessToken: string,
    filters?: PropertyFilters
  ): Promise<Property[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const queryParams = new URLSearchParams();
      if (filters?.search) {
        queryParams.append('search', filters.search);
      }
      if (filters?.ownerId) {
        queryParams.append('ownerId', filters.ownerId);
      }

      const url = `${this.baseUrl}/properties${
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
        throw new Error(error.message || 'Failed to fetch properties');
      }

      const data = await response.json();
      return data.properties;
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
   * Get property by ID
   */
  async getPropertyById(accessToken: string, id: string): Promise<Property> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/properties/${id}`, {
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
        throw new Error(error.message || 'Failed to fetch property');
      }

      const data = await response.json();
      return data.property;
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
   * Create a new property
   */
  async createProperty(
    accessToken: string,
    data: CreatePropertyDto
  ): Promise<Property> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/properties`, {
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
        throw new Error(error.message || 'Failed to create property');
      }

      const responseData = await response.json();
      return responseData.property;
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
   * Update property
   */
  async updateProperty(
    accessToken: string,
    id: string,
    data: UpdatePropertyDto
  ): Promise<Property> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/properties/${id}`, {
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
        throw new Error(error.message || 'Failed to update property');
      }

      const responseData = await response.json();
      return responseData.property;
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
   * Delete property
   */
  async deleteProperty(accessToken: string, id: string): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/properties/${id}`, {
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
        throw new Error(error.message || 'Failed to delete property');
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
   * Get property statistics
   */
  async getPropertyStatistics(
    accessToken: string,
    id: string
  ): Promise<PropertyStatistics> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/properties/${id}/statistics`, {
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
        throw new Error(error.message || 'Failed to fetch property statistics');
      }

      const data = await response.json();
      return data.statistics;
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
}

export const propertyApi = new PropertyApiClient();

// Export mock API for development
export { mockPropertyApi } from './mockPropertyApi';

// Helper to get the right API client
export const getPropertyApi = () => {
  const { shouldUseMock } = require('@/shared/config/api.config');
  const useMock = shouldUseMock('properties');
  
  if (useMock) {
    const { mockPropertyApi } = require('./mockPropertyApi');
    return mockPropertyApi;
  }
  
  return propertyApi;
};
