/**
 * Mock for expo-notifications
 */

export const setNotificationHandler = jest.fn();

export const scheduleNotificationAsync = jest.fn().mockResolvedValue('mock-notification-id');

export const cancelAllScheduledNotificationsAsync = jest.fn().mockResolvedValue(undefined);

export const getPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });

export const requestPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });

export const getAllScheduledNotificationsAsync = jest.fn().mockResolvedValue([]);

export interface NotificationRequest {
  identifier: string;
  content: {
    title: string;
    body: string;
    data?: Record<string, any>;
  };
  trigger: Date | null;
}
