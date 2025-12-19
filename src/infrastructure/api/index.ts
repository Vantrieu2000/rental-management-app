/**
 * API Infrastructure
 * Central export for all API-related utilities
 */

// API Client
export { apiClient } from './client';

// Query Client
export { queryClient, createQueryClient, queryClientUtils } from './queryClient';

// Query Keys
export {
  roomKeys,
  tenantKeys,
  paymentKeys,
  propertyKeys,
  notificationKeys,
  reminderKeys,
  maintenanceKeys,
  reportKeys,
  authKeys,
  dashboardKeys,
  getEntityKeys,
} from './queryKeys';

// Error Handling
export {
  handleApiError,
  getUserErrorMessage,
  isAuthError,
  isNetworkError,
  isValidationError,
} from './errorHandler';

// Retry Logic
export { retryWithBackoff, withRetry, retryPresets } from './retry';
export type { RetryOptions } from './retry';

// Types
export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  ApiRequestConfig,
} from './types';
export { AppError, ErrorCode } from './types';
