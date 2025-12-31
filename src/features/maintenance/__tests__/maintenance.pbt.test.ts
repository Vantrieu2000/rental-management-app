/**
 * Maintenance Property-Based Tests
 * Tests universal properties of maintenance management
 */

import fc from 'fast-check';
import { getMaintenanceApi } from '../services/maintenanceApi';
import {
  CreateMaintenanceRequestDto,
  UpdateMaintenanceRequestDto,
  ResolveMaintenanceRequestDto,
  MaintenancePriority,
  MaintenanceStatus,
} from '../types';

// Mock access token for testing
const mockAccessToken = 'test-token-123';

// Get the maintenance API (will use mock in tests)
const maintenanceApi = getMaintenanceApi();

// Arbitraries (generators) for property-based testing
const maintenancePriorityArbitrary = (): fc.Arbitrary<MaintenancePriority> =>
  fc.constantFrom('low', 'medium', 'high', 'urgent');

const maintenanceStatusArbitrary = (): fc.Arbitrary<MaintenanceStatus> =>
  fc.constantFrom('pending', 'in_progress', 'completed', 'cancelled');

const titleArbitrary = () =>
  fc.string({ minLength: 3, maxLength: 100 }).filter((s) => s.trim().length >= 3);

const descriptionArbitrary = () =>
  fc.string({ minLength: 10, maxLength: 500 }).filter((s) => s.trim().length >= 10);

const reporterNameArbitrary = () =>
  fc.string({ minLength: 2, maxLength: 100 }).filter((s) => s.trim().length >= 2);

const photosArbitrary = () =>
  fc.array(
    fc
      .integer({ min: 1, max: 10000 })
      .map((id) => `https://example.com/photos/${id}.jpg`),
    { maxLength: 5 }
  );

const notesArbitrary = () =>
  fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: undefined });

const costArbitrary = () => fc.integer({ min: 0, max: 10000000 });

const createMaintenanceRequestDtoArbitrary = (): fc.Arbitrary<CreateMaintenanceRequestDto> =>
  fc.record({
    roomId: fc.string({ minLength: 1, maxLength: 20 }),
    propertyId: fc.string({ minLength: 1, maxLength: 20 }),
    title: titleArbitrary(),
    description: descriptionArbitrary(),
    priority: maintenancePriorityArbitrary(),
    reportedBy: reporterNameArbitrary(),
    photos: fc.option(photosArbitrary(), { nil: undefined }),
    notes: notesArbitrary(),
  });

