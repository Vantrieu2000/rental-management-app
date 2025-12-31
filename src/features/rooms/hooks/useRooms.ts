/**
 * Room Hooks
 * Custom hooks for room data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getRoomApi } from '../services/roomApi';
import {
  Room,
  RoomFilters,
  CreateRoomDto,
  UpdateRoomDto,
  RoomsResponse,
} from '../types';

const roomApi = getRoomApi();

// Query key factory
export const roomKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomKeys.all, 'list'] as const,
  list: (filters: RoomFilters) => [...roomKeys.lists(), filters] as const,
  details: () => [...roomKeys.all, 'detail'] as const,
  detail: (id: string) => [...roomKeys.details(), id] as const,
};

/**
 * Hook to fetch rooms with optional filters
 */
export function useRooms(filters: RoomFilters = {}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { shouldUseMock } = require('@/shared/config/api.config');
  const useMock = shouldUseMock('rooms');
  console.log(filters)

  return useQuery<RoomsResponse, Error>({
    queryKey: roomKeys.list(filters),
    queryFn: async () => {
      // Mock API doesn't need token
      if (!useMock && !accessToken) {
        throw new Error('No authentication token');
      }
      return roomApi.getRooms(accessToken || '', filters);
    },
    enabled: useMock || !!accessToken, // Enable if using mock OR if has token
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch a single room by ID
 */
export function useRoom(roomId: string) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { shouldUseMock } = require('@/shared/config/api.config');
  const useMock = shouldUseMock('rooms');

  return useQuery<Room, Error>({
    queryKey: roomKeys.detail(roomId),
    queryFn: async () => {
      // Mock API doesn't need token
      if (!useMock && !accessToken) {
        throw new Error('No authentication token');
      }
      return roomApi.getRoomById(accessToken || '', roomId);
    },
    enabled: (useMock || !!accessToken) && !!roomId, // Enable if using mock OR if has token
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to create a new room
 */
export function useCreateRoom() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { shouldUseMock } = require('@/shared/config/api.config');
  const useMock = shouldUseMock('rooms');

  return useMutation<Room, Error, CreateRoomDto, { previousRooms: [any, any][] }>({
    mutationFn: async (data: CreateRoomDto) => {
      
      // Mock API doesn't need token
      if (!useMock && !accessToken) {
        console.error('No authentication token available');
        throw new Error('No authentication token');
      }
      
      console.log('Calling roomApi.createRoom...');
      return roomApi.createRoom(accessToken || '', data);
    },
    onMutate: async (newRoom) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: roomKeys.lists() });

      // Snapshot the previous value
      const previousRooms = queryClient.getQueriesData({ queryKey: roomKeys.lists() });

      // Optimistically update to the new value
      queryClient.setQueriesData<RoomsResponse>(
        { queryKey: roomKeys.lists() },
        (old) => {
          // If no data exists yet, skip optimistic update
          if (!old || !old.data || !Array.isArray(old.data)) {
            return old;
          }
          
          // Create optimistic room with temporary ID
          const optimisticRoom: Room = {
            id: `temp-${Date.now()}`,
            roomCode: newRoom.roomCode,
            roomName: newRoom.roomName,
            rentalPrice: newRoom.rentalPrice,
            electricityFee: newRoom.electricityFee,
            waterFee: newRoom.waterFee,
            garbageFee: newRoom.garbageFee,
            parkingFee: newRoom.parkingFee,
            status: 'vacant',
            propertyId: newRoom.propertyId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            ...old,
            data: [optimisticRoom, ...old.data],
            total: old.total + 1,
          };
        }
      );

      return { previousRooms };
    },
    onError: (_err, _newRoom, context) => {
      // Rollback to previous value on error
      if (context?.previousRooms) {
        context.previousRooms.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      // Invalidate all room lists to refetch with real data
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

/**
 * Hook to update an existing room
 */
export function useUpdateRoom() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { shouldUseMock } = require('@/shared/config/api.config');
  const useMock = shouldUseMock('rooms');

  return useMutation<Room, Error, { id: string; data: UpdateRoomDto }, { previousRoom: any; previousRooms: [any, any][] }>({
    mutationFn: async ({ id, data }) => {
      // Mock API doesn't need token
      if (!useMock && !accessToken) {
        throw new Error('No authentication token');
      }
      return roomApi.updateRoom(accessToken || '', id, data);
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: roomKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: roomKeys.lists() });

      // Snapshot the previous values
      const previousRoom = queryClient.getQueryData(roomKeys.detail(id));
      const previousRooms = queryClient.getQueriesData({ queryKey: roomKeys.lists() });

      // Optimistically update the room detail
      queryClient.setQueryData<Room>(roomKeys.detail(id), (old) => {
        if (!old) return old;
        return { ...old, ...data, updatedAt: new Date().toISOString() };
      });

      // Optimistically update the room in lists
      queryClient.setQueriesData<RoomsResponse>(
        { queryKey: roomKeys.lists() },
        (old) => {
          // If no data exists yet, skip optimistic update
          if (!old || !old.data || !Array.isArray(old.data)) {
            return old;
          }
          
          return {
            ...old,
            data: old.data.map((room) =>
              room.id === id
                ? { ...room, ...data, updatedAt: new Date().toISOString() }
                : room
            ),
          };
        }
      );

      return { previousRoom, previousRooms };
    },
    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previousRoom) {
        queryClient.setQueryData(roomKeys.detail(id), context.previousRoom);
      }
      if (context?.previousRooms) {
        context.previousRooms.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (updatedRoom) => {
      // Invalidate to refetch with real data
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(updatedRoom.id) });
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

/**
 * Hook to delete a room
 */
export function useDeleteRoom() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const { shouldUseMock } = require('@/shared/config/api.config');
  const useMock = shouldUseMock('rooms');

  return useMutation<void, Error, string, { previousRooms: [any, any][] }>({
    mutationFn: async (id: string) => {
      // Mock API doesn't need token
      if (!useMock && !accessToken) {
        throw new Error('No authentication token');
      }
      return roomApi.deleteRoom(accessToken || '', id);
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: roomKeys.lists() });

      // Snapshot the previous value
      const previousRooms = queryClient.getQueriesData({ queryKey: roomKeys.lists() });

      // Optimistically remove the room from lists
      queryClient.setQueriesData<RoomsResponse>(
        { queryKey: roomKeys.lists() },
        (old) => {
          // If no data exists yet, skip optimistic update
          if (!old || !old.data || !Array.isArray(old.data)) {
            return old;
          }
          
          return {
            ...old,
            data: old.data.filter((room) => room.id !== id),
            total: old.total - 1,
          };
        }
      );

      return { previousRooms };
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previousRooms) {
        context.previousRooms.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (_, deletedId) => {
      // Remove the specific room from cache
      queryClient.removeQueries({ queryKey: roomKeys.detail(deletedId) });
      // Invalidate all room lists to refetch
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}
