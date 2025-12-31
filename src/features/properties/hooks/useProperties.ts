import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { propertyService } from '../services/propertyService';
import {
  Property,
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyStatistics,
} from '../types';
import { handlePropertyError } from '../utils/errorHandler';

// Query Keys Factory
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: () => [...propertyKeys.lists()] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  statistics: () => [...propertyKeys.all, 'statistics'] as const,
};

/**
 * Hook to fetch all properties
 */
export function useProperties() {
  return useQuery({
    queryKey: propertyKeys.list(),
    queryFn: () => propertyService.getProperties(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch property statistics
 */
export function usePropertyStatistics() {
  return useQuery({
    queryKey: propertyKeys.statistics(),
    queryFn: () => propertyService.getPropertyStatistics(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single property by ID
 */
export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyService.getPropertyById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new property
 */
export function useCreateProperty() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreatePropertyDto) => propertyService.createProperty(data),
    onSuccess: () => {
      // Invalidate and refetch properties list and statistics
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
    onError: (error) => {
      const message = handlePropertyError(error, t);
      console.error('Create property error:', message);
      // Error will be handled by the component
    },
  });
}

/**
 * Hook to update an existing property
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyDto }) =>
      propertyService.updateProperty(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific property and lists
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
    onError: (error) => {
      const message = handlePropertyError(error, t);
      console.error('Update property error:', message);
      // Error will be handled by the component
    },
  });
}

/**
 * Hook to delete a property
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => propertyService.deleteProperty(id),
    onSuccess: () => {
      // Invalidate properties list and statistics
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    },
    onError: (error) => {
      const message = handlePropertyError(error, t);
      console.error('Delete property error:', message);
      // Error will be handled by the component
    },
  });
}
