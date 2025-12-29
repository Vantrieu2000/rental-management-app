/**
 * Notification API Client
 * Real API implementation (to be connected to backend)
 */

import { Notification, NotificationFilters, NotificationSummary } from '../types';
import { mockNotificationApi } from './mockNotificationApi';

class NotificationApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get all notifications
   */
  async getNotifications(
    accessToken: string,
    filters?: NotificationFilters
  ): Promise<Notification[]> {
    // TODO: Replace with real API call
    // const response = await fetch(`${this.baseUrl}/api/notifications`, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });
    // return response.json();

    return mockNotificationApi.getNotifications(accessToken, filters);
  }

  /**
   * Get notification summary
   */
  async getNotificationSummary(
    accessToken: string,
    propertyId?: string
  ): Promise<NotificationSummary> {
    // TODO: Replace with real API call
    return mockNotificationApi.getNotificationSummary(accessToken, propertyId);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(accessToken: string, notificationId: string): Promise<void> {
    // TODO: Replace with real API call
    return mockNotificationApi.markAsRead(accessToken, notificationId);
  }
}

export const notificationApi = new NotificationApiClient();
