/**
 * Query Keys Tests
 */

import {
  roomKeys,
  tenantKeys,
  paymentKeys,
  propertyKeys,
  notificationKeys,
  reminderKeys,
  maintenanceKeys,
  reportKeys,
  authKeys,
  dashboardKeys,
  getEntityKeys,
} from '../queryKeys';

describe('Query Keys', () => {
  describe('roomKeys', () => {
    it('should generate correct keys for all rooms', () => {
      expect(roomKeys.all).toEqual(['rooms']);
    });

    it('should generate correct keys for room lists', () => {
      expect(roomKeys.lists()).toEqual(['rooms', 'list']);
    });

    it('should generate correct keys for filtered room list', () => {
      const filters = { status: 'occupied', propertyId: '123' };
      expect(roomKeys.list(filters)).toEqual(['rooms', 'list', filters]);
    });

    it('should generate correct keys for room details', () => {
      expect(roomKeys.details()).toEqual(['rooms', 'detail']);
    });

    it('should generate correct keys for specific room detail', () => {
      expect(roomKeys.detail('room-123')).toEqual(['rooms', 'detail', 'room-123']);
    });

    it('should generate correct keys for room search', () => {
      expect(roomKeys.search('test', 'prop-123')).toEqual([
        'rooms',
        'search',
        'test',
        'prop-123',
      ]);
    });
  });

  describe('tenantKeys', () => {
    it('should generate correct keys for all tenants', () => {
      expect(tenantKeys.all).toEqual(['tenants']);
    });

    it('should generate correct keys for tenant history', () => {
      expect(tenantKeys.history('room-123')).toEqual(['tenants', 'history', 'room-123']);
    });
  });

  describe('paymentKeys', () => {
    it('should generate correct keys for all payments', () => {
      expect(paymentKeys.all).toEqual(['payments']);
    });

    it('should generate correct keys for overdue payments', () => {
      expect(paymentKeys.overdue('prop-123')).toEqual(['payments', 'overdue', 'prop-123']);
    });

    it('should generate correct keys for payment history', () => {
      expect(paymentKeys.history('room-123')).toEqual(['payments', 'history', 'room-123']);
    });

    it('should generate correct keys for payment statistics', () => {
      const filters = { startDate: '2024-01-01', endDate: '2024-12-31' };
      expect(paymentKeys.statistics(filters)).toEqual(['payments', 'statistics', filters]);
    });
  });

  describe('propertyKeys', () => {
    it('should generate correct keys for all properties', () => {
      expect(propertyKeys.all).toEqual(['properties']);
    });

    it('should generate correct keys for property statistics', () => {
      expect(propertyKeys.statistics('prop-123')).toEqual(['properties', 'statistics', 'prop-123']);
    });
  });

  describe('notificationKeys', () => {
    it('should generate correct keys for all notifications', () => {
      expect(notificationKeys.all).toEqual(['notifications']);
    });

    it('should generate correct keys for user notifications', () => {
      expect(notificationKeys.list('user-123')).toEqual(['notifications', 'list', 'user-123']);
    });

    it('should generate correct keys for unread notifications', () => {
      expect(notificationKeys.unread('user-123')).toEqual(['notifications', 'unread', 'user-123']);
    });
  });

  describe('reminderKeys', () => {
    it('should generate correct keys for all reminders', () => {
      expect(reminderKeys.all).toEqual(['reminders']);
    });

    it('should generate correct keys for reminder detail', () => {
      expect(reminderKeys.detail('reminder-123')).toEqual(['reminders', 'detail', 'reminder-123']);
    });
  });

  describe('maintenanceKeys', () => {
    it('should generate correct keys for all maintenance', () => {
      expect(maintenanceKeys.all).toEqual(['maintenance']);
    });

    it('should generate correct keys for maintenance by room', () => {
      expect(maintenanceKeys.byRoom('room-123')).toEqual(['maintenance', 'room', 'room-123']);
    });
  });

  describe('reportKeys', () => {
    it('should generate correct keys for all reports', () => {
      expect(reportKeys.all).toEqual(['reports']);
    });

    it('should generate correct keys for report generation', () => {
      const filters = { startDate: '2024-01-01', endDate: '2024-12-31' };
      expect(reportKeys.generate(filters)).toEqual(['reports', 'generate', filters]);
    });
  });

  describe('authKeys', () => {
    it('should generate correct keys for auth', () => {
      expect(authKeys.all).toEqual(['auth']);
    });

    it('should generate correct keys for user', () => {
      expect(authKeys.user()).toEqual(['auth', 'user']);
    });

    it('should generate correct keys for profile', () => {
      expect(authKeys.profile()).toEqual(['auth', 'profile']);
    });
  });

  describe('dashboardKeys', () => {
    it('should generate correct keys for dashboard', () => {
      expect(dashboardKeys.all).toEqual(['dashboard']);
    });

    it('should generate correct keys for statistics', () => {
      expect(dashboardKeys.statistics('prop-123')).toEqual(['dashboard', 'statistics', 'prop-123']);
    });

    it('should generate correct keys for recent activity', () => {
      expect(dashboardKeys.recentActivity(10)).toEqual(['dashboard', 'activity', 10]);
    });
  });

  describe('getEntityKeys', () => {
    it('should return correct keys for known entities', () => {
      expect(getEntityKeys('rooms')).toEqual(['rooms']);
      expect(getEntityKeys('tenants')).toEqual(['tenants']);
      expect(getEntityKeys('payments')).toEqual(['payments']);
      expect(getEntityKeys('properties')).toEqual(['properties']);
      expect(getEntityKeys('notifications')).toEqual(['notifications']);
      expect(getEntityKeys('reminders')).toEqual(['reminders']);
      expect(getEntityKeys('maintenance')).toEqual(['maintenance']);
      expect(getEntityKeys('reports')).toEqual(['reports']);
      expect(getEntityKeys('auth')).toEqual(['auth']);
      expect(getEntityKeys('dashboard')).toEqual(['dashboard']);
    });

    it('should return empty array for unknown entities', () => {
      expect(getEntityKeys('unknown')).toEqual([]);
    });
  });
});
