/**
 * Maintenance Hooks
 * TanStack Query hooks for maintenance management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getMaintenanceApi } from '../services/maintenanceApi';
import {
  MaintenanceRequest,
  CreateMaintenanceRequestDto,
  UpdateMaintenanceRequestDto,
  ResolveMaintenanceRequestDto,
  MaintenanceFilters,
} from '../types';

// Get the appropriate API client (mock or real)
const maintenanceApi = getMaintenanceApi();

// Query keys
export const maintenanceKeys = {
  all: ['maintenance'] as const,
  lists: () => [...maintenanceKeys.all, 'list'] as const,
  list: (filters?: MaintenanceFilters) =>
    [...maintenanceKeys.lists(), filters] as const,
  details: () => [...maintenanceKeys.all, 'detail'] as const,
  detail: (id: string) => [...maintenanceKeys.details(), id] as const,
};

/**
 * Hook to fetch all maintenance requests
 */
export const useMaintenanceRequests = (filters?: MaintenanceFilters) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: maintenanceKeys.list(filters),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await maintenanceApi.getMaintenanceRequests(accessToken, filters);
    },
    enabled: !!accessToken,
  });
};

/**
 * Hook to fetch a single maintenance request by ID
 */
export const useMaintenanceRequest = (id: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: maintenanceKeys.detail(id),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await maintenanceApi.getMaintenanceRequestById(accessToken, id);
    },
    enabled: !!accessToken && !!id,
  });
};

/**
 * Hook to create a new maintenance request
 */
export const useCreateMaintenanceRequest = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async (data: CreateMaintenanceRequestDto) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await maintenanceApi.createMaintenanceRequest(accessToken, data);
    },
    onSuccess: () => {
      // Invalidate and refetch maintenance requests list
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
    },
  });
};

/**
 * Hook to update a maintenance request
 */
export const useUpdateMaintenanceRequest = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMaintenanceRequestDto;
    }) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await maintenanceApi.updateMaintenanceRequest(accessToken, id, data);
    },
    onSuccess: (maintenanceRequest) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: maintenanceKeys.detail(maintenanceRequest.id),
      });
    },
  });
};

/**
 * Hook to delete a maintenance request
 */
export const useDeleteMaintenanceRequest = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async (id: string) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      await maintenanceApi.deleteMaintenanceRequest(accessToken, id);
      return id;
    },
    onSuccess: (id) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.detail(id) });
    },
  });
};

/**
 * Hook to resolve a maintenance request
 */
export const useResolveMaintenanceRequest = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ResolveMaintenanceRequestDto;
    }) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await maintenanceApi.resolveMaintenanceRequest(accessToken, id, data);
    },
    onSuccess: (maintenanceRequest) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: maintenanceKeys.detail(maintenanceRequest.id),
      });
    },
  });
};

/**
 * Hook to upload a photo for a maintenance request
 */
export const useUploadMaintenancePhoto = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async ({ id, photoUri }: { id: string; photoUri: string }) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await maintenanceApi.uploadPhoto(accessToken, id, photoUri);
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific maintenance request
      queryClient.invalidateQueries({
        queryKey: maintenanceKeys.detail(variables.id),
      });
    },
  });
};
