/**
 * Property-based tests for offline sync round-trip
 * Feature: rental-management-app, Property 34: Offline changes sync when online
 * Validates: Requirements 9.3
 */
import fc from 'fast-check';
import {
  initializeRealm,
  closeRealm,
  clearRealm,
  queueChange,
  getPendingChanges,
  syncPendingChanges,
  setApiClient,
  cacheRoom,
  getCachedRooms,
} from '../index';
import { Room } from '../../../shared/types/entities';
import { useSyncStore } from '../../../store/sync.store';

// Mock API client
const mockApiClient = {
  createRoom: jest.fn(),
  updateRoom: jest.fn(),
  deleteRoom: jest.fn(),
  createTenant: jest.fn(),
  updateTenant: jest.fn(),
  deleteTenant: jest.fn(),
  createPayment: jest.fn(),
  updatePayment: jest.fn(),
  deletePayment: jest.fn(),
  createProperty: jest.fn(),
  updateProperty: jest.fn(),
  deleteProperty: jest.fn(),
};

// Arbitraries for generating test data
const roomArbitrary = (): fc.Arbitrary<Room> =>
  fc.record({
    id: fc.uuid(),
    propertyId: fc.uuid(),
    roomCode: fc.string({ minLength: 1, maxLength: 10 }),
    roomName: fc.string({ minLength: 1, maxLength: 50 }),
    status: fc.constantFrom('vacant', 'occupied', 'maintenance') as fc.Arbitrary<Room['status']>,
    rentalPrice: fc.double({ min: 0, max: 100000000, noNaN: true }),
    electricityFee: fc.double({ min: 0, max: 10000000, noNaN: true }),
    waterFee: fc.double({ min: 0, max: 10000000, noNaN: true }),
    garbageFee: fc.double({ min: 0, max: 1000000, noNaN: true }),
    parkingFee: fc.double({ min: 0, max: 5000000, noNaN: true }),
    currentTenantId: fc.option(fc.uuid(), { nil: undefined }),
    createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
    updatedAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
  });

