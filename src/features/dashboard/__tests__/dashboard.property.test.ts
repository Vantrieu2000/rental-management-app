/**
 * Dashboard Property-Based Tests
 * Tests universal properties of dashboard functionality
 */

import fc from 'fast-check';
import { DashboardStatistics, RecentActivity, OverduePayment } from '../types';

// Mock access token for testing
const mockAccessToken = 'test-token-123';

// Mock the API config to ensure we use mock API
jest.mock('@/shared/config/api.config', () => ({
  shouldUseMock: jest.fn(() => true),
  API_CONFIG: {
    useMockData: {
      dashboard: true,
    },
  },
}));

// Import after mocking
const { getDashboardApi } = require('../services/dashboardApi');
const dashboardApi = getDashboardApi();

describe('Dashboard Property-Based Tests', () => {
  /**
   * Feature: rental-management-app, Property 29: Pull-to-refresh reloads data
   * Validates: Requirements 8.2
   */
  it('should reload all dashboard data when pull-to-refresh is triggered', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.option(fc.string({ minLength: 5, maxLength: 20 }), { nil: undefined }), // propertyId
        async (propertyId) => {
          // First fetch - simulate initial load
          const initialStats = await dashboardApi.getDashboardStatistics(
            mockAccessToken,
            propertyId
          );
          const initialActivity = await dashboardApi.getRecentActivity(
            mockAccessToken,
            propertyId,
            5
          );
          const initialOverdue = await dashboardApi.getOverduePayments(
            mockAccessToken,
            propertyId
          );

          // Verify initial data is loaded
          expect(initialStats).toBeDefined();
          expect(initialStats.totalRooms).toBeGreaterThanOrEqual(0);
          expect(initialStats.occupiedRooms).toBeGreaterThanOrEqual(0);
          expect(initialStats.vacantRooms).toBeGreaterThanOrEqual(0);
          expect(initialStats.unpaidRooms).toBeGreaterThanOrEqual(0);
          expect(initialStats.totalRevenue).toBeGreaterThanOrEqual(0);
          expect(initialStats.unpaidAmount).toBeGreaterThanOrEqual(0);
          expect(initialStats.occupancyRate).toBeGreaterThanOrEqual(0);
          expect(initialStats.occupancyRate).toBeLessThanOrEqual(100);

          expect(initialActivity).toBeDefined();
          expect(Array.isArray(initialActivity)).toBe(true);

          expect(initialOverdue).toBeDefined();
          expect(Array.isArray(initialOverdue)).toBe(true);

          // Second fetch - simulate pull-to-refresh
          const refreshedStats = await dashboardApi.getDashboardStatistics(
            mockAccessToken,
            propertyId
          );
          const refreshedActivity = await dashboardApi.getRecentActivity(
            mockAccessToken,
            propertyId,
            5
          );
          const refreshedOverdue = await dashboardApi.getOverduePayments(
            mockAccessToken,
            propertyId
          );

          // Verify refreshed data is loaded (data structure should be consistent)
          expect(refreshedStats).toBeDefined();
          expect(refreshedStats.totalRooms).toBeGreaterThanOrEqual(0);
          expect(refreshedStats.occupiedRooms).toBeGreaterThanOrEqual(0);
          expect(refreshedStats.vacantRooms).toBeGreaterThanOrEqual(0);
          expect(refreshedStats.unpaidRooms).toBeGreaterThanOrEqual(0);
          expect(refreshedStats.totalRevenue).toBeGreaterThanOrEqual(0);
          expect(refreshedStats.unpaidAmount).toBeGreaterThanOrEqual(0);
          expect(refreshedStats.occupancyRate).toBeGreaterThanOrEqual(0);
          expect(refreshedStats.occupancyRate).toBeLessThanOrEqual(100);

          expect(refreshedActivity).toBeDefined();
          expect(Array.isArray(refreshedActivity)).toBe(true);

          expect(refreshedOverdue).toBeDefined();
          expect(Array.isArray(refreshedOverdue)).toBe(true);

          // Verify data structure consistency (same fields exist)
          expect(Object.keys(refreshedStats).sort()).toEqual(Object.keys(initialStats).sort());

          // Verify activity items have required fields
          refreshedActivity.forEach((activity) => {
            expect(activity.id).toBeDefined();
            expect(activity.type).toBeDefined();
            expect(activity.title).toBeDefined();
            expect(activity.description).toBeDefined();
            expect(activity.timestamp).toBeDefined();
            expect(['payment', 'tenant_move_in', 'tenant_move_out', 'maintenance', 'room_created']).toContain(activity.type);
          });

          // Verify overdue payments have required fields
          refreshedOverdue.forEach((payment) => {
            expect(payment.id).toBeDefined();
            expect(payment.roomCode).toBeDefined();
            expect(payment.roomName).toBeDefined();
            expect(payment.tenantName).toBeDefined();
            expect(payment.amount).toBeGreaterThan(0);
            expect(payment.dueDate).toBeDefined();
            expect(payment.daysOverdue).toBeGreaterThan(0);
          });

          // Verify statistics invariants
          expect(refreshedStats.totalRooms).toBeGreaterThanOrEqual(
            refreshedStats.occupiedRooms + refreshedStats.vacantRooms
          );
          expect(refreshedStats.unpaidRooms).toBeLessThanOrEqual(refreshedStats.totalRooms);
          expect(refreshedStats.occupiedRooms).toBeLessThanOrEqual(refreshedStats.totalRooms);
          expect(refreshedStats.vacantRooms).toBeLessThanOrEqual(refreshedStats.totalRooms);

          // Verify occupancy rate calculation
          if (refreshedStats.totalRooms > 0) {
            const expectedOccupancyRate = Math.round(
              (refreshedStats.occupiedRooms / refreshedStats.totalRooms) * 100
            );
            expect(refreshedStats.occupancyRate).toBe(expectedOccupancyRate);
          }
        }
      ),
      { numRuns: 10 } // Reduced to 10 for faster test execution
    );
  }, 60000); // 60 second timeout for property test

  /**
   * Additional test: Verify dashboard statistics consistency
   */
  it('should maintain consistent statistics across multiple refreshes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.option(fc.string({ minLength: 5, maxLength: 20 }), { nil: undefined }),
        fc.integer({ min: 2, max: 5 }), // number of refreshes
        async (propertyId, numRefreshes) => {
          const allStats: DashboardStatistics[] = [];

          // Perform multiple refreshes
          for (let i = 0; i < numRefreshes; i++) {
            const stats = await dashboardApi.getDashboardStatistics(mockAccessToken, propertyId);
            allStats.push(stats);
          }

          // Verify all fetches returned valid data
          expect(allStats.length).toBe(numRefreshes);

          // Verify each fetch has consistent structure
          allStats.forEach((stats) => {
            expect(stats.totalRooms).toBeGreaterThanOrEqual(0);
            expect(stats.occupiedRooms).toBeGreaterThanOrEqual(0);
            expect(stats.vacantRooms).toBeGreaterThanOrEqual(0);
            expect(stats.maintenanceRooms).toBeGreaterThanOrEqual(0);
            expect(stats.unpaidRooms).toBeGreaterThanOrEqual(0);
            expect(stats.totalRevenue).toBeGreaterThanOrEqual(0);
            expect(stats.unpaidAmount).toBeGreaterThanOrEqual(0);
            expect(stats.occupancyRate).toBeGreaterThanOrEqual(0);
            expect(stats.occupancyRate).toBeLessThanOrEqual(100);

            // Verify invariants
            expect(stats.totalRooms).toBeGreaterThanOrEqual(
              stats.occupiedRooms + stats.vacantRooms + stats.maintenanceRooms
            );
          });
        }
      ),
      { numRuns: 5 } // Reduced to 5 for faster execution
    );
  }, 60000); // 60 second timeout

  /**
   * Additional test: Verify recent activity ordering
   */
  it('should return recent activity sorted by timestamp (most recent first)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.option(fc.string({ minLength: 5, maxLength: 20 }), { nil: undefined }),
        fc.integer({ min: 5, max: 20 }), // limit
        async (propertyId, limit) => {
          const activities = await dashboardApi.getRecentActivity(
            mockAccessToken,
            propertyId,
            limit
          );

          // Verify activities are returned
          expect(Array.isArray(activities)).toBe(true);
          expect(activities.length).toBeLessThanOrEqual(limit);

          // Verify activities are sorted by timestamp (descending)
          for (let i = 0; i < activities.length - 1; i++) {
            const currentTime = new Date(activities[i].timestamp).getTime();
            const nextTime = new Date(activities[i + 1].timestamp).getTime();
            expect(currentTime).toBeGreaterThanOrEqual(nextTime);
          }

          // Verify each activity has required fields
          activities.forEach((activity) => {
            expect(activity.id).toBeDefined();
            expect(activity.type).toBeDefined();
            expect(activity.title).toBeDefined();
            expect(activity.description).toBeDefined();
            expect(activity.timestamp).toBeDefined();
            expect(new Date(activity.timestamp).getTime()).not.toBeNaN();
          });
        }
      ),
      { numRuns: 10 } // Reduced to 10 for faster execution
    );
  }, 60000); // 60 second timeout

  /**
   * Additional test: Verify overdue payments sorting
   */
  it('should return overdue payments sorted by days overdue (descending)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.option(fc.string({ minLength: 5, maxLength: 20 }), { nil: undefined }),
        async (propertyId) => {
          const overduePayments = await dashboardApi.getOverduePayments(
            mockAccessToken,
            propertyId
          );

          // Verify overdue payments are returned
          expect(Array.isArray(overduePayments)).toBe(true);

          // Verify payments are sorted by days overdue (descending)
          for (let i = 0; i < overduePayments.length - 1; i++) {
            expect(overduePayments[i].daysOverdue).toBeGreaterThanOrEqual(
              overduePayments[i + 1].daysOverdue
            );
          }

          // Verify each payment has required fields and valid data
          overduePayments.forEach((payment) => {
            expect(payment.id).toBeDefined();
            expect(payment.roomCode).toBeDefined();
            expect(payment.roomName).toBeDefined();
            expect(payment.tenantName).toBeDefined();
            expect(payment.amount).toBeGreaterThan(0);
            expect(payment.dueDate).toBeDefined();
            expect(payment.daysOverdue).toBeGreaterThan(0);

            // Verify dueDate is in the past
            const dueDate = new Date(payment.dueDate);
            const now = new Date();
            expect(dueDate.getTime()).toBeLessThan(now.getTime());
          });
        }
      ),
      { numRuns: 10 } // Reduced to 10 for faster execution
    );
  }, 60000); // 60 second timeout
});