describe('Maintenance Property-Based Tests', () => {
  /**
   * Feature: rental-management-app, Property 52: Maintenance requests persist all fields
   * Validates: Requirements 15.1
   */
  it('should persist all maintenance request fields on creation', async () => {
    await fc.assert(
      fc.asyncProperty(
        createMaintenanceRequestDtoArbitrary(),
        async (maintenanceData) => {
          // Create maintenance request
          const created = await maintenanceApi.createMaintenanceRequest(
            mockAccessToken,
            maintenanceData
          );

          // Retrieve maintenance request
          const retrieved = await maintenanceApi.getMaintenanceRequestById(
            mockAccessToken,
            created.id
          );

          // Verify all required fields are persisted
          expect(retrieved.roomId).toBe(maintenanceData.roomId);
          expect(retrieved.propertyId).toBe(maintenanceData.propertyId);
          expect(retrieved.title).toBe(maintenanceData.title);
          expect(retrieved.description).toBe(maintenanceData.description);
          expect(retrieved.priority).toBe(maintenanceData.priority);
          expect(retrieved.reportedBy).toBe(maintenanceData.reportedBy);

          // Verify optional fields
          if (maintenanceData.photos) {
            expect(retrieved.photos).toEqual(maintenanceData.photos);
          } else {
            expect(retrieved.photos).toEqual([]);
          }

          if (maintenanceData.notes) {
            expect(retrieved.notes).toBe(maintenanceData.notes);
          }

          // Verify default status is 'pending'
          expect(retrieved.status).toBe('pending');

          // Verify metadata fields exist
          expect(retrieved.id).toBeDefined();
          expect(retrieved.reportedDate).toBeDefined();
          expect(retrieved.createdAt).toBeDefined();
          expect(retrieved.updatedAt).toBeDefined();
        }
      ),
      { numRuns: 5 }
    );
  }, 30000); // 30 second timeout for property test

  /**
   * Feature: rental-management-app, Property 53: Maintenance requests display all statuses
   * Validates: Requirements 15.2
   */
  it('should display maintenance requests with all status types', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.tuple(createMaintenanceRequestDtoArbitrary(), maintenanceStatusArbitrary()),
          { minLength: 4, maxLength: 10 }
        ),
        async (requestsWithStatuses) => {
          // Ensure we have at least one of each status
          const statuses: MaintenanceStatus[] = [
            'pending',
            'in_progress',
            'completed',
            'cancelled',
          ];
          const createdRequests = [];

          // Create requests with different statuses
          for (let i = 0; i < requestsWithStatuses.length; i++) {
            const [requestData, status] = requestsWithStatuses[i];

            // Use predefined status for first 4 requests to ensure coverage
            const assignedStatus = i < 4 ? statuses[i] : status;

            const created = await maintenanceApi.createMaintenanceRequest(
              mockAccessToken,
              requestData
            );

            // Update status if not pending
            if (assignedStatus !== 'pending') {
              await maintenanceApi.updateMaintenanceRequest(
                mockAccessToken,
                created.id,
                { status: assignedStatus }
              );
            }

            createdRequests.push({ ...created, status: assignedStatus });
          }

          // Retrieve all maintenance requests
          const allRequests = await maintenanceApi.getMaintenanceRequests(
            mockAccessToken
          );

          // Verify all created requests are in the list
          for (const created of createdRequests) {
            const found = allRequests.find((r) => r.id === created.id);
            expect(found).toBeDefined();
            expect(found?.status).toBe(created.status);
          }

          // Verify we have at least one of each status
          const foundStatuses = new Set(allRequests.map((r) => r.status));
          for (const status of statuses) {
            expect(foundStatuses.has(status)).toBe(true);
          }
        }
      ),
      { numRuns: 3 }
    );
  }, 45000); // 45 second timeout for complex test

  /**
   * Feature: rental-management-app, Property 54: Request resolution records data
   * Validates: Requirements 15.3
   */
  it('should record resolution data when maintenance request is resolved', async () => {
    await fc.assert(
      fc.asyncProperty(
        createMaintenanceRequestDtoArbitrary(),
        fc.date({ min: new Date('2025-01-01'), max: new Date('2026-12-31') }),
        fc.option(costArbitrary(), { nil: undefined }),
        notesArbitrary(),
        async (maintenanceData, completedDate, cost, notes) => {
          // Create maintenance request
          const created = await maintenanceApi.createMaintenanceRequest(
            mockAccessToken,
            maintenanceData
          );

          // Resolve the maintenance request
          const resolveData: ResolveMaintenanceRequestDto = {
            completedDate,
            cost,
            notes,
          };

          const resolved = await maintenanceApi.resolveMaintenanceRequest(
            mockAccessToken,
            created.id,
            resolveData
          );

          // Verify resolution data is recorded
          expect(resolved.status).toBe('completed');
          expect(resolved.completedDate).toBeDefined();
          expect(new Date(resolved.completedDate!).toDateString()).toBe(
            completedDate.toDateString()
          );

          if (cost !== undefined) {
            expect(resolved.cost).toBe(cost);
          }

          if (notes) {
            expect(resolved.notes).toBe(notes);
          }

          // Retrieve and verify persistence
          const retrieved = await maintenanceApi.getMaintenanceRequestById(
            mockAccessToken,
            created.id
          );

          expect(retrieved.status).toBe('completed');
          expect(retrieved.completedDate).toBeDefined();
          expect(new Date(retrieved.completedDate!).toDateString()).toBe(
            completedDate.toDateString()
          );

          if (cost !== undefined) {
            expect(retrieved.cost).toBe(cost);
          }

          if (notes) {
            expect(retrieved.notes).toBe(notes);
          }
        }
      ),
      { numRuns: 5 }
    );
  }, 30000);

  /**
   * Feature: rental-management-app, Property 55: Photo attachments persist
   * Validates: Requirements 15.4
   */
  it('should persist photo attachments for maintenance requests', async () => {
    await fc.assert(
      fc.asyncProperty(
        createMaintenanceRequestDtoArbitrary(),
        fc.array(
          fc
            .integer({ min: 1, max: 10000 })
            .map((id) => `file:///photos/test-${id}.jpg`),
          { minLength: 1, maxLength: 3 }
        ),
        async (maintenanceData, photoUris) => {
          // Create maintenance request without photos initially
          const created = await maintenanceApi.createMaintenanceRequest(
            mockAccessToken,
            { ...maintenanceData, photos: [] }
          );

          // Upload photos
          const uploadedPhotoUrls: string[] = [];
          for (const photoUri of photoUris) {
            const photoUrl = await maintenanceApi.uploadPhoto(
              mockAccessToken,
              created.id,
              photoUri
            );
            uploadedPhotoUrls.push(photoUrl);
          }

          // Retrieve maintenance request and verify photos
          const retrieved = await maintenanceApi.getMaintenanceRequestById(
            mockAccessToken,
            created.id
          );

          // Verify all photos are persisted
          expect(retrieved.photos.length).toBe(photoUris.length);

          // Verify each uploaded photo URL is in the retrieved photos
          for (const photoUrl of uploadedPhotoUrls) {
            expect(retrieved.photos).toContain(photoUrl);
          }

          // Verify photos array maintains order (if implementation preserves order)
          // This is a stronger property that may or may not hold depending on implementation
          if (retrieved.photos.length === uploadedPhotoUrls.length) {
            for (let i = 0; i < uploadedPhotoUrls.length; i++) {
              expect(retrieved.photos[i]).toBe(uploadedPhotoUrls[i]);
            }
          }
        }
      ),
      { numRuns: 5 }
    );
  }, 45000); // 45 second timeout for photo upload tests
});