describe('Offline Sync Round-Trip Property Tests', () => {
  beforeAll(async () => {
    await initializeRealm();
    setApiClient(mockApiClient);
  });

  beforeEach(async () => {
    await clearRealm();
    jest.clearAllMocks();
    // Set online status
    useSyncStore.getState().setOnline(true);
  });

  afterAll(() => {
    closeRealm();
  });

  /**
   * Feature: rental-management-app, Property 34: Offline changes sync when online
   * Validates: Requirements 9.3
   *
   * For any changes made while offline, reconnecting to the network should
   * synchronize them to the server.
   */
  it('should sync create operations when online', async () => {
    await fc.assert(
      fc.asyncProperty(
        roomArbitrary().filter(
          (room) => !isNaN(room.createdAt.getTime()) && !isNaN(room.updatedAt.getTime())
        ),
        async (room) => {
          // Mock successful API response
          mockApiClient.createRoom.mockResolvedValue(room);

          // Queue a create operation (simulating offline change)
          queueChange({
            entityType: 'Room',
            entityId: room.id,
            operation: 'create',
            data: room,
            timestamp: new Date(),
          });

          // Verify change is queued
          const pendingBefore = getPendingChanges();
          expect(pendingBefore.length).toBeGreaterThan(0);

          // Sync pending changes (simulating reconnection)
          await syncPendingChanges();

          // Verify API was called
          expect(mockApiClient.createRoom).toHaveBeenCalledWith(room);

          // Verify change was removed from queue
          const pendingAfter = getPendingChanges();
          const stillPending = pendingAfter.find(
            (c) => c.entityId === room.id && c.operation === 'create'
          );
          expect(stillPending).toBeUndefined();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Feature: rental-management-app, Property 34: Offline changes sync when online
   * Validates: Requirements 9.3
   *
   * For any update operations made offline, they should sync when online.
   */
  it('should sync update operations when online', async () => {
    await fc.assert(
      fc.asyncProperty(
        roomArbitrary().filter(
          (room) => !isNaN(room.createdAt.getTime()) && !isNaN(room.updatedAt.getTime())
        ),
        async (room) => {
          // Mock successful API response
          mockApiClient.updateRoom.mockResolvedValue(room);

          // Queue an update operation
          queueChange({
            entityType: 'Room',
            entityId: room.id,
            operation: 'update',
            data: room,
            timestamp: new Date(),
          });

          // Sync pending changes
          await syncPendingChanges();

          // Verify API was called
          expect(mockApiClient.updateRoom).toHaveBeenCalledWith(room.id, room);

          // Verify change was removed from queue
          const pendingAfter = getPendingChanges();
          const stillPending = pendingAfter.find(
            (c) => c.entityId === room.id && c.operation === 'update'
          );
          expect(stillPending).toBeUndefined();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Feature: rental-management-app, Property 34: Offline changes sync when online
   * Validates: Requirements 9.3
   *
   * For any delete operations made offline, they should sync when online.
   */
  it('should sync delete operations when online', async () => {
    await fc.assert(
      fc.asyncProperty(fc.uuid(), async (roomId) => {
        // Mock successful API response
        mockApiClient.deleteRoom.mockResolvedValue(undefined);

        // Queue a delete operation
        queueChange({
          entityType: 'Room',
          entityId: roomId,
          operation: 'delete',
          data: { id: roomId },
          timestamp: new Date(),
        });

        // Sync pending changes
        await syncPendingChanges();

        // Verify API was called
        expect(mockApiClient.deleteRoom).toHaveBeenCalledWith(roomId);

        // Verify change was removed from queue
        const pendingAfter = getPendingChanges();
        const stillPending = pendingAfter.find(
          (c) => c.entityId === roomId && c.operation === 'delete'
        );
        expect(stillPending).toBeUndefined();
      }),
      { numRuns: 50 }
    );
  });

  /**
   * Feature: rental-management-app, Property 34: Offline changes sync when online
   * Validates: Requirements 9.3
   *
   * For any set of offline changes, all should sync when online.
   */
  it('should sync multiple changes when online', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .array(roomArbitrary(), { minLength: 1, maxLength: 5 })
          .filter((rooms) =>
            rooms.every(
              (room) => !isNaN(room.createdAt.getTime()) && !isNaN(room.updatedAt.getTime())
            )
          )
          .map((rooms) =>
            // Ensure unique IDs
            rooms.map((room, index) => ({
              ...room,
              id: `${room.id}-${index}`,
            }))
          ),
        async (rooms) => {
          // Mock successful API responses
          rooms.forEach((room) => {
            mockApiClient.createRoom.mockResolvedValue(room);
          });

          // Queue all changes
          rooms.forEach((room) => {
            queueChange({
              entityType: 'Room',
              entityId: room.id,
              operation: 'create',
              data: room,
              timestamp: new Date(),
            });
          });

          // Verify all changes are queued
          const pendingBefore = getPendingChanges();
          expect(pendingBefore.length).toBeGreaterThanOrEqual(rooms.length);

          // Sync pending changes
          await syncPendingChanges();

          // Verify all API calls were made
          expect(mockApiClient.createRoom).toHaveBeenCalledTimes(rooms.length);

          // Verify all changes were removed from queue
          const pendingAfter = getPendingChanges();
          rooms.forEach((room) => {
            const stillPending = pendingAfter.find(
              (c) => c.entityId === room.id && c.operation === 'create'
            );
            expect(stillPending).toBeUndefined();
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Feature: rental-management-app, Property 34: Offline changes sync when online
   * Validates: Requirements 9.3
   *
   * For any synced changes, subsequent fetches should reflect those changes (round-trip).
   */
  it('should reflect synced changes in subsequent fetches', async () => {
    await fc.assert(
      fc.asyncProperty(
        roomArbitrary().filter(
          (room) => !isNaN(room.createdAt.getTime()) && !isNaN(room.updatedAt.getTime())
        ),
        async (room) => {
          // Mock successful API response
          mockApiClient.createRoom.mockResolvedValue(room);

          // Queue a create operation
          queueChange({
            entityType: 'Room',
            entityId: room.id,
            operation: 'create',
            data: room,
            timestamp: new Date(),
          });

          // Sync pending changes
          await syncPendingChanges();

          // Simulate fetching from server and caching
          cacheRoom(room);

          // Fetch from cache
          const cachedRooms = getCachedRooms();
          const cachedRoom = cachedRooms.find((r) => r.id === room.id);

          // Verify the synced change is reflected
          expect(cachedRoom).toBeDefined();
          expect(cachedRoom?.id).toBe(room.id);
          expect(cachedRoom?.roomCode).toBe(room.roomCode);
          expect(cachedRoom?.roomName).toBe(room.roomName);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Feature: rental-management-app, Property 34: Offline changes sync when online
   * Validates: Requirements 9.3
   *
   * For any failed sync attempts, changes should remain in queue for retry.
   */
  it('should keep changes in queue when sync fails', async () => {
    await fc.assert(
      fc.asyncProperty(
        roomArbitrary().filter(
          (room) => !isNaN(room.createdAt.getTime()) && !isNaN(room.updatedAt.getTime())
        ),
        async (room) => {
          // Mock API failure
          mockApiClient.createRoom.mockRejectedValue(new Error('Network error'));

          // Queue a create operation
          queueChange({
            entityType: 'Room',
            entityId: room.id,
            operation: 'create',
            data: room,
            timestamp: new Date(),
          });

          // Attempt to sync (will fail)
          await syncPendingChanges();

          // Verify change is still in queue
          const pendingAfter = getPendingChanges();
          const stillPending = pendingAfter.find(
            (c) => c.entityId === room.id && c.operation === 'create'
          );
          expect(stillPending).toBeDefined();
          expect(stillPending?.retryCount).toBeGreaterThan(0);
        }
      ),
      { numRuns: 50 }
    );
  });
});
