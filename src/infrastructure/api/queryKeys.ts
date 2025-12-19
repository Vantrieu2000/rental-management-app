/**
 * Query Key Factories
 * Centralized query key management for TanStack Query
 */

/**
 * Room query keys
 */
export const roomKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...roomKeys.lists(), filters] as const,
  details: () => [...roomKeys.all, 'detail'] as const,
  detail: (id: string) => [...roomKeys.details(), id] as const,
  search: (query: string, propertyId?: string) =>
    [...roomKeys.all, 'search', query, propertyId] as const,
};

/**
 * Tenant query keys
 */
export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...tenantKeys.lists(), filters] as const,
  details: () => [...tenantKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
  history: (roomId: string) => [...tenantKeys.all, 'history', roomId] as const,
};

/**
 * Payment query keys
 */
export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...paymentKeys.lists(), filters] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  overdue: (propertyId?: string) => [...paymentKeys.all, 'overdue', propertyId] as const,
  history: (roomId: string) => [...paymentKeys.all, 'history', roomId] as const,
  statistics: (filters?: Record<string, any>) =>
    [...paymentKeys.all, 'statistics', filters] as const,
};

/**
 * Property query keys
 */
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  statistics: (id: string) => [...propertyKeys.all, 'statistics', id] as const,
};

/**
 * Notification query keys
 */
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (userId?: string) => [...notificationKeys.lists(), userId] as const,
  unread: (userId?: string) => [...notificationKeys.all, 'unread', userId] as const,
};

/**
 * Reminder query keys
 */
export const reminderKeys = {
  all: ['reminders'] as const,
  lists: () => [...reminderKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...reminderKeys.lists(), filters] as const,
  details: () => [...reminderKeys.all, 'detail'] as const,
  detail: (id: string) => [...reminderKeys.details(), id] as const,
};

/**
 * Maintenance query keys
 */
export const maintenanceKeys = {
  all: ['maintenance'] as const,
  lists: () => [...maintenanceKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...maintenanceKeys.lists(), filters] as const,
  details: () => [...maintenanceKeys.all, 'detail'] as const,
  detail: (id: string) => [...maintenanceKeys.details(), id] as const,
  byRoom: (roomId: string) => [...maintenanceKeys.all, 'room', roomId] as const,
};

/**
 * Report query keys
 */
export const reportKeys = {
  all: ['reports'] as const,
  generate: (filters?: Record<string, any>) => [...reportKeys.all, 'generate', filters] as const,
  detail: (id: string) => [...reportKeys.all, 'detail', id] as const,
};

/**
 * User/Auth query keys
 */
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

/**
 * Dashboard query keys
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  statistics: (propertyId?: string) => [...dashboardKeys.all, 'statistics', propertyId] as const,
  recentActivity: (limit?: number) => [...dashboardKeys.all, 'activity', limit] as const,
};

/**
 * Utility function to invalidate all queries for an entity
 */
export const getEntityKeys = (entity: string) => {
  const keyMap: Record<string, readonly string[]> = {
    rooms: roomKeys.all,
    tenants: tenantKeys.all,
    payments: paymentKeys.all,
    properties: propertyKeys.all,
    notifications: notificationKeys.all,
    reminders: reminderKeys.all,
    maintenance: maintenanceKeys.all,
    reports: reportKeys.all,
    auth: authKeys.all,
    dashboard: dashboardKeys.all,
  };

  return keyMap[entity] || [];
};
