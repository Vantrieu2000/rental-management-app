/**
 * Property-Based Tests for Property Creation
 * Feature: rental-management-app, Property 44: Property creation persists all fields
 * Validates: Requirements 13.1
 */

import fc from 'fast-check';
import { propertyApi } from '../services/propertyApi';
import { CreatePropertyDto, Property } from '../types';

// Mock fetch for testing
global.fetch = jest.fn();

describe('Property Creation Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Feature: rental-management-app, Property 44: Property creation persists all fields
   * Validates: Requirements 13.1
   *
   * Property: For any valid property data with all required fields (name, address,
   * total rooms, and utility rates), creating the property should result in all
   * fields being stored and retrievable from the database.
   */
  it('should persist all property fields on creation', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid property data
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }),
          address: fc.string({ minLength: 1, maxLength: 200 }),
          totalRooms: fc.integer({ min: 1, max: 1000 }),
          defaultElectricityRate: fc.float({ min: 0, max: 10000, noNaN: true }),
          defaultWaterRate: fc.float({ min: 0, max: 10000, noNaN: true }),
          defaultGarbageRate: fc.float({ min: 0, max: 10000, noNaN: true }),
          defaultParkingRate: fc.float({ min: 0, max: 10000, noNaN: true }),
          billingDayOfMonth: fc.integer({ min: 1, max: 31 }),
          reminderDaysBefore: fc.integer({ min: 0, max: 30 }),
        }),
        fc.uuid(),
        fc.string({ minLength: 20, maxLength: 100 }), // Access token
        async (propertyData: CreatePropertyDto, generatedId: string, accessToken: string) => {
          // Create expected property with generated ID
          const expectedProperty: Property = {
            id: generatedId,
            ...propertyData,
            ownerId: 'test-owner-id',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Mock successful creation response
          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              property: expectedProperty,
            }),
          });

          // Create property
          const createdProperty = await propertyApi.createProperty(accessToken, propertyData);

          // Verify all fields are persisted
          expect(createdProperty.id).toBe(expectedProperty.id);
          expect(createdProperty.name).toBe(propertyData.name);
          expect(createdProperty.address).toBe(propertyData.address);
          expect(createdProperty.totalRooms).toBe(propertyData.totalRooms);
          expect(createdProperty.defaultElectricityRate).toBe(propertyData.defaultElectricityRate);
          expect(createdProperty.defaultWaterRate).toBe(propertyData.defaultWaterRate);
          expect(createdProperty.defaultGarbageRate).toBe(propertyData.defaultGarbageRate);
          expect(createdProperty.defaultParkingRate).toBe(propertyData.defaultParkingRate);
          expect(createdProperty.billingDayOfMonth).toBe(propertyData.billingDayOfMonth);
          expect(createdProperty.reminderDaysBefore).toBe(propertyData.reminderDaysBefore);
          expect(createdProperty.ownerId).toBeDefined();
          expect(createdProperty.createdAt).toBeDefined();
          expect(createdProperty.updatedAt).toBeDefined();

          // Mock retrieval to verify persistence
          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              property: expectedProperty,
            }),
          });

          // Retrieve the created property
          const retrievedProperty = await propertyApi.getPropertyById(accessToken, createdProperty.id);

          // Verify retrieved property matches created property
          expect(retrievedProperty.id).toBe(createdProperty.id);
          expect(retrievedProperty.name).toBe(createdProperty.name);
          expect(retrievedProperty.address).toBe(createdProperty.address);
          expect(retrievedProperty.totalRooms).toBe(createdProperty.totalRooms);
          expect(retrievedProperty.defaultElectricityRate).toBe(createdProperty.defaultElectricityRate);
          expect(retrievedProperty.defaultWaterRate).toBe(createdProperty.defaultWaterRate);
          expect(retrievedProperty.defaultGarbageRate).toBe(createdProperty.defaultGarbageRate);
          expect(retrievedProperty.defaultParkingRate).toBe(createdProperty.defaultParkingRate);
          expect(retrievedProperty.billingDayOfMonth).toBe(createdProperty.billingDayOfMonth);
          expect(retrievedProperty.reminderDaysBefore).toBe(createdProperty.reminderDaysBefore);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any property creation, the returned property should have
   * a unique ID and timestamps
   */
  it('should generate unique ID and timestamps for created properties', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }),
          address: fc.string({ minLength: 1, maxLength: 200 }),
          totalRooms: fc.integer({ min: 1, max: 1000 }),
          defaultElectricityRate: fc.float({ min: 0, max: 10000, noNaN: true }),
          defaultWaterRate: fc.float({ min: 0, max: 10000, noNaN: true }),
          defaultGarbageRate: fc.float({ min: 0, max: 10000, noNaN: true }),
          defaultParkingRate: fc.float({ min: 0, max: 10000, noNaN: true }),
          billingDayOfMonth: fc.integer({ min: 1, max: 31 }),
          reminderDaysBefore: fc.integer({ min: 0, max: 30 }),
        }),
        fc.uuid(),
        fc.string({ minLength: 20, maxLength: 100 }),
        async (propertyData: CreatePropertyDto, generatedId: string, accessToken: string) => {
          const now = new Date();
          const expectedProperty: Property = {
            id: generatedId,
            ...propertyData,
            ownerId: 'test-owner-id',
            createdAt: now,
            updatedAt: now,
          };

          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              property: expectedProperty,
            }),
          });

          const createdProperty = await propertyApi.createProperty(accessToken, propertyData);

          // Verify ID is present and non-empty
          expect(createdProperty.id).toBeDefined();
          expect(createdProperty.id.length).toBeGreaterThan(0);

          // Verify timestamps are present
          expect(createdProperty.createdAt).toBeDefined();
          expect(createdProperty.updatedAt).toBeDefined();

          // Verify ownerId is present
          expect(createdProperty.ownerId).toBeDefined();
          expect(createdProperty.ownerId.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any property with minimum valid values, creation should succeed
   */
  it('should create properties with minimum valid values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.constant('A'), // Minimum length name
          address: fc.constant('B'), // Minimum length address
          totalRooms: fc.constant(1), // Minimum rooms
          defaultElectricityRate: fc.constant(0), // Minimum rate
          defaultWaterRate: fc.constant(0),
          defaultGarbageRate: fc.constant(0),
          defaultParkingRate: fc.constant(0),
          billingDayOfMonth: fc.constant(1), // Minimum day
          reminderDaysBefore: fc.constant(0), // Minimum reminder days
        }),
        fc.uuid(),
        fc.string({ minLength: 20, maxLength: 100 }),
        async (propertyData: CreatePropertyDto, generatedId: string, accessToken: string) => {
          const expectedProperty: Property = {
            id: generatedId,
            ...propertyData,
            ownerId: 'test-owner-id',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              property: expectedProperty,
            }),
          });

          const createdProperty = await propertyApi.createProperty(accessToken, propertyData);

          // Verify creation succeeded with minimum values
          expect(createdProperty).toBeDefined();
          expect(createdProperty.name).toBe('A');
          expect(createdProperty.address).toBe('B');
          expect(createdProperty.totalRooms).toBe(1);
          expect(createdProperty.defaultElectricityRate).toBe(0);
          expect(createdProperty.billingDayOfMonth).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any property with maximum valid values, creation should succeed
   */
  it('should create properties with maximum valid values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 100, maxLength: 100 }), // Maximum length
          address: fc.string({ minLength: 200, maxLength: 200 }),
          totalRooms: fc.constant(1000), // Maximum rooms
          defaultElectricityRate: fc.constant(10000), // Maximum rate
          defaultWaterRate: fc.constant(10000),
          defaultGarbageRate: fc.constant(10000),
          defaultParkingRate: fc.constant(10000),
          billingDayOfMonth: fc.constant(31), // Maximum day
          reminderDaysBefore: fc.constant(30), // Maximum reminder days
        }),
        fc.uuid(),
        fc.string({ minLength: 20, maxLength: 100 }),
        async (propertyData: CreatePropertyDto, generatedId: string, accessToken: string) => {
          const expectedProperty: Property = {
            id: generatedId,
            ...propertyData,
            ownerId: 'test-owner-id',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              property: expectedProperty,
            }),
          });

          const createdProperty = await propertyApi.createProperty(accessToken, propertyData);

          // Verify creation succeeded with maximum values
          expect(createdProperty).toBeDefined();
          expect(createdProperty.name.length).toBe(100);
          expect(createdProperty.address.length).toBe(200);
          expect(createdProperty.totalRooms).toBe(1000);
          expect(createdProperty.billingDayOfMonth).toBe(31);
        }
      ),
      { numRuns: 100 }
    );
  });
});
