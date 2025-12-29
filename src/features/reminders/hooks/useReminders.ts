/**
 * Reminders Hooks
 * React Query hooks for reminder management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reminderApi } from '../services/reminderApi';
import { reminderScheduler } from '../services/reminderScheduler';
import { Reminder, CreateReminderDto, ReminderFilters, ReminderLog } from '../types';
import { PaymentRecord } from '../../payments/types';

// Query keys
export const reminderKeys = {
  all: ['reminders'] as const,
  lists: () => [...reminderKeys.all, 'list'] as const,
  list: (filters: ReminderFilters) => [...reminderKeys.lists(), filters] as const,
  details: () => [...reminderKeys.all, 'detail'] as const,
  detail: (id: string) => [...reminderKeys.details(), id] as const,
  logs: (reminderId: string) => [...reminderKeys.all, 'logs', reminderId] as const,
};

/**
 * Hook to get all reminders
 */
export function useReminders(accessToken: string, filters?: ReminderFilters) {
  return useQuery({
    queryKey: reminderKeys.list(filters || {}),
    queryFn: () => reminderApi.getReminders(accessToken, filters),
    enabled: !!accessToken,
  });
}

/**
 * Hook to get a single reminder
 */
export function useReminder(accessToken: string, id: string) {
  return useQuery({
    queryKey: reminderKeys.detail(id),
    queryFn: () => reminderApi.getReminderById(accessToken, id),
    enabled: !!accessToken && !!id,
  });
}

/**
 * Hook to get reminder logs
 */
export function useReminderLogs(accessToken: string, reminderId: string) {
  return useQuery({
    queryKey: reminderKeys.logs(reminderId),
    queryFn: () => reminderApi.getReminderLogs(accessToken, reminderId),
    enabled: !!accessToken && !!reminderId,
  });
}

/**
 * Hook to create a reminder
 */
export function useCreateReminder(accessToken: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReminderDto) =>
      reminderApi.createReminder(accessToken, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
    },
  });
}

/**
 * Hook to schedule a due date reminder
 */
export function useScheduleDueDateReminder(accessToken: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payment: PaymentRecord) => {
      const reminder = await reminderScheduler.scheduleDueDateReminder(payment);
      await reminderApi.createReminder(accessToken, {
        paymentId: reminder.paymentId,
        roomId: reminder.roomId,
        propertyId: reminder.propertyId,
        type: reminder.type,
        scheduledDate: reminder.scheduledDate,
      });
      return reminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
    },
  });
}

/**
 * Hook to schedule a custom reminder
 */
export function useScheduleCustomReminder(accessToken: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payment,
      daysBefore,
    }: {
      payment: PaymentRecord;
      daysBefore: number;
    }) => {
      const reminder = await reminderScheduler.scheduleCustomReminder(
        payment,
        daysBefore
      );
      await reminderApi.createReminder(accessToken, {
        paymentId: reminder.paymentId,
        roomId: reminder.roomId,
        propertyId: reminder.propertyId,
        type: reminder.type,
        scheduledDate: reminder.scheduledDate,
      });
      return reminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
    },
  });
}

/**
 * Hook to schedule a recurring reminder
 */
export function useScheduleRecurringReminder(accessToken: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payment,
      intervalDays,
    }: {
      payment: PaymentRecord;
      intervalDays: number;
    }) => {
      const reminder = await reminderScheduler.scheduleRecurringReminder(
        payment,
        intervalDays
      );
      await reminderApi.createReminder(accessToken, {
        paymentId: reminder.paymentId,
        roomId: reminder.roomId,
        propertyId: reminder.propertyId,
        type: reminder.type,
        scheduledDate: reminder.scheduledDate,
        intervalDays: reminder.intervalDays,
      });
      return reminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
    },
  });
}

/**
 * Hook to delete a reminder
 */
export function useDeleteReminder(accessToken: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await reminderScheduler.cancelReminder(id);
      await reminderApi.deleteReminder(accessToken, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
    },
  });
}

/**
 * Hook to log a reminder
 */
export function useLogReminder(accessToken: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reminder,
      recipientId,
      notificationId,
    }: {
      reminder: Reminder;
      recipientId: string;
      notificationId?: string;
    }) => {
      const log = await reminderScheduler.logReminder(
        reminder,
        recipientId,
        notificationId
      );
      await reminderApi.createReminderLog(accessToken, log);
      return log;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reminderKeys.logs(variables.reminder.id),
      });
    },
  });
}
