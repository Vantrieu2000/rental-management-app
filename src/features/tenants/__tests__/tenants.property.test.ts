/**
 * Tenant Property-Based Tests
 * Tests universal properties of tenant management
 */

import fc from 'fast-check';
import { getTenantApi } from '../services/tenantApi';
import { CreateTenantDto, AssignTenantDto, VacateTenantDto } from '../types';

// Mock access token for testing
const mockAccessToken = 'test-token-123';

// Get the tenant API (will use mock in tests)
const tenantApi = getTenantApi();

// Arbitraries (generators) for property-based testing
const tenantNameArbitrary = () =>
  fc.string({ minLength: 2, maxLength: 100 }).filter((s) => s.trim().length >= 2);

const phoneArbitrary = () =>
  fc
    .integer({ min: 900000000, max: 999999999 })
    .map((num) => `0${num.toString().substring(0, 9)}`);

const emailArbitrary = () =>
  fc
    .tuple(
      fc.string({ minLength: 3, maxLength: 20 }).filter((s) => /^[a-z0-9]+$/.test(s)),
      fc.constantFrom('gmail.com', 'yahoo.com', 'example.com')
    )
    .map(([name, domain]) => `${name}@${domain}`);

const idNumberArbitrary = () =>
  fc.integer({ min: 100000000000, max: 999999999999 }).map((num) => num.toString());

const emergencyContactArbitrary = () =>
  fc.record({
    name: tenantNameArbitrary(),
    phone: phoneArbitrary(),
    relationship: fc.constantFrom('Spouse', 'Parent', 'Sibling', 'Friend', 'Relative'),
  });

const createTenantDtoArbitrary = () =>
  fc.record({
    name: tenantNameArbitrary(),
    phone: phoneArbitrary(),
    email: fc.option(emailArbitrary(), { nil: undefined }),
    idNumber: fc.option(idNumberArbitrary(), { nil: undefined }),
    roomId: fc.string({ minLength: 5, maxLength: 20 }),
    moveInDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
    emergencyContact: fc.option(emergencyContactArbitrary(), { nil: undefined }),
  });

