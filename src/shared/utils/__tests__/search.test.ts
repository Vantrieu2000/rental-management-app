/**
 * Search Utility Tests
 */

import {
  searchRooms,
  filterRooms,
  highlightText,
  optimizedSearchRooms,
  sortByRelevance,
} from '../search';
import type { RoomWithTenant, RoomFilters } from '@/features/rooms/types';

describe('Search Utilities', () => {
  const mockRooms: RoomWithTenant[] = [
    {
      id: '1',
      propertyId: 'prop1',
      roomCode: 'A101',
      roomName: 'Deluxe Room A101',
      status: 'occupied',
      rentalPrice: 3000000,
      electricityFee: 200000,
      waterFee: 100000,
      garbageFee: 50000,
      parkingFee: 150000,
      createdAt: new Date(),
      updatedAt: new Date(),
      tenant: {
        id: 't1',
        name: 'Nguyen Van A',
        phone: '0901234567',
      },
    },
    {
      id: '2',
      propertyId: 'prop1',
      roomCode: 'A102',
      roomName: 'Standard Room A102',
      status: 'vacant',
      rentalPrice: 2500000,
      electricityFee: 200000,
      waterFee: 100000,
      garbageFee: 50000,
      parkingFee: 150000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      propertyId: 'prop1',
      roomCode: 'B201',
      roomName: 'Premium Room B201',
      status: 'occupied',
      rentalPrice: 4000000,
      electricityFee: 250000,
      waterFee: 120000,
      garbageFee: 50000,
      parkingFee: 200000,
      createdAt: new Date(),
      updatedAt: new Date(),
      tenant: {
        id: 't2',
        name: 'Tran Thi B',
        phone: '0907654321',
      },
    },
  ];

  describe('searchRooms', () => {
    it('should return all rooms when query is empty', () => {
      const result = searchRooms(mockRooms, '');
      expect(result).toEqual(mockRooms);
    });

    it('should search by room code', () => {
      const result = searchRooms(mockRooms, 'A101');
      expect(result).toHaveLength(1);
      expect(result[0].roomCode).toBe('A101');
    });

    it('should search by room name', () => {
      const result = searchRooms(mockRooms, 'Deluxe');
      expect(result).toHaveLength(1);
      expect(result[0].roomName).toContain('Deluxe');
    });

    it('should search by tenant name', () => {
      const result = searchRooms(mockRooms, 'Nguyen');
      expect(result).toHaveLength(1);
      expect(result[0].tenant?.name).toContain('Nguyen');
    });

    it('should be case insensitive', () => {
      const result = searchRooms(mockRooms, 'a101');
      expect(result).toHaveLength(1);
      expect(result[0].roomCode).toBe('A101');
    });

    it('should handle partial matches', () => {
      const result = searchRooms(mockRooms, 'A1');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('filterRooms', () => {
    it('should filter by status', () => {
      const filters: RoomFilters = { status: 'vacant' };
      const result = filterRooms(mockRooms, filters);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('vacant');
    });

    it('should filter by min price', () => {
      const filters: RoomFilters = { minPrice: 3000000 };
      const result = filterRooms(mockRooms, filters);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((room) => {
        expect(room.rentalPrice).toBeGreaterThanOrEqual(3000000);
      });
    });

    it('should filter by max price', () => {
      const filters: RoomFilters = { maxPrice: 3000000 };
      const result = filterRooms(mockRooms, filters);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((room) => {
        expect(room.rentalPrice).toBeLessThanOrEqual(3000000);
      });
    });

    it('should filter by price range', () => {
      const filters: RoomFilters = { minPrice: 2500000, maxPrice: 3500000 };
      const result = filterRooms(mockRooms, filters);
      result.forEach((room) => {
        expect(room.rentalPrice).toBeGreaterThanOrEqual(2500000);
        expect(room.rentalPrice).toBeLessThanOrEqual(3500000);
      });
    });

    it('should combine multiple filters', () => {
      const filters: RoomFilters = {
        status: 'occupied',
        minPrice: 3000000,
      };
      const result = filterRooms(mockRooms, filters);
      result.forEach((room) => {
        expect(room.status).toBe('occupied');
        expect(room.rentalPrice).toBeGreaterThanOrEqual(3000000);
      });
    });

    it('should apply search filter', () => {
      const filters: RoomFilters = { search: 'A101' };
      const result = filterRooms(mockRooms, filters);
      expect(result).toHaveLength(1);
      expect(result[0].roomCode).toBe('A101');
    });
  });

  describe('highlightText', () => {
    it('should return single segment when no match', () => {
      const result = highlightText('Hello World', 'xyz');
      expect(result).toHaveLength(1);
      expect(result[0].highlighted).toBe(false);
    });

    it('should highlight matching text', () => {
      const result = highlightText('Hello World', 'World');
      expect(result.length).toBeGreaterThan(1);
      const highlighted = result.find((s) => s.highlighted);
      expect(highlighted?.text).toBe('World');
    });

    it('should be case insensitive', () => {
      const result = highlightText('Hello World', 'world');
      const highlighted = result.find((s) => s.highlighted);
      expect(highlighted?.text).toBe('World');
    });

    it('should handle match at start', () => {
      const result = highlightText('Hello World', 'Hello');
      expect(result[0].highlighted).toBe(true);
      expect(result[0].text).toBe('Hello');
    });

    it('should handle match at end', () => {
      const result = highlightText('Hello World', 'World');
      const lastSegment = result[result.length - 1];
      expect(lastSegment.highlighted).toBe(true);
    });
  });

  describe('optimizedSearchRooms', () => {
    it('should limit results to maxResults', () => {
      const largeDataset = Array.from({ length: 200 }, (_, i) => ({
        ...mockRooms[0],
        id: `room-${i}`,
        roomCode: `A${i}`,
      }));

      const result = optimizedSearchRooms(largeDataset, 'A', 50);
      expect(result).toHaveLength(50);
    });

    it('should return all results if under maxResults', () => {
      const result = optimizedSearchRooms(mockRooms, 'Room', 100);
      expect(result.length).toBeLessThanOrEqual(mockRooms.length);
    });
  });

  describe('sortByRelevance', () => {
    it('should prioritize exact room code match', () => {
      const result = sortByRelevance(mockRooms, 'A101');
      expect(result[0].roomCode).toBe('A101');
    });

    it('should prioritize room code starts with', () => {
      const result = sortByRelevance(mockRooms, 'A1');
      expect(result[0].roomCode.startsWith('A1')).toBe(true);
    });

    it('should handle empty query', () => {
      const result = sortByRelevance(mockRooms, '');
      expect(result).toEqual(mockRooms);
    });
  });

  describe('Performance', () => {
    it('should search 1000 rooms in under 500ms', () => {
      // Generate 1000 rooms
      const largeDataset: RoomWithTenant[] = Array.from(
        { length: 1000 },
        (_, i) => ({
          id: `room-${i}`,
          propertyId: 'prop1',
          roomCode: `R${i}`,
          roomName: `Room ${i}`,
          status: i % 3 === 0 ? 'vacant' : 'occupied',
          rentalPrice: 3000000 + i * 1000,
          electricityFee: 200000,
          waterFee: 100000,
          garbageFee: 50000,
          parkingFee: 150000,
          createdAt: new Date(),
          updatedAt: new Date(),
          tenant:
            i % 3 !== 0
              ? {
                  id: `t${i}`,
                  name: `Tenant ${i}`,
                  phone: `090${i}`,
                }
              : undefined,
        })
      );

      const startTime = performance.now();
      searchRooms(largeDataset, 'Room');
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(500);
    });
  });
});
