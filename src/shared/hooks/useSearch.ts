/**
 * Search Hook
 * Provides debounced search functionality
 */

import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import type { RoomWithTenant, RoomFilters } from '@/features/rooms/types';
import { filterRooms, sortByRelevance } from '@/shared/utils/search';

interface UseSearchOptions {
  debounceDelay?: number;
  maxResults?: number;
}

export function useSearch(
  rooms: RoomWithTenant[],
  options: UseSearchOptions = {}
) {
  const { debounceDelay = 300, maxResults } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<RoomFilters>({});

  // Debounce the search query
  const debouncedQuery = useDebounce(searchQuery, debounceDelay);

  // Apply filters and search
  const filteredRooms = useMemo(() => {
    const combinedFilters: RoomFilters = {
      ...filters,
      search: debouncedQuery,
    };

    let results = filterRooms(rooms, combinedFilters);

    // Sort by relevance if there's a search query
    if (debouncedQuery) {
      results = sortByRelevance(results, debouncedQuery);
    }

    // Limit results if maxResults is specified
    if (maxResults && results.length > maxResults) {
      results = results.slice(0, maxResults);
    }

    return results;
  }, [rooms, debouncedQuery, filters, maxResults]);

  const updateFilters = (newFilters: Partial<RoomFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const hasActiveFilters = useMemo(() => {
    return (
      !!searchQuery ||
      !!filters.status ||
      !!filters.paymentStatus ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
    );
  }, [searchQuery, filters]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    clearFilters,
    filteredRooms,
    hasActiveFilters,
    isSearching: searchQuery !== debouncedQuery, // True while debouncing
  };
}