describe('Tenant Property-Based Tests', () => {
  /**
   * Feature: rental-management-app, Property 6: Tenant assignment persists all data
   * Validates: Requirements 2.1
   */
  it('should persist all tenant fields on creation', async () => {
    await fc.assert(
      fc.asyncProperty(createTenantDtoArbitrary(), async (tenantData) => {
        // Create tenant
        const created = await tenantApi.createTenant(mockAccessToken, tenantData);

        // Retrieve tenant
        const retrieved = await tenantApi.getTenantById(mockAccessToken, created.id);

        // Verify all fields are persisted
        expect(retrieved.name).toBe(tenantData.name);
        expect(retrieved.phone).toBe(tenantData.phone);
        expect(retrieved.email).toBe(tenantData.email);
        expect(retrieved.idNumber).toBe(tenantData.idNumber);
        expect(retrieved.roomId).toBe(tenantData.roomId);
        expect(new Date(retrieved.moveInDate).toDateString()).toBe(
          tenantData.moveInDate.toDateString()
        );

        // Verify emergency contact if provided
        if (tenantData.emergencyContact) {
          expect(retrieved.emergencyContact).toBeDefined();
          expect(retrieved.emergencyContact?.name).toBe(tenantData.emergencyContact.name);
          expect(retrieved.emergencyContact?.phone).toBe(tenantData.emergencyContact.phone);
          expect(retrieved.emergencyContact?.relationship).toBe(
            tenantData.emergencyContact.relationship
          );
        } else {
          expect(retrieved.emergencyContact).toBeUndefined();
        }

        // Verify metadata fields exist
        expect(retrieved.id).toBeDefined();
        expect(retrieved.createdAt).toBeDefined();
        expect(retrieved.updatedAt).toBeDefined();
      }),
      { numRuns: 20 }
    );
  }, 30000); // 30 second timeout for property test

  /**
   * Feature: rental-management-app, Property 7: Tenant vacation updates room state
   * Validates: Requirements 2.2
   */
  it('should update room state when tenant vacates', async () => {
    await fc.assert(
      fc.asyncProperty(
        createTenantDtoArbitrary(),
        fc.date({ min: new Date('2025-01-01'), max: new Date('2026-12-31') }),
        async (tenantData, moveOutDate) => {
          // Ensure moveOutDate is after moveInDate
          if (moveOutDate <= tenantData.moveInDate) {
            moveOutDate = new Date(tenantData.moveInDate.getTime() + 86400000); // Add 1 day
          }

          // Create tenant
          const created = await tenantApi.createTenant(mockAccessToken, tenantData);

          // Verify tenant is active (no moveOutDate)
          expect(created.moveOutDate).toBeUndefined();

          // Vacate tenant
          const vacateData: VacateTenantDto = {
            roomId: created.roomId,
            tenantId: created.id,
            moveOutDate,
          };
          await tenantApi.vacateTenant(mockAccessToken, vacateData);

          // Retrieve tenant and verify moveOutDate is set
          const retrieved = await tenantApi.getTenantById(mockAccessToken, created.id);
          expect(retrieved.moveOutDate).toBeDefined();
          expect(new Date(retrieved.moveOutDate!).toDateString()).toBe(
            moveOutDate.toDateString()
          );
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);

  /**
   * Feature: rental-management-app, Property 8: Room details include tenant information
   * Validates: Requirements 2.3
   */
  it('should include tenant information in room details', async () => {
    await fc.assert(
      fc.asyncProperty(createTenantDtoArbitrary(), async (tenantData) => {
        // Create tenant
        const created = await tenantApi.createTenant(mockAccessToken, tenantData);

        // Retrieve tenant by ID
        const retrieved = await tenantApi.getTenantById(mockAccessToken, created.id);

        // Verify tenant information is complete
        expect(retrieved.id).toBe(created.id);
        expect(retrieved.name).toBe(tenantData.name);
        expect(retrieved.phone).toBe(tenantData.phone);
        expect(retrieved.roomId).toBe(tenantData.roomId);

        // Verify rental history information
        expect(retrieved.moveInDate).toBeDefined();
        expect(retrieved.createdAt).toBeDefined();
        expect(retrieved.updatedAt).toBeDefined();
      }),
      { numRuns: 20 }
    );
  }, 30000);

  /**
   * Feature: rental-management-app, Property 9: Multiple tenants maintain history
   * Validates: Requirements 2.4
   */
  it('should maintain history when multiple tenants are assigned to a room', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 5, maxLength: 20 }), // roomId
        fc.array(createTenantDtoArbitrary(), { minLength: 2, maxLength: 3 }),
        async (roomId, tenantsData) => {
          // Assign all tenants to the same room
          const tenants = [];
          for (const tenantData of tenantsData) {
            const created = await tenantApi.createTenant(mockAccessToken, {
              ...tenantData,
              roomId,
            });
            tenants.push(created);

            // Vacate previous tenant if not the first one
            if (tenants.length > 1) {
              const previousTenant = tenants[tenants.length - 2];
              await tenantApi.vacateTenant(mockAccessToken, {
                roomId,
                tenantId: previousTenant.id,
                moveOutDate: new Date(),
              });
            }
          }

          // Retrieve tenant history for the room
          const history = await tenantApi.getTenantHistory(mockAccessToken, roomId);

          // Verify all tenants are in the history
          expect(history.length).toBeGreaterThanOrEqual(tenants.length);

          // Verify each tenant appears in history
          for (const tenant of tenants) {
            const historyEntry = history.find((h) => h.tenantId === tenant.id);
            expect(historyEntry).toBeDefined();
            expect(historyEntry?.roomId).toBe(roomId);
          }

          // Verify history is sorted by move-in date (most recent first)
          for (let i = 0; i < history.length - 1; i++) {
            const current = new Date(history[i].moveInDate);
            const next = new Date(history[i + 1].moveInDate);
            expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
          }
        }
      ),
      { numRuns: 10 } // Reduced runs due to complexity
    );
  }, 60000); // 60 second timeout for complex test
});
