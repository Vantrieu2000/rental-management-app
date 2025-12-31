import { apiClient } from '@/infrastructure/api/client';
import {
  Property,
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyStatistics,
} from '../types';

class PropertyService {
  private readonly baseUrl = '/properties';

  /**
   * Get all properties for the current user
   */
  async getProperties(): Promise<Property[]> {
    const response = await apiClient.get<Property[]>(this.baseUrl);
    return response;
  }

  /**
   * Get a single property by ID
   */
  async getPropertyById(id: string): Promise<Property> {
    const response = await apiClient.get<Property>(`${this.baseUrl}/${id}`);
    return response;
  }

  /**
   * Create a new property
   */
  async createProperty(data: CreatePropertyDto): Promise<Property> {
    // Remove 'type' field as backend doesn't accept it
    const { type, ...payload } = data;
    const response = await apiClient.post<Property>(this.baseUrl, payload);
    return response;
  }

  /**
   * Update an existing property
   */
  async updateProperty(id: string, data: UpdatePropertyDto): Promise<Property> {
    // Remove 'type' field as backend doesn't accept it
    const { type, ...payload } = data;
    const response = await apiClient.put<Property>(`${this.baseUrl}/${id}`, payload);
    return response;
  }

  /**
   * Delete a property
   */
  async deleteProperty(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Get property statistics
   */
  async getPropertyStatistics(): Promise<PropertyStatistics> {
    const properties = await this.getProperties();
    
    const statistics: PropertyStatistics = {
      totalProperties: properties.length,
      totalRooms: properties.reduce((sum, p) => sum + p.totalRooms, 0),
      totalOccupiedRooms: properties.reduce((sum, p) => sum + (p.occupiedRooms || 0), 0),
      totalVacantRooms: properties.reduce((sum, p) => sum + (p.vacantRooms || 0), 0),
    };
    
    return statistics;
  }
}

export const propertyService = new PropertyService();
