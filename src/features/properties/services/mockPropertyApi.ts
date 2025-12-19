/**
 * Mock Property API
 * Fake data for development - will be replaced with real API calls
 * 
 * BACKEND TODO: Implement these endpoints:
 * - GET    /api/properties
 * - GET    /api/properties/:id
 * - POST   /api/properties
 * - PUT    /api/properties/:id
 * - DELETE /api/properties/:id
 * - GET    /api/properties/:id/statistics
 */

import {
  Property,
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyFilters,
  PropertyStatistics,
} from '../types';

// Fake data storage
let mockProperties: Property[] = [
  {
    id: '1',
    name: 'Nhà trọ Hòa Bình',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    totalRooms: 20,
    defaultElectricityRate: 3500,
    defaultWaterRate: 20000,
    defaultGarbageRate: 30000,
    defaultParkingRate: 100000,
    billingDayOfMonth: 5,
    reminderDaysBefore: 3,
    ownerId: 'user-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Chung cư Mini An Phú',
    address: '456 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
    totalRooms: 30,
    defaultElectricityRate: 3800,
    defaultWaterRate: 25000,
    defaultGarbageRate: 35000,
    defaultParkingRate: 150000,
    billingDayOfMonth: 1,
    reminderDaysBefore: 5,
    ownerId: 'user-1',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Nhà trọ Sinh Viên',
    address: '789 Đường Võ Văn Ngân, Thủ Đức, TP.HCM',
    totalRooms: 15,
    defaultElectricityRate: 3200,
    defaultWaterRate: 18000,
    defaultGarbageRate: 25000,
    defaultParkingRate: 80000,
    billingDayOfMonth: 10,
    reminderDaysBefore: 3,
    ownerId: 'user-1',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
];

// Mock statistics data
const mockStatistics: Record<string, PropertyStatistics> = {
  '1': {
    propertyId: '1',
    totalRooms: 20,
    occupiedRooms: 18,
    vacantRooms: 2,
    totalRevenue: 54000000,
    unpaidAmount: 6000000,
    occupancyRate: 0.9,
  },
  '2': {
    propertyId: '2',
    totalRooms: 30,
    occupiedRooms: 25,
    vacantRooms: 5,
    totalRevenue: 87500000,
    unpaidAmount: 10500000,
    occupancyRate: 0.833,
  },
  '3': {
    propertyId: '3',
    totalRooms: 15,
    occupiedRooms: 12,
    vacantRooms: 3,
    totalRevenue: 28800000,
    unpaidAmount: 3600000,
    occupancyRate: 0.8,
  },
};

// Simulate network delay
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

class MockPropertyApiClient {
  /**
   * Get all properties with optional filters
   */
  async getProperties(
    accessToken: string,
    filters?: PropertyFilters
  ): Promise<Property[]> {
    await delay();

    let filtered = [...mockProperties];

    // Apply filters
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.address.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.ownerId) {
      filtered = filtered.filter((p) => p.ownerId === filters.ownerId);
    }

    return filtered;
  }

  /**
   * Get property by ID
   */
  async getPropertyById(accessToken: string, id: string): Promise<Property> {
    await delay();

    const property = mockProperties.find((p) => p.id === id);
    if (!property) {
      throw new Error('Property not found');
    }

    return property;
  }

  /**
   * Create a new property
   */
  async createProperty(
    accessToken: string,
    data: CreatePropertyDto
  ): Promise<Property> {
    await delay();

    const newProperty: Property = {
      id: `${Date.now()}`, // Simple ID generation
      ...data,
      ownerId: 'user-1', // TODO: Get from auth context
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProperties.push(newProperty);

    // Create mock statistics for new property
    mockStatistics[newProperty.id] = {
      propertyId: newProperty.id,
      totalRooms: data.totalRooms,
      occupiedRooms: 0,
      vacantRooms: data.totalRooms,
      totalRevenue: 0,
      unpaidAmount: 0,
      occupancyRate: 0,
    };

    return newProperty;
  }

  /**
   * Update property
   */
  async updateProperty(
    accessToken: string,
    id: string,
    data: UpdatePropertyDto
  ): Promise<Property> {
    await delay();

    const index = mockProperties.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }

    const updatedProperty: Property = {
      ...mockProperties[index],
      ...data,
      updatedAt: new Date(),
    };

    mockProperties[index] = updatedProperty;

    // Update statistics if totalRooms changed
    if (data.totalRooms && mockStatistics[id]) {
      mockStatistics[id].totalRooms = data.totalRooms;
      mockStatistics[id].vacantRooms =
        data.totalRooms - mockStatistics[id].occupiedRooms;
    }

    return updatedProperty;
  }

  /**
   * Delete property
   */
  async deleteProperty(accessToken: string, id: string): Promise<void> {
    await delay();

    const index = mockProperties.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }

    mockProperties.splice(index, 1);
    delete mockStatistics[id];
  }

  /**
   * Get property statistics
   */
  async getPropertyStatistics(
    accessToken: string,
    id: string
  ): Promise<PropertyStatistics> {
    await delay();

    const stats = mockStatistics[id];
    if (!stats) {
      throw new Error('Property statistics not found');
    }

    return stats;
  }
}

export const mockPropertyApi = new MockPropertyApiClient();
