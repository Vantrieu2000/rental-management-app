/**
 * Property Hooks
 * TanStack Query hooks for property management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getPropertyApi } from '../services/propertyApi';
import { usePropertyStore } from '../store/propertyStore';

// Get the appropriate API client (mock or real)
const propertyApi = getPropertyApi();
import {
  Property,
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyFilters,
} from '../types';

// Query keys
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters?: PropertyFilters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  statistics: (id: string) => [...propertyKeys.all, 'statistics', id] as const,
};

/**
 * Hook to fetch all properties
 */
export const useProperties = (filters?: PropertyFilters) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setProperties = usePropertyStore((state) => state.setProperties);

  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      const properties = await propertyApi.getProperties(accessToken, filters);
      setProperties(properties);
      return properties;
    },
    enabled: !!accessToken,
  });
};

/**
 * Hook to fetch a single property by ID
 */
export const useProperty = (id: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await propertyApi.getPropertyById(accessToken, id);
    },
    enabled: !!accessToken && !!id,
  });
};

/**
 * Hook to fetch property statistics
 */
export const usePropertyStatistics = (id: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: propertyKeys.statistics(id),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await propertyApi.getPropertyStatistics(accessToken, id);
    },
    enabled: !!accessToken && !!id,
  });
};

/**
 * Hook to create a new property
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const addProperty = usePropertyStore((state) => state.addProperty);

  return useMutation({
    mutationFn: async (data: CreatePropertyDto) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await propertyApi.createProperty(accessToken, data);
    },
    onSuccess: (property) => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      // Add to store
      addProperty(property);
    },
  });
};

/**
 * Hook to update a property
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const updatePropertyInStore = usePropertyStore((state) => state.updateProperty);

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePropertyDto;
    }) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await propertyApi.updateProperty(accessToken, id, data);
    },
    onSuccess: (property) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(property.id) });
      queryClient.invalidateQueries({
        queryKey: propertyKeys.statistics(property.id),
      });
      // Update store
      updatePropertyInStore(property.id, property);
    },
  });
};

/**
 * Hook to delete a property
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const removeProperty = usePropertyStore((state) => state.removeProperty);

  return useMutation({
    mutationFn: async (id: string) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      await propertyApi.deleteProperty(accessToken, id);
      return id;
    },
    onSuccess: (id) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      // Remove from store
      removeProperty(id);
    },
  });
};

/**
 * Hook to get the currently selected property
 */
export const useSelectedProperty = () => {
  const selectedPropertyId = usePropertyStore((state) => state.selectedPropertyId);
  const getSelectedProperty = usePropertyStore((state) => state.getSelectedProperty);

  return {
    selectedPropertyId,
    selectedProperty: getSelectedProperty(),
  };
};
