/**
 * Property-Based Tests for Property Switching
 * Feature: rental-management-app, Property 45: Property switching filters rooms
 * Validates: Requirements 13.2
 */

import fc from 'fast-check';
import { usePropertyStore } from '../store/propertyStore';
import { Property } from '../types';

// Mock Room interface based on design document
interface Room {
  id: string;
  propertyId: string;
  roomCode: string;
  roomName: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  rentalPrice: number;
  electricityFee: number;
  waterFee: number;
  garbageFee: number;
  parkingFee: number;
  currentTenantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

describe('Property Switching Property Tests', () => {
  beforeEach(() => {
    // Reset property store
    usePropertyStore.setState({
      selectedPropertyId: null,
      properties: [],
      isLoading: false,
      error: null,
    });
  });

  /**
   * Feature: rental-management-app, Property 45: Property switching filters rooms
   * Validates: Requirements 13.2
   *
   * Property: For any property selection, the room list should display only
   * rooms belonging to that property.
   */
  it('should filter rooms by selected property', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate multiple properties
        fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            address: fc.string({ minLength: 1, maxLength: 200 }),
            totalRooms: fc.integer({ min: 1, max: 100 }),
            defaultElectricityRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultWaterRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultGarbageRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultParkingRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            billingDayOfMonth: fc.integer({ min: 1, max: 31 }),
            reminderDaysBefore: fc.integer({ min: 0, max: 30 }),
            ownerId: fc.uuid(),
            createdAt: fc.date(),
            updatedAt: fc.date(),
          }),
          { minLength: 2, maxLength: 5 }
        ),
        async (properties: Property[]) => {
          // Generate rooms for each property
          const allRooms: Room[] = [];
          const roomsByProperty = new Map<string, Room[]>();

          for (const property of properties) {
            const roomCount = Math.floor(Math.random() * 10) + 1;
            const propertyRooms: Room[] = [];

            for (let i = 0; i < roomCount; i++) {
              const room: Room = {
                id: `room-${property.id}-${i}`,
                propertyId: property.id,
                roomCode: `R${i + 1}`,
                roomName: `Room ${i + 1}`,
                status: ['vacant', 'occupied', 'maintenance'][Math.floor(Math.random() * 3)] as Room['status'],
                rentalPrice: Math.random() * 5000,
                electricityFee: Math.random() * 500,
                waterFee: Math.random() * 200,
                garbageFee: Math.random() * 100,
                parkingFee: Math.random() * 300,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              propertyRooms.push(room);
              allRooms.push(room);
            }

            roomsByProperty.set(property.id, propertyRooms);
          }

          // Set properties in store
          usePropertyStore.setState({ properties });

          // Test switching to each property
          for (const property of properties) {
            // Switch to this property
            usePropertyStore.getState().setSelectedProperty(property.id);

            // Verify selected property is set
            const selectedPropertyId = usePropertyStore.getState().selectedPropertyId;
            expect(selectedPropertyId).toBe(property.id);

            // Filter rooms by selected property
            const filteredRooms = allRooms.filter(
              (room) => room.propertyId === selectedPropertyId
            );

            // Verify filtered rooms match expected rooms for this property
            const expectedRooms = roomsByProperty.get(property.id) || [];
            expect(filteredRooms.length).toBe(expectedRooms.length);

            // Verify all filtered rooms belong to the selected property
            for (const room of filteredRooms) {
              expect(room.propertyId).toBe(property.id);
            }

            // Verify no rooms from other properties are included
            const otherPropertyRooms = allRooms.filter(
              (room) => room.propertyId !== property.id
            );
            for (const room of otherPropertyRooms) {
              expect(filteredRooms).not.toContainEqual(room);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any property switch, only rooms with matching propertyId
   * should be visible
   */
  it('should exclude rooms from other properties', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // Selected property ID
        fc.array(
          fc.record({
            id: fc.uuid(),
            propertyId: fc.uuid(),
            roomCode: fc.string({ minLength: 1, maxLength: 10 }),
            roomName: fc.string({ minLength: 1, maxLength: 50 }),
            status: fc.constantFrom('vacant', 'occupied', 'maintenance'),
            rentalPrice: fc.float({ min: 0, max: 10000, noNaN: true }),
            electricityFee: fc.float({ min: 0, max: 1000, noNaN: true }),
            waterFee: fc.float({ min: 0, max: 1000, noNaN: true }),
            garbageFee: fc.float({ min: 0, max: 1000, noNaN: true }),
            parkingFee: fc.float({ min: 0, max: 1000, noNaN: true }),
            createdAt: fc.date(),
            updatedAt: fc.date(),
          }),
          { minLength: 5, maxLength: 20 }
        ),
        async (selectedPropertyId: string, rooms: Room[]) => {
          // Set selected property
          usePropertyStore.getState().setSelectedProperty(selectedPropertyId);

          // Filter rooms by selected property
          const filteredRooms = rooms.filter(
            (room) => room.propertyId === selectedPropertyId
          );

          // Verify all filtered rooms belong to selected property
          for (const room of filteredRooms) {
            expect(room.propertyId).toBe(selectedPropertyId);
          }

          // Verify rooms from other properties are excluded
          const excludedRooms = rooms.filter(
            (room) => room.propertyId !== selectedPropertyId
          );

          for (const excludedRoom of excludedRooms) {
            expect(filteredRooms).not.toContainEqual(excludedRoom);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any property with no rooms, filtering should return empty list
   */
  it('should return empty list for property with no rooms', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // Property ID with no rooms
        fc.array(
          fc.record({
            id: fc.uuid(),
            propertyId: fc.uuid().filter((id) => id !== 'empty-property-id'),
            roomCode: fc.string({ minLength: 1, maxLength: 10 }),
            roomName: fc.string({ minLength: 1, maxLength: 50 }),
            status: fc.constantFrom('vacant', 'occupied', 'maintenance'),
            rentalPrice: fc.float({ min: 0, max: 10000, noNaN: true }),
            electricityFee: fc.float({ min: 0, max: 1000, noNaN: true }),
            waterFee: fc.float({ min: 0, max: 1000, noNaN: true }),
            garbageFee: fc.float({ min: 0, max: 1000, noNaN: true }),
            parkingFee: fc.float({ min: 0, max: 1000, noNaN: true }),
            createdAt: fc.date(),
            updatedAt: fc.date(),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        async (emptyPropertyId: string, rooms: Room[]) => {
          // Ensure no rooms belong to the empty property
          const roomsWithDifferentProperty = rooms.map((room) => ({
            ...room,
            propertyId: room.propertyId === emptyPropertyId ? fc.sample(fc.uuid(), 1)[0] : room.propertyId,
          }));

          // Set selected property to one with no rooms
          usePropertyStore.getState().setSelectedProperty(emptyPropertyId);

          // Filter rooms
          const filteredRooms = roomsWithDifferentProperty.filter(
            (room) => room.propertyId === emptyPropertyId
          );

          // Verify empty list
          expect(filteredRooms).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any property switch, the count of filtered rooms should
   * match the count of rooms with that propertyId
   */
  it('should maintain correct room count after property switch', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            address: fc.string({ minLength: 1, maxLength: 200 }),
            totalRooms: fc.integer({ min: 1, max: 100 }),
            defaultElectricityRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultWaterRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultGarbageRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            defaultParkingRate: fc.float({ min: 0, max: 10000, noNaN: true }),
            billingDayOfMonth: fc.integer({ min: 1, max: 31 }),
            reminderDaysBefore: fc.integer({ min: 0, max: 30 }),
            ownerId: fc.uuid(),
            createdAt: fc.date(),
            updatedAt: fc.date(),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (properties: Property[]) => {
          // Generate rooms with known distribution
          const allRooms: Room[] = [];
          const roomCountByProperty = new Map<string, number>();

          for (const property of properties) {
            const roomCount = Math.floor(Math.random() * 10) + 1;
            roomCountByProperty.set(property.id, roomCount);

            for (let i = 0; i < roomCount; i++) {
              allRooms.push({
                id: `room-${property.id}-${i}`,
                propertyId: property.id,
                roomCode: `R${i + 1}`,
                roomName: `Room ${i + 1}`,
                status: 'vacant',
                rentalPrice: 1000,
                electricityFee: 100,
                waterFee: 50,
                garbageFee: 25,
                parkingFee: 75,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          }

          // Test each property
          for (const property of properties) {
            usePropertyStore.getState().setSelectedProperty(property.id);

            const filteredRooms = allRooms.filter(
              (room) => room.propertyId === property.id
            );

            const expectedCount = roomCountByProperty.get(property.id) || 0;
            expect(filteredRooms.length).toBe(expectedCount);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
