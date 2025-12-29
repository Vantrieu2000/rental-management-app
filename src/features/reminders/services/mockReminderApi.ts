/**
 * Mock Reminder API
 * Simulates backend API for development and testing
 */

import { addDays } from 'date-fns';
import { Reminder, ReminderLog, CreateReminderDto, ReminderFilters } from '../types';

class MockReminderApi {
  private reminders: Reminder[] = [];
  private logs: ReminderLog[] = [];

  /**
   * Get all reminders
   */
  async getReminders(
    accessToken: string,
    filters?: ReminderFilters
  ): Promise<Reminder[]> {
    let filtered = [...this.reminders];

    if (filters?.propertyId) {
      filtered = filtered.filter((r) => r.propertyId === filters.propertyId);
    }

    if (filters?.roomId) {
      filtered = filtered.filter((r) => r.roomId === filters.roomId);
    }

    if (filters?.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    if (filters?.type) {
      filtered = filtered.filter((r) => r.type === filters.type);
    }

    if (filters?.startDate) {
      filtered = filtered.filter(
        (r) => new Date(r.scheduledDate) >= filters.startDate!
      );
    }

    if (filters?.endDate) {
      filtered = filtered.filter(
        (r) => new Date(r.scheduledDate) <= filters.endDate!
      );
    }

    return filtered;
  }

  /**
   * Get reminder by ID
   */
  async getReminderById(accessToken: string, id: string): Promise<Reminder> {
    const reminder = this.reminders.find((r) => r.id === id);
    if (!reminder) {
      throw new Error('Reminder not found');
    }
    return reminder;
  }

  /**
   * Create a new reminder
   */
  async createReminder(
    accessToken: string,
    data: CreateReminderDto
  ): Promise<Reminder> {
    const reminder: Reminder = {
      id: `reminder-${Date.now()}`,
      ...data,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reminders.push(reminder);
    return reminder;
  }

  /**
   * Update a reminder
   */
  async updateReminder(
    accessToken: string,
    id: string,
    data: Partial<Reminder>
  ): Promise<Reminder> {
    const index = this.reminders.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Reminder not found');
    }

    this.reminders[index] = {
      ...this.reminders[index],
      ...data,
      updatedAt: new Date(),
    };

    return this.reminders[index];
  }

  /**
   * Delete a reminder
   */
  async deleteReminder(accessToken: string, id: string): Promise<void> {
    const index = this.reminders.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Reminder not found');
    }

    this.reminders.splice(index, 1);
  }

  /**
   * Get reminder logs
   */
  async getReminderLogs(
    accessToken: string,
    reminderId: string
  ): Promise<ReminderLog[]> {
    return this.logs.filter((log) => log.reminderId === reminderId);
  }

  /**
   * Create a reminder log
   */
  async createReminderLog(
    accessToken: string,
    log: Omit<ReminderLog, 'id' | 'createdAt'>
  ): Promise<ReminderLog> {
    const newLog: ReminderLog = {
      ...log,
      id: `log-${Date.now()}`,
      createdAt: new Date(),
    };

    this.logs.push(newLog);
    return newLog;
  }

  /**
   * Reset mock data (for testing)
   */
  reset(): void {
    this.reminders = [];
    this.logs = [];
  }

  /**
   * Seed mock data (for development)
   */
  seed(): void {
    const now = new Date();
    
    this.reminders = [
      {
        id: 'reminder-1',
        paymentId: 'payment-1',
        roomId: 'room-1',
        propertyId: 'property-1',
        type: 'due_date',
        scheduledDate: addDays(now, 3),
        status: 'scheduled',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'reminder-2',
        paymentId: 'payment-2',
        roomId: 'room-2',
        propertyId: 'property-1',
        type: 'recurring',
        scheduledDate: addDays(now, 7),
        intervalDays: 7,
        status: 'scheduled',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'reminder-3',
        paymentId: 'payment-3',
        roomId: 'room-3',
        propertyId: 'property-1',
        type: 'custom',
        scheduledDate: addDays(now, 5),
        status: 'scheduled',
        createdAt: now,
        updatedAt: now,
      },
    ];

    this.logs = [
      {
        id: 'log-1',
        reminderId: 'reminder-1',
        paymentId: 'payment-1',
        roomId: 'room-1',
        sentAt: addDays(now, -7),
        recipientId: 'user-1',
        notificationId: 'notif-1',
        delivered: true,
        createdAt: addDays(now, -7),
      },
    ];
  }
}

export const mockReminderApi = new MockReminderApi();
