/**
 * Dashboard Types
 */

export interface DashboardStatistics {
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  maintenanceRooms: number;
  unpaidRooms: number;
  totalRevenue: number;
  unpaidAmount: number;
  occupancyRate: number;
}

export interface RecentActivity {
  id: string;
  type: 'payment' | 'tenant_move_in' | 'tenant_move_out' | 'maintenance' | 'room_created';
  title: string;
  description: string;
  timestamp: Date;
  roomCode?: string;
}

export interface OverduePayment {
  id: string;
  roomCode: string;
  roomName: string;
  tenantName: string;
  amount: number;
  dueDate: Date;
  daysOverdue: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface OccupancyData {
  month: string;
  occupancyRate: number;
}
