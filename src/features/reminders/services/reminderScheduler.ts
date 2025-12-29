/**
 * Reminder Scheduler Service
 * Handles scheduling and managing reminders for payments
 */

import * as Notifications from 'expo-notifications';
import { addDays, isBefore, differenceInDays } from 'date-fns';
import { Reminder, CreateReminderDto, ReminderLog } from '../types';
import { PaymentRecord } from '../../payments/types';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class ReminderSchedulerService {
  private defaultDaysBefore = 3;
  private idCounter = 0;

  /**
   * Generate a unique ID
   */
  private generateUniqueId(prefix: string): string {
    this.idCounter++;
    return `${prefix}-${Date.now()}-${this.idCounter}`;
  }

  /**
   * Schedule a due date reminder (3 days before due date)
   */
  async scheduleDueDateReminder(payment: PaymentRecord): Promise<Reminder> {
    const scheduledDate = addDays(new Date(payment.dueDate), -this.defaultDaysBefore);
    
    // Don't schedule if the date has already passed
    if (isBefore(scheduledDate, new Date())) {
      throw new Error('Cannot schedule reminder for past date');
    }

    const reminder: Reminder = {
      id: this.generateUniqueId(`reminder-${payment.id}`),
      paymentId: payment.id,
      roomId: payment.roomId,
      propertyId: payment.propertyId,
      type: 'due_date',
      scheduledDate,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Schedule the local notification
    await this.scheduleLocalNotification(reminder, payment);

    return reminder;
  }

  /**
   * Schedule a custom reminder with specific interval
   */
  async scheduleCustomReminder(
    payment: PaymentRecord,
    daysBefore: number
  ): Promise<Reminder> {
    const scheduledDate = addDays(new Date(payment.dueDate), -daysBefore);
    
    if (isBefore(scheduledDate, new Date())) {
      throw new Error('Cannot schedule reminder for past date');
    }

    const reminder: Reminder = {
      id: this.generateUniqueId(`reminder-${payment.id}-custom`),
      paymentId: payment.id,
      roomId: payment.roomId,
      propertyId: payment.propertyId,
      type: 'custom',
      scheduledDate,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.scheduleLocalNotification(reminder, payment);

    return reminder;
  }

  /**
   * Schedule recurring reminders for late payers
   */
  async scheduleRecurringReminder(
    payment: PaymentRecord,
    intervalDays: number
  ): Promise<Reminder> {
    const now = new Date();
    const scheduledDate = addDays(now, intervalDays);

    const reminder: Reminder = {
      id: this.generateUniqueId(`reminder-${payment.id}-recurring`),
      paymentId: payment.id,
      roomId: payment.roomId,
      propertyId: payment.propertyId,
      type: 'recurring',
      scheduledDate,
      intervalDays,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.scheduleLocalNotification(reminder, payment);

    return reminder;
  }

  /**
   * Schedule the actual local notification using Expo Notifications
   */
  private async scheduleLocalNotification(
    reminder: Reminder,
    payment: PaymentRecord
  ): Promise<string> {
    const trigger = new Date(reminder.scheduledDate);
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Payment Reminder',
        body: this.getNotificationBody(reminder, payment),
        data: {
          reminderId: reminder.id,
          paymentId: payment.id,
          roomId: payment.roomId,
        },
      },
      trigger,
    });

    return notificationId;
  }

  /**
   * Get notification body text based on reminder type
   */
  private getNotificationBody(reminder: Reminder, payment: PaymentRecord): string {
    const daysUntilDue = differenceInDays(new Date(payment.dueDate), new Date());
    
    switch (reminder.type) {
      case 'due_date':
        return `Payment due in ${daysUntilDue} days. Amount: ${payment.totalAmount.toLocaleString()} VND`;
      case 'recurring':
        return `Overdue payment reminder. Amount: ${payment.totalAmount.toLocaleString()} VND`;
      case 'custom':
        return `Payment reminder. Due date: ${new Date(payment.dueDate).toLocaleDateString()}. Amount: ${payment.totalAmount.toLocaleString()} VND`;
      default:
        return `Payment reminder for ${payment.totalAmount.toLocaleString()} VND`;
    }
  }

  /**
   * Cancel a scheduled reminder
   */
  async cancelReminder(reminderId: string): Promise<void> {
    // In a real implementation, we would look up the notification ID
    // For now, we'll cancel all scheduled notifications for this reminder
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Log a sent reminder
   */
  async logReminder(
    reminder: Reminder,
    recipientId: string,
    notificationId?: string
  ): Promise<ReminderLog> {
    const log: ReminderLog = {
      id: this.generateUniqueId(`log-${reminder.id}`),
      reminderId: reminder.id,
      paymentId: reminder.paymentId,
      roomId: reminder.roomId,
      sentAt: new Date(),
      recipientId,
      notificationId,
      delivered: true,
      createdAt: new Date(),
    };

    // In a real implementation, this would be saved to the database
    return log;
  }

  /**
   * Check if a reminder should fire
   */
  shouldFireReminder(reminder: Reminder): boolean {
    const now = new Date();
    const scheduledDate = new Date(reminder.scheduledDate);
    
    return (
      reminder.status === 'scheduled' &&
      scheduledDate.getTime() <= now.getTime()
    );
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

export const reminderScheduler = new ReminderSchedulerService();
