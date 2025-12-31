/**
 * Mock Dashboard API Client
 * Provides mock data for development and testing
 */

import { DashboardStatistics, RecentActivity, OverduePayment } from '../types';

class MockDashboardApiClient {
  private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async getDashboardStatistics(
    accessToken: string,
    propertyId?: string
  ): Promise<DashboardStatistics> {
    await this.delay(500);

    return {
      totalRooms: 50,
      occupiedRooms: 42,
      vacantRooms: 6,
      maintenanceRooms: 2,
      unpaidRooms: 8,
      totalRevenue: 126000000,
      unpaidAmount: 24000000,
      occupancyRate: 84,
    };
  }

  async getRecentActivity(
    accessToken: string,
    propertyId?: string,
    limit: number = 10
  ): Promise<RecentActivity[]> {
    await this.delay(500);

    const activities: RecentActivity[] = [
      {
        id: '1',
        type: 'payment',
        title: 'Payment Received',
        description: 'Room 101 - Nguyen Van A paid 3,000,000 VND',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        roomCode: '101',
      },
      {
        id: '2',
        type: 'tenant_move_in',
        title: 'New Tenant',
        description: 'Tran Thi B moved into Room 205',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        roomCode: '205',
      },
      {
        id: '3',
        type: 'maintenance',
        title: 'Maintenance Request',
        description: 'Room 302 - Air conditioner repair needed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        roomCode: '302',
      },
      {
        id: '4',
        type: 'payment',
        title: 'Payment Received',
        description: 'Room 108 - Le Van C paid 2,800,000 VND',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        roomCode: '108',
      },
      {
        id: '5',
        type: 'tenant_move_out',
        title: 'Tenant Moved Out',
        description: 'Pham Thi D vacated Room 410',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        roomCode: '410',
      },
    ];

    return activities.slice(0, limit);
  }

  async getOverduePayments(
    accessToken: string,
    propertyId?: string
  ): Promise<OverduePayment[]> {
    await this.delay(500);

    return [
      {
        id: '1',
        roomCode: '203',
        roomName: 'Room 203',
        tenantName: 'Nguyen Van E',
        amount: 3200000,
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
        daysOverdue: 15,
      },
      {
        id: '2',
        roomCode: '305',
        roomName: 'Room 305',
        tenantName: 'Tran Thi F',
        amount: 2900000,
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
        daysOverdue: 8,
      },
      {
        id: '3',
        roomCode: '412',
        roomName: 'Room 412',
        tenantName: 'Le Van G',
        amount: 3100000,
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        daysOverdue: 5,
      },
    ];
  }
}

export const mockDashboardApi = new MockDashboardApiClient();
