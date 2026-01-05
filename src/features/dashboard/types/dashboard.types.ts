export interface DashboardStatistics {
  totalProperties: number;
  totalRooms: number;
  occupiedRooms: number;
  totalTenants: number;
  currentMonthRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  occupancyRate: number;
  timestamp: string;
}

export interface StatCardProps {
  icon: string;
  label: string;
  value: number | string;
  color?: string;
  format?: 'number' | 'currency' | 'percentage';
}
