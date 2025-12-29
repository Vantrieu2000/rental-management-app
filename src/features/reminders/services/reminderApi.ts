/**
 * Reminder API Client
 * Handles API calls for reminder management
 */

import { Reminder, ReminderLog, CreateReminderDto, ReminderFilters } from '../types';
import { mockReminderApi } from './mockReminderApi';

class ReminderApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get all reminders
   */
  async getReminders(
    accessToken: string,
    filters?: ReminderFilters
  ): Promise<Reminder[]> {
    // TODO: Replace with real API call
    return mockReminderApi.getReminders(accessToken, filters);
  }

  /**
   * Get reminder by ID
   */
  async getReminderById(accessToken: string, id: string): Promise<Reminder> {
    // TODO: Replace with real API call
    return mockReminderApi.getReminderById(accessToken, id);
  }

  /**
   * Create a new reminder
   */
  async createReminder(
    accessToken: string,
    data: CreateReminderDto
  ): Promise<Reminder> {
    // TODO: Replace with real API call
    return mockReminderApi.createReminder(accessToken, data);
  }

  /**
   * Update a reminder
   */
  async updateReminder(
    accessToken: string,
    id: string,
    data: Partial<Reminder>
  ): Promise<Reminder> {
    // TODO: Replace with real API call
    return mockReminderApi.updateReminder(accessToken, id, data);
  }

  /**
   * Delete a reminder
   */
  async deleteReminder(accessToken: string, id: string): Promise<void> {
    // TODO: Replace with real API call
    return mockReminderApi.deleteReminder(accessToken, id);
  }

  /**
   * Get reminder logs
   */
  async getReminderLogs(
    accessToken: string,
    reminderId: string
  ): Promise<ReminderLog[]> {
    // TODO: Replace with real API call
    return mockReminderApi.getReminderLogs(accessToken, reminderId);
  }

  /**
   * Create a reminder log
   */
  async createReminderLog(
    accessToken: string,
    log: Omit<ReminderLog, 'id' | 'createdAt'>
  ): Promise<ReminderLog> {
    // TODO: Replace with real API call
    return mockReminderApi.createReminderLog(accessToken, log);
  }
}

export const reminderApi = new ReminderApiClient();
