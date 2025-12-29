/**
 * Tenant Hooks
 * TanStack Query hooks for tenant management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getTenantApi } from '../services/tenantApi';
import {
  Tenant,
  CreateTenantDto,
  UpdateTenantDto,
  AssignTenantDto,
  VacateTenantDto,
  TenantFilters,
} from '../types';

// Get the appropriate API client (mock or real)
const tenantApi = getTenantApi();

// Query keys
export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  list: (filters?: TenantFilters) => [...tenantKeys.lists(), filters] as const,
  details: () => [...tenantKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
  history: (roomId: string) => [...tenantKeys.all, 'history', roomId] as const,
};

/**
 * Hook to fetch all tenants
 */
export const useTenants = (filters?: TenantFilters) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: tenantKeys.list(filters),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await tenantApi.getTenants(accessToken, filters);
    },
    enabled: !!accessToken,
  });
};

/**
 * Hook to fetch a single tenant by ID
 */
export const useTenant = (id: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await tenantApi.getTenantById(accessToken, id);
    },
    enabled: !!accessToken && !!id,
  });
};

/**
 * Hook to fetch tenant history for a room
 */
export const useTenantHistory = (roomId: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: tenantKeys.history(roomId),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await tenantApi.getTenantHistory(accessToken, roomId);
    },
    enabled: !!accessToken && !!roomId,
  });
};

/**
 * Hook to create a new tenant
 */
export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async (data: CreateTenantDto) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await tenantApi.createTenant(accessToken, data);
    },
    onSuccess: (tenant) => {
      // Invalidate and refetch tenants list
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      // Invalidate room queries to update tenant info
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      // Invalidate tenant history for the room
      queryClient.invalidateQueries({ queryKey: tenantKeys.history(tenant.roomId) });
    },
  });
};

/**
 * Hook to update a tenant
 */
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTenantDto }) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await tenantApi.updateTenant(accessToken, id, data);
    },
    onSuccess: (tenant) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(tenant.id) });
      // Invalidate room queries to update tenant info
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

/**
 * Hook to delete a tenant
 */
export const useDeleteTenant = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async (id: string) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      await tenantApi.deleteTenant(accessToken, id);
      return id;
    },
    onSuccess: (id) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) });
      // Invalidate room queries
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

/**
 * Hook to assign a tenant to a room
 */
export const useAssignTenant = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async (data: AssignTenantDto) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      return await tenantApi.assignTenant(accessToken, data);
    },
    onSuccess: (tenant) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(tenant.id) });
      queryClient.invalidateQueries({ queryKey: tenantKeys.history(tenant.roomId) });
      // Invalidate room queries to update occupancy status
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

/**
 * Hook to vacate a tenant from a room
 */
export const useVacateTenant = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async (data: VacateTenantDto) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      await tenantApi.vacateTenant(accessToken, data);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(data.tenantId) });
      queryClient.invalidateQueries({ queryKey: tenantKeys.history(data.roomId) });
      // Invalidate room queries to update occupancy status
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};
