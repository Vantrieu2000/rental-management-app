/**
 * Reminder Types
 */

export interface Reminder {
  id: string;
  paymentId: string;
  roomId: string;
  propertyId: string;
  
  // Reminder details
  type: 'due_date' | 'recurring' | 'custom';
  scheduledDate: Date;
  intervalDays?: number; // For recurring reminders
  
  // Status
  status: 'scheduled' | 'sent' | 'cancelled';
  sentAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderLog {
  id: string;
  reminderId: string;
  paymentId: string;
  roomId: string;
  
  // Log details
  sentAt: Date;
  recipientId: string;
  notificationId?: string;
  
  // Status
  delivered: boolean;
  error?: string;
  
  createdAt: Date;
}

export interface CreateReminderDto {
  paymentId: string;
  roomId: string;
  propertyId: string;
  type: Reminder['type'];
  scheduledDate: Date;
  intervalDays?: number;
}

export interface ReminderConfig {
  defaultDaysBefore: number; // Default 3 days before due date
  enableRecurring: boolean;
  recurringIntervalDays: number;
}

export interface ReminderFilters {
  propertyId?: string;
  roomId?: string;
  status?: Reminder['status'];
  type?: Reminder['type'];
  startDate?: Date;
  endDate?: Date;
}
