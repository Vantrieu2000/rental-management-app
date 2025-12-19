/**
 * Property-based tests for offline change queuing
 * Feature: rental-management-app, Property 33: Offline changes are queued
 * Validates: Requirements 9.2
 */
import fc from 'fast-check';
import {
  initializeRealm,
  closeRealm,
  clearRealm,
  queueChange,
  getPendingChanges,
  removeChange,
  getPendingChangesCount,
} from '../index';
import { PendingChange } from '../../../store/sync.store';

// Arbitraries for generating test data
const entityTypeArbitrary = () =>
  fc.constantFrom('Room', 'Tenant', 'PaymentRecord', 'Property') as fc.Arbitrary<
    PendingChange['entityType']
  >;

const operationArbitrary = () =>
  fc.constantFrom('create', 'update', 'delete') as fc.Arbitrary<PendingChange['operation']>;

const pendingChangeArbitrary = (): fc.Arbitrary<Omit<PendingChange, 'id' | 'retryCount'>> =>
  fc.record({
    entityType: entityTypeArbitrary(),
    entityId: fc.uuid(),
    operation: operationArbitrary(),
    data: fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 1, maxLength: 100 }),
      value: fc.double({ min: 0, max: 1000000, noNaN: true }),
    }),
    timestamp: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
  });

describe('Offline Change Queuing Property Tests', () => {
  beforeAll(async () => {
    await initializeRealm();
  });

  beforeEach(async () => {
    await clearRealm();
  });

  afterAll(() => {
    closeRealm();
  });

  /**
   * Feature: rental-management-app, Property 33: Offline changes are queued
   * Validates: Requirements 9.2
   *
   * For any data modification made while offline, it should be added to the
   * synchronization queue.
   */
  it('should queue offline changes', async () => {
    await fc.assert(
      fc.asyncProperty(pendingChangeArbitrary(), async (change) => {
        // Queue the change (simulating offline modification)
        queueChange(change);

        // Retrieve pending changes
        const pendingChanges = getPendingChanges();

        // Verify the change was queued
        expect(pendingChanges.length).toBeGreaterThan(0);

        // Find the queued change
        const queuedChange = pendingChanges.find(
          (c) => c.entityId === change.entityId && c.operation === change.operation
        );

        expect(queuedChange).toBeDefined();
        expect(queuedChange?.entityType).toBe(change.entityType);
        expect(queuedChange?.entityId).toBe(change.entityId);
        expect(queuedChange?.operation).toBe(change.operation);
        expect(queuedChange?.data).toEqual(change.data);
        expect(queuedChange?.retryCount).toBe(0);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 33: Offline changes are queued
   * Validates: Requirements 9.2
   *
   * For any set of offline changes, all should be queued in order.
   */
  it('should queue multiple offline changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(pendingChangeArbitrary(), { minLength: 1, maxLength: 10 }),
        async (changes) => {
          // Queue all changes
          changes.forEach((change) => queueChange(change));

          // Retrieve pending changes
          const pendingChanges = getPendingChanges();

          // Verify all changes were queued
          expect(pendingChanges.length).toBeGreaterThanOrEqual(changes.length);

          // Verify each change is in the queue
          changes.forEach((change) => {
            const queuedChange = pendingChanges.find(
              (c) => c.entityId === change.entityId && c.operation === change.operation
            );
            expect(queuedChange).toBeDefined();
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 33: Offline changes are queued
   * Validates: Requirements 9.2
   *
   * For any queued change, it should be removable from the queue.
   */
  it('should remove changes from queue', async () => {
    await fc.assert(
      fc.asyncProperty(pendingChangeArbitrary(), async (change) => {
        // Queue the change
        queueChange(change);

        // Get the queued change
        const pendingChanges = getPendingChanges();
        const queuedChange = pendingChanges.find(
          (c) => c.entityId === change.entityId && c.operation === change.operation
        );

        expect(queuedChange).toBeDefined();

        // Remove the change
        if (queuedChange) {
          removeChange(queuedChange.id);

          // Verify it was removed
          const remainingChanges = getPendingChanges();
          const stillQueued = remainingChanges.find((c) => c.id === queuedChange.id);
          expect(stillQueued).toBeUndefined();
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 33: Offline changes are queued
   * Validates: Requirements 9.2
   *
   * For any set of changes, the pending count should match the queue size.
   */
  it('should track pending changes count', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(pendingChangeArbitrary(), { minLength: 0, maxLength: 10 }),
        async (changes) => {
          // Queue all changes
          changes.forEach((change) => queueChange(change));

          // Get count
          const count = getPendingChangesCount();
          const pendingChanges = getPendingChanges();

          // Verify count matches actual queue size
          expect(count).toBe(pendingChanges.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: rental-management-app, Property 33: Offline changes are queued
   * Validates: Requirements 9.2
   *
   * For any changes queued, they should be sorted by timestamp.
   */
  it('should maintain timestamp order in queue', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .array(pendingChangeArbitrary(), { minLength: 2, maxLength: 10 })
          .map((changes) =>
            // Ensure unique entity IDs to avoid conflicts
            changes.map((change, index) => ({
              ...change,
              entityId: `${change.entityId}-${index}`,
            }))
          ),
        async (changes) => {
          // Queue all changes
          changes.forEach((change) => queueChange(change));

          // Retrieve pending changes
          const pendingChanges = getPendingChanges();

          // Verify they are sorted by timestamp
          for (let i = 1; i < pendingChanges.length; i++) {
            expect(pendingChanges[i].timestamp.getTime()).toBeGreaterThanOrEqual(
              pendingChanges[i - 1].timestamp.getTime()
            );
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
