/**
 * Search Utility Functions
 * Provides search and filtering capabilities for the application
 */

import type { RoomFilters, RoomWithTenant } from '@/features/rooms/types';

/**
 * Performs a multi-field search on rooms
 * Searches across room code, room name, and tenant name
 */
export function searchRooms(rooms: RoomWithTenant[], query: string): RoomWithTenant[] {
  if (!query || query.trim() === '') {
    return rooms;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return rooms.filter((room) => {
    const roomCode = room.roomCode?.toLowerCase() || '';
    const roomName = room.roomName?.toLowerCase() || '';
    const tenantName = room.tenant?.name?.toLowerCase() || '';
    
    return (
      roomCode.includes(normalizedQuery) ||
      roomName.includes(normalizedQuery) ||
      tenantName.includes(normalizedQuery)
    );
  });
}

/**
 * Applies filters to room list
 */
export function filterRooms(rooms: RoomWithTenant[], filters: RoomFilters): RoomWithTenant[] {
  let filtered = [...rooms];

  if (filters.status) {
    filtered = filtered.filter((room) => room.status === filters.status);
  }

  if (filters.paymentStatus) {
    // Payment status filtering would require payment data
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((room) => room.rentalPrice >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((room) => room.rentalPrice <= filters.maxPrice!);
  }

  if (filters.search) {
    filtered = searchRooms(filtered, filters.search);
  }

  return filtered;
}

/**
 * Highlights matching text in a string
 * Returns an array of text segments with highlight flags
 */
export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

export function highlightText(text: string, query: string): HighlightSegment[] {
  if (!query || query.trim() === '') {
    return [{ text, highlighted: false }];
  }

  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase().trim();
  const index = normalizedText.indexOf(normalizedQuery);

  if (index === -1) {
    return [{ text, highlighted: false }];
  }

  const segments: HighlightSegment[] = [];

  if (index > 0) {
    segments.push({
      text: text.substring(0, index),
      highlighted: false,
    });
  }

  segments.push({
    text: text.substring(index, index + query.length),
    highlighted: true,
  });

  if (index + query.length < text.length) {
    segments.push({
      text: text.substring(index + query.length),
      highlighted: false,
    });
  }

  return segments;
}

/**
 * Optimized search for large datasets
 * Uses early exit strategies
 */
export function optimizedSearchRooms(
  rooms: RoomWithTenant[],
  query: string,
  maxResults: number = 100
): RoomWithTenant[] {
  if (!query || query.trim() === '') {
    return rooms;
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: RoomWithTenant[] = [];

  for (const room of rooms) {
    if (results.length >= maxResults) {
      break;
    }

    const roomCode = room.roomCode?.toLowerCase() || '';
    const roomName = room.roomName?.toLowerCase() || '';
    const tenantName = room.tenant?.name?.toLowerCase() || '';

    if (
      roomCode.includes(normalizedQuery) ||
      roomName.includes(normalizedQuery) ||
      tenantName.includes(normalizedQuery)
    ) {
      results.push(room);
    }
  }

  return results;
}

/**
 * Sorts rooms by relevance to search query
 * Prioritizes exact matches in room code, then room name, then tenant name
 */
export function sortByRelevance(
  rooms: RoomWithTenant[],
  query: string
): RoomWithTenant[] {
  if (!query || query.trim() === '') {
    return rooms;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return [...rooms].sort((a, b) => {
    const aCode = a.roomCode?.toLowerCase() || '';
    const aName = a.roomName?.toLowerCase() || '';
    const aTenant = a.tenant?.name?.toLowerCase() || '';

    const bCode = b.roomCode?.toLowerCase() || '';
    const bName = b.roomName?.toLowerCase() || '';
    const bTenant = b.tenant?.name?.toLowerCase() || '';

    if (aCode === normalizedQuery && bCode !== normalizedQuery) return -1;
    if (bCode === normalizedQuery && aCode !== normalizedQuery) return 1;

    if (aCode.startsWith(normalizedQuery) && !bCode.startsWith(normalizedQuery))
      return -1;
    if (bCode.startsWith(normalizedQuery) && !aCode.startsWith(normalizedQuery))
      return 1;

    if (aName === normalizedQuery && bName !== normalizedQuery) return -1;
    if (bName === normalizedQuery && aName !== normalizedQuery) return 1;

    if (aName.startsWith(normalizedQuery) && !bName.startsWith(normalizedQuery))
      return -1;
    if (bName.startsWith(normalizedQuery) && !aName.startsWith(normalizedQuery))
      return 1;

    if (aTenant.includes(normalizedQuery) && !bTenant.includes(normalizedQuery))
      return -1;
    if (bTenant.includes(normalizedQuery) && !aTenant.includes(normalizedQuery))
      return 1;

    return 0;
  });
}
