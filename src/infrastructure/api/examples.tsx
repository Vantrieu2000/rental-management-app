/**
 * API Client Usage Examples
 * 
 * This file demonstrates how to use the API infrastructure
 * in your components and services.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, roomKeys, paymentKeys, queryClientUtils } from '@/infrastructure/api';

/**
 * Example 1: Fetching data with useQuery
 */
export function useRooms(propertyId?: string) {
  return useQuery({
    queryKey: roomKeys.list({ propertyId }),
    queryFn: async () => {
      const response = await apiClient.get('/rooms', {
        params: { propertyId },
      });
      return response.data;
    },
    enabled: !!propertyId, // Only fetch if propertyId is provided
  });
}

/**
 * Example 2: Fetching a single item
 */
export function useRoom(roomId: string) {
  return useQuery({
    queryKey: roomKeys.detail(roomId),
    queryFn: async () => {
      const response = await apiClient.get(`/rooms/${roomId}`);
      return response.data;
    },
    enabled: !!roomId,
  });
}

/**
 * Example 3: Creating data with useMutation
 */
export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomData: any) => {
      const response = await apiClient.post('/rooms', roomData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch rooms list
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

/**
 * Example 4: Updating data with optimistic updates
 */
export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/rooms/${id}`, data);
      return response.data;
    },
    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: roomKeys.detail(id) });

      // Snapshot previous value
      const previousRoom = queryClient.getQueryData(roomKeys.detail(id));

      // Optimistically update
      queryClient.setQueryData(roomKeys.detail(id), (old: any) => ({
        ...old,
        ...data,
      }));

      // Return context with snapshot
      return { previousRoom };
    },
    // On error, rollback
    onError: (err, { id }, context) => {
      if (context?.previousRoom) {
        queryClient.setQueryData(roomKeys.detail(id), context.previousRoom);
      }
    },
    // Always refetch after error or success
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

/**
 * Example 5: Deleting data
 */
export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      await apiClient.delete(`/rooms/${roomId}`);
    },
    onSuccess: () => {
      // Invalidate rooms list
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

/**
 * Example 6: Dependent queries
 */
export function useRoomWithPayments(roomId: string) {
  // First query: Get room details
  const roomQuery = useQuery({
    queryKey: roomKeys.detail(roomId),
    queryFn: async () => {
      const response = await apiClient.get(`/rooms/${roomId}`);
      return response.data;
    },
    enabled: !!roomId,
  });

  // Second query: Get payment history (depends on room)
  const paymentsQuery = useQuery({
    queryKey: paymentKeys.history(roomId),
    queryFn: async () => {
      const response = await apiClient.get(`/payments/history/${roomId}`);
      return response.data;
    },
    enabled: !!roomId && !!roomQuery.data, // Only fetch if room exists
  });

  return {
    room: roomQuery.data,
    payments: paymentsQuery.data,
    isLoading: roomQuery.isLoading || paymentsQuery.isLoading,
    error: roomQuery.error || paymentsQuery.error,
  };
}

/**
 * Example 7: Pagination
 */
export function useRoomsPaginated(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: roomKeys.list({ page, limit }),
    queryFn: async () => {
      const response = await apiClient.get('/rooms', {
        params: { page, limit },
      });
      return response.data;
    },
    keepPreviousData: true, // Keep previous data while fetching new page
  });
}

/**
 * Example 8: Infinite scroll
 */
export function useRoomsInfinite() {
  return useQuery({
    queryKey: roomKeys.lists(),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get('/rooms', {
        params: { page: pageParam, limit: 20 },
      });
      return response.data;
    },
  });
}

/**
 * Example 9: Prefetching data
 */
export async function prefetchRoom(roomId: string) {
  await queryClientUtils.prefetch(
    roomKeys.detail(roomId),
    () => apiClient.get(`/rooms/${roomId}`).then((res) => res.data),
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  );
}

/**
 * Example 10: Manual cache updates
 */
export function updateRoomCache(roomId: string, data: any) {
  queryClientUtils.setQueryData(roomKeys.detail(roomId), data);
}

/**
 * Example 11: Error handling in components
 */
export function RoomListExample() {
  const { data, isLoading, error } = useRooms('property-123');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    // Error is already an AppError from the API client
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {data?.map((room: any) => (
        <div key={room.id}>{room.name}</div>
      ))}
    </div>
  );
}

/**
 * Example 12: Using mutations in components
 */
export function CreateRoomExample() {
  const createRoom = useCreateRoom();

  const handleSubmit = async (formData: any) => {
    try {
      await createRoom.mutateAsync(formData);
      // Success! Room created
    } catch (error) {
      // Error is already an AppError
      console.error('Failed to create room:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ name: 'Room 101' });
    }}>
      <button type="submit" disabled={createRoom.isPending}>
        {createRoom.isPending ? 'Creating...' : 'Create Room'}
      </button>
      {createRoom.error && (
        <div>Error: {createRoom.error.message}</div>
      )}
    </form>
  );
}
