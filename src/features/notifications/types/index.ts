/**
 * Notification Types
 */

export interface Notification {
  id: string;
  roomId: string;
  roomCode: string;
  roomName: string;
  tenantName: string;
  propertyId: string;
  
  // Payment details
  paymentId: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: Date;
  
  // Overdue info
  daysOverdue: number;
  
  // Status
  status: 'unpaid' | 'partial' | 'overdue';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationFilters {
  propertyId?: string;
  status?: Notification['status'];
  minDaysOverdue?: number;
}

export interface NotificationSummary {
  totalUnpaid: number;
  totalOverdue: number;
  totalAmount: number;
  mostOverdueDays: number;
}
