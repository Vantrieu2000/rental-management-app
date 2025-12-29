/**
 * Mock Tenant API
 * Provides mock data for development and testing
 */

import {
  Tenant,
  CreateTenantDto,
  UpdateTenantDto,
  AssignTenantDto,
  VacateTenantDto,
  TenantFilters,
  TenantHistory,
} from '../types';

// Mock data storage
let mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'nguyenvana@example.com',
    idNumber: '001234567890',
    roomId: 'room-1',
    moveInDate: new Date('2024-01-01'),
    emergencyContact: {
      name: 'Nguyễn Thị B',
      phone: '0907654321',
      relationship: 'Vợ',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tenant-2',
    name: 'Trần Thị C',
    phone: '0912345678',
    email: 'tranthic@example.com',
    roomId: 'room-2',
    moveInDate: new Date('2024-02-01'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

let mockTenantHistory: TenantHistory[] = [
  {
    id: 'history-1',
    tenantId: 'tenant-1',
    roomId: 'room-1',
    moveInDate: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'history-2',
    tenantId: 'tenant-2',
    roomId: 'room-2',
    moveInDate: new Date('2024-02-01'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

class MockTenantApiClient {
  private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async getTenants(_accessToken: string, filters?: TenantFilters): Promise<Tenant[]> {
    await this.delay(300);

    let filtered = [...mockTenants];

    if (filters?.roomId) {
      filtered = filtered.filter((t) => t.roomId === filters.roomId);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.phone.includes(search) ||
          t.email?.toLowerCase().includes(search)
      );
    }

    if (filters?.isActive !== undefined) {
      filtered = filtered.filter((t) => (filters.isActive ? !t.moveOutDate : !!t.moveOutDate));
    }

    return filtered;
  }

  async getTenantById(_accessToken: string, id: string): Promise<Tenant> {
    await this.delay(200);

    const tenant = mockTenants.find((t) => t.id === id);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    return tenant;
  }

  async createTenant(_accessToken: string, data: CreateTenantDto): Promise<Tenant> {
    await this.delay(400);

    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTenants.push(newTenant);

    // Add to history
    mockTenantHistory.push({
      id: `history-${Date.now()}`,
      tenantId: newTenant.id,
      roomId: newTenant.roomId,
      moveInDate: newTenant.moveInDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newTenant;
  }

  async updateTenant(_accessToken: string, id: string, data: UpdateTenantDto): Promise<Tenant> {
    await this.delay(400);

    const index = mockTenants.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Tenant not found');
    }

    mockTenants[index] = {
      ...mockTenants[index],
      ...data,
      updatedAt: new Date(),
    };

    return mockTenants[index];
  }

  async deleteTenant(_accessToken: string, id: string): Promise<void> {
    await this.delay(300);

    const index = mockTenants.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Tenant not found');
    }

    mockTenants.splice(index, 1);
  }

  async assignTenant(_accessToken: string, data: AssignTenantDto): Promise<Tenant> {
    await this.delay(400);

    const tenant = mockTenants.find((t) => t.id === data.tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Update tenant
    tenant.roomId = data.roomId;
    tenant.moveInDate = data.moveInDate;
    tenant.moveOutDate = undefined;
    tenant.updatedAt = new Date();

    // Add to history
    mockTenantHistory.push({
      id: `history-${Date.now()}`,
      tenantId: tenant.id,
      roomId: data.roomId,
      moveInDate: data.moveInDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return tenant;
  }

  async vacateTenant(_accessToken: string, data: VacateTenantDto): Promise<void> {
    await this.delay(400);

    const tenant = mockTenants.find((t) => t.id === data.tenantId && t.roomId === data.roomId);
    if (!tenant) {
      throw new Error('Tenant not found in specified room');
    }

    // Update tenant
    tenant.moveOutDate = data.moveOutDate;
    tenant.updatedAt = new Date();

    // Update history
    const historyEntry = mockTenantHistory.find(
      (h) => h.tenantId === data.tenantId && h.roomId === data.roomId && !h.moveOutDate
    );
    if (historyEntry) {
      historyEntry.moveOutDate = data.moveOutDate;
      historyEntry.updatedAt = new Date();
    }
  }

  async getTenantHistory(_accessToken: string, roomId: string): Promise<TenantHistory[]> {
    await this.delay(300);

    return mockTenantHistory
      .filter((h) => h.roomId === roomId)
      .sort((a, b) => b.moveInDate.getTime() - a.moveInDate.getTime());
  }

  /**
   * Reset mock data (for testing)
   */
  resetMockData(): void {
    mockTenants = [];
    mockTenantHistory = [];
  }

  /**
   * Add test tenant data directly (for testing)
   */
  addTestTenant(tenant: Tenant): void {
    mockTenants.push(tenant);
  }
}

export const mockTenantApi = new MockTenantApiClient();
