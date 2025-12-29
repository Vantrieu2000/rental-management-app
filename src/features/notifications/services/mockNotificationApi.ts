/**
 * Mock Notification API
 * Fake data for development
 * 
 * BACKEND TODO: Implement these endpoints:
 * - GET    /api/notifications
 * - GET    /api/notifications/summary
 * - PUT    /api/notifications/:id/read
 */

import { Notification, NotificationFilters, NotificationSummary } from '../types';
import { mockPaymentApi } from '@/features/payments/services/mockPaymentApi';
import { mockRoomApi } from '@/features/rooms/services/mockRoomApi';
import { mockTenantApi } from '@/features/tenants/services/mockTenantApi';

const delay = (ms: number = 10) => new Promise((resolve) => setTimeout(resolve, ms));

class MockNotificationApiClient {
  /**
   * Get all notifications (unpaid/overdue payments)
   * This identifies rooms with unpaid fees and creates notification objects
   */
  async getNotifications(
    accessToken: string,
    filters?: NotificationFilters
  ): Promise<Notification[]> {
    await delay();

    // Get all payments that are unpaid, partial, or overdue
    const payments = await mockPaymentApi.getPayments(accessToken, {
      propertyId: filters?.propertyId,
    });

    const unpaidPayments = payments.filter(
      (p) => p.status === 'unpaid' || p.status === 'partial' || p.status === 'overdue'
    );

    // Build notifications from unpaid payments
    const notifications: Notification[] = [];
    const now = new Date();

    for (const payment of unpaidPayments) {
      try {
        // Get room details
        const room = await mockRoomApi.getRoomById(accessToken, payment.roomId);
        
        // Get tenant details
        let tenantName = 'Unknown Tenant';
        if (payment.tenantId) {
          try {
            const tenant = await mockTenantApi.getTenantById(accessToken, payment.tenantId);
            tenantName = tenant.name;
          } catch (error) {
            // Tenant not found, use default name
          }
        }

        // Calculate days overdue
        const daysOverdue = Math.max(
          0,
          Math.floor((now.getTime() - payment.dueDate.getTime()) / (1000 * 60 * 60 * 24))
        );

        // Calculate remaining amount
        const remainingAmount = payment.totalAmount - payment.paidAmount;

        const notification: Notification = {
          id: `notif-${payment.id}`,
          roomId: payment.roomId,
          roomCode: room.roomCode,
          roomName: room.roomName,
          tenantName,
          propertyId: payment.propertyId,
          paymentId: payment.id,
          totalAmount: payment.totalAmount,
          paidAmount: payment.paidAmount,
          remainingAmount,
          dueDate: payment.dueDate,
          daysOverdue,
          status: payment.status,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        };

        // Apply filters
        if (filters?.status && notification.status !== filters.status) {
          continue;
        }

        if (filters?.minDaysOverdue !== undefined && daysOverdue < filters.minDaysOverdue) {
          continue;
        }

        notifications.push(notification);
      } catch (error) {
        // Skip this payment if room or tenant not found
        console.warn(`Failed to create notification for payment ${payment.id}:`, error);
      }
    }

    // Sort by days overdue (most overdue first)
    notifications.sort((a, b) => b.daysOverdue - a.daysOverdue);

    return notifications;
  }

  /**
   * Get notification summary statistics
   */
  async getNotificationSummary(
    accessToken: string,
    propertyId?: string
  ): Promise<NotificationSummary> {
    await delay();

    const notifications = await this.getNotifications(accessToken, { propertyId });

    const totalUnpaid = notifications.filter((n) => n.status === 'unpaid').length;
    const totalOverdue = notifications.filter((n) => n.daysOverdue > 0).length;
    const totalAmount = notifications.reduce((sum, n) => sum + n.remainingAmount, 0);
    const mostOverdueDays = notifications.length > 0 ? notifications[0].daysOverdue : 0;

    return {
      totalUnpaid,
      totalOverdue,
      totalAmount,
      mostOverdueDays,
    };
  }

  /**
   * Mark notification as read (handled by marking payment as paid)
   * This is a placeholder - actual implementation would mark payment as paid
   */
  async markAsRead(accessToken: string, notificationId: string): Promise<void> {
    await delay();
    // In real implementation, this would be handled by the payment API
    // when marking a payment as paid
  }
}

export const mockNotificationApi = new MockNotificationApiClient();
