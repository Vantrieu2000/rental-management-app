/**
 * Mock Maintenance API Client
 * For development and testing
 */

import {
  MaintenanceRequest,
  CreateMaintenanceRequestDto,
  UpdateMaintenanceRequestDto,
  ResolveMaintenanceRequestDto,
  MaintenanceFilters,
} from '../types';

// Mock data storage
let mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    roomId: '1',
    propertyId: '1',
    title: 'Leaking faucet',
    description: 'The bathroom faucet is leaking water continuously',
    priority: 'medium',
    status: 'pending',
    reportedBy: 'John Doe',
    reportedDate: new Date('2024-01-15'),
    photos: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    roomId: '2',
    propertyId: '1',
    title: 'Broken air conditioner',
    description: 'AC unit not cooling properly',
    priority: 'high',
    status: 'in_progress',
    reportedBy: 'Jane Smith',
    reportedDate: new Date('2024-01-10'),
    assignedTo: 'Technician A',
    scheduledDate: new Date('2024-01-16'),
    photos: ['https://example.com/photo1.jpg'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    roomId: '3',
    propertyId: '1',
    title: 'Door lock issue',
    description: 'Door lock is stuck and difficult to open',
    priority: 'urgent',
    status: 'completed',
    reportedBy: 'Bob Johnson',
    reportedDate: new Date('2024-01-05'),
    completedDate: new Date('2024-01-08'),
    cost: 150000,
    photos: [],
    notes: 'Replaced lock mechanism',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-08'),
  },
];

class MockMaintenanceApiClient {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getMaintenanceRequests(
    accessToken: string,
    filters?: MaintenanceFilters
  ): Promise<MaintenanceRequest[]> {
    await this.delay();

    let filtered = [...mockMaintenanceRequests];

    if (filters?.propertyId) {
      filtered = filtered.filter((req) => req.propertyId === filters.propertyId);
    }
    if (filters?.roomId) {
      filtered = filtered.filter((req) => req.roomId === filters.roomId);
    }
    if (filters?.status) {
      filtered = filtered.filter((req) => req.status === filters.status);
    }
    if (filters?.priority) {
      filtered = filtered.filter((req) => req.priority === filters.priority);
    }
    if (filters?.startDate) {
      filtered = filtered.filter(
        (req) => req.reportedDate >= filters.startDate!
      );
    }
    if (filters?.endDate) {
      filtered = filtered.filter((req) => req.reportedDate <= filters.endDate!);
    }

    return filtered;
  }

  async getMaintenanceRequestById(
    accessToken: string,
    id: string
  ): Promise<MaintenanceRequest> {
    await this.delay();

    const request = mockMaintenanceRequests.find((req) => req.id === id);
    if (!request) {
      throw new Error('Maintenance request not found');
    }

    return request;
  }

  async createMaintenanceRequest(
    accessToken: string,
    data: CreateMaintenanceRequestDto
  ): Promise<MaintenanceRequest> {
    await this.delay();

    const newRequest: MaintenanceRequest = {
      id: String(mockMaintenanceRequests.length + 1),
      ...data,
      status: 'pending',
      reportedDate: new Date(),
      photos: data.photos || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockMaintenanceRequests.push(newRequest);
    return newRequest;
  }

  async updateMaintenanceRequest(
    accessToken: string,
    id: string,
    data: UpdateMaintenanceRequestDto
  ): Promise<MaintenanceRequest> {
    await this.delay();

    const index = mockMaintenanceRequests.findIndex((req) => req.id === id);
    if (index === -1) {
      throw new Error('Maintenance request not found');
    }

    mockMaintenanceRequests[index] = {
      ...mockMaintenanceRequests[index],
      ...data,
      updatedAt: new Date(),
    };

    return mockMaintenanceRequests[index];
  }

  async deleteMaintenanceRequest(accessToken: string, id: string): Promise<void> {
    await this.delay();

    const index = mockMaintenanceRequests.findIndex((req) => req.id === id);
    if (index === -1) {
      throw new Error('Maintenance request not found');
    }

    mockMaintenanceRequests.splice(index, 1);
  }

  async resolveMaintenanceRequest(
    accessToken: string,
    id: string,
    data: ResolveMaintenanceRequestDto
  ): Promise<MaintenanceRequest> {
    await this.delay();

    const index = mockMaintenanceRequests.findIndex((req) => req.id === id);
    if (index === -1) {
      throw new Error('Maintenance request not found');
    }

    mockMaintenanceRequests[index] = {
      ...mockMaintenanceRequests[index],
      status: 'completed',
      completedDate: data.completedDate,
      cost: data.cost,
      notes: data.notes || mockMaintenanceRequests[index].notes,
      updatedAt: new Date(),
    };

    return mockMaintenanceRequests[index];
  }

  async uploadPhoto(
    accessToken: string,
    id: string,
    photoUri: string
  ): Promise<string> {
    await this.delay(1000);

    const index = mockMaintenanceRequests.findIndex((req) => req.id === id);
    if (index === -1) {
      throw new Error('Maintenance request not found');
    }

    // Simulate photo upload and return a mock URL
    const mockPhotoUrl = `https://example.com/photos/${Date.now()}.jpg`;
    mockMaintenanceRequests[index].photos.push(mockPhotoUrl);
    mockMaintenanceRequests[index].updatedAt = new Date();

    return mockPhotoUrl;
  }
}

export const mockMaintenanceApi = new MockMaintenanceApiClient();
