/**
 * Payment Hooks
 * TanStack Query hooks for payment management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getPaymentApi } from '../services/paymentApi';
import {
  PaymentRecord,
  CreatePaymentDto,
  MarkPaidDto,
  PaymentFilters,
  FeeCalculation,
} from '../types';

/**
 * Query key factory for payments
 */
export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters?: PaymentFilters) => [...paymentKeys.lists(), filters] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  overdue: (propertyId: string) => [...paymentKeys.all, 'overdue', propertyId] as const,
  history: (roomId: string) => [...paymentKeys.all, 'history', roomId] as const,
  statistics: (propertyId: string, startDate?: Date, endDate?: Date) =>
    [...paymentKeys.all, 'statistics', propertyId, startDate, endDate] as const,
};

/**
 * Hook to get all payments with filters
 */
export function usePayments(filters?: PaymentFilters) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const paymentApi = getPaymentApi();

  return useQuery({
    queryKey: paymentKeys.list(filters),
    queryFn: () => {
      if (!accessToken) throw new Error('Not authenticated');
      return paymentApi.getPayments(accessToken, filters);
    },
    enabled: !!accessToken,
  });
}

/**
 * Hook to get a single payment by ID
 */
export function usePayment(id: string) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const paymentApi = getPaymentApi();

  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => {
      if (!accessToken) throw new Error('Not authenticated');
      return paymentApi.getPaymentById(accessToken, id);
    },
    enabled: !!accessToken && !!id,
  });
}

/**
 * Hook to get overdue payments
 */
export function useOverduePayments(propertyId: string) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const paymentApi = getPaymentApi();

  return useQuery({
    queryKey: paymentKeys.overdue(propertyId),
    queryFn: () => {
      if (!accessToken) throw new Error('Not authenticated');
      return paymentApi.getOverduePayments(accessToken, propertyId);
    },
    enabled: !!accessToken && !!propertyId,
  });
}

/**
 * Hook to get payment history for a room
 */
export function usePaymentHistory(roomId: string) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const paymentApi = getPaymentApi();

  return useQuery({
    queryKey: paymentKeys.history(roomId),
    queryFn: () => {
      if (!accessToken) throw new Error('Not authenticated');
      return paymentApi.getPaymentHistory(accessToken, roomId);
    },
    enabled: !!accessToken && !!roomId,
  });
}

/**
 * Hook to get payment statistics
 */
export function usePaymentStatistics(
  propertyId: string,
  startDate?: Date,
  endDate?: Date
) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const paymentApi = getPaymentApi();

  return useQuery({
    queryKey: paymentKeys.statistics(propertyId, startDate, endDate),
    queryFn: () => {
      if (!accessToken) throw new Error('Not authenticated');
      return paymentApi.getPaymentStatistics(accessToken, propertyId, startDate, endDate);
    },
    enabled: !!accessToken && !!propertyId,
  });
}

/**
 * Hook to create a new payment record
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const paymentApi = getPaymentApi();

  return useMutation({
    mutationFn: (data: CreatePaymentDto) => {
      if (!accessToken) throw new Error('Not authenticated');
      return paymentApi.createPayment(accessToken, data);
    },
    onSuccess: (newPayment) => {
      // Invalidate payment lists
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      // Invalidate payment history for the room
      queryClient.invalidateQueries({ queryKey: paymentKeys.history(newPayment.roomId) });
      // Invalidate statistics
      queryClient.invalidateQueries({
        queryKey: ['payments', 'statistics', newPayment.propertyId],
      });
    },
  });
}

/**
 * Hook to mark a payment as paid
 */
export function useMarkPaymentAsPaid() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const paymentApi = getPaymentApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MarkPaidDto }) => {
      if (!accessToken) throw new Error('Not authenticated');
      return paymentApi.markAsPaid(accessToken, id, data);
    },
    onSuccess: (updatedPayment) => {
      // Update the payment in cache
      queryClient.setQueryData(paymentKeys.detail(updatedPayment.id), updatedPayment);
      // Invalidate payment lists
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      // Invalidate overdue payments
      queryClient.invalidateQueries({
        queryKey: paymentKeys.overdue(updatedPayment.propertyId),
      });
      // Invalidate payment history
      queryClient.invalidateQueries({ queryKey: paymentKeys.history(updatedPayment.roomId) });
      // Invalidate statistics
      queryClient.invalidateQueries({
        queryKey: ['payments', 'statistics', updatedPayment.propertyId],
      });
    },
  });
}

/**
 * Hook to calculate fees for a room
 */
export function useCalculateFees() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const paymentApi = getPaymentApi();

  return useMutation({
    mutationFn: ({ roomId, month, year }: { roomId: string; month: number; year: number }) => {
      if (!accessToken) throw new Error('Not authenticated');
      return paymentApi.calculateFees(accessToken, roomId, month, year);
    },
  });
}
