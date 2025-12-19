/**
 * API Error Handler
 * Centralized error handling for API requests
 */

import { AxiosError } from 'axios';
import { AppError, ErrorCode, ApiError } from './types';

/**
 * Extract error message from various error formats
 */
const extractErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
};

/**
 * Extract validation errors from API response
 */
const extractValidationErrors = (error: any): Record<string, string[]> | undefined => {
  if (error?.errors && typeof error.errors === 'object') {
    return error.errors;
  }
  return undefined;
};

/**
 * Handle Axios errors and convert to AppError
 */
export const handleApiError = (error: unknown): AppError => {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const responseData = error.response?.data as ApiError | undefined;

    // Network error (no response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return new AppError(
          'Request timeout. Please check your connection and try again.',
          ErrorCode.TIMEOUT_ERROR
        );
      }
      return new AppError(
        'Network error. Please check your internet connection.',
        ErrorCode.NETWORK_ERROR
      );
    }

    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        return new AppError(
          extractErrorMessage(responseData) || 'Invalid request',
          ErrorCode.VALIDATION_ERROR,
          status,
          extractValidationErrors(responseData)
        );

      case 401:
        return new AppError(
          extractErrorMessage(responseData) || 'Authentication required',
          ErrorCode.UNAUTHORIZED,
          status
        );

      case 403:
        return new AppError(
          extractErrorMessage(responseData) || 'Access denied',
          ErrorCode.FORBIDDEN,
          status
        );

      case 404:
        return new AppError(
          extractErrorMessage(responseData) || 'Resource not found',
          ErrorCode.NOT_FOUND,
          status
        );

      case 422:
        return new AppError(
          extractErrorMessage(responseData) || 'Validation failed',
          ErrorCode.VALIDATION_ERROR,
          status,
          extractValidationErrors(responseData)
        );

      case 500:
      case 502:
      case 503:
      case 504:
        return new AppError(
          'Server error. Please try again later.',
          ErrorCode.SERVER_ERROR,
          status
        );

      default:
        return new AppError(
          extractErrorMessage(responseData) || 'An error occurred',
          ErrorCode.UNKNOWN_ERROR,
          status
        );
    }
  }

  // Handle AppError instances
  if (error instanceof AppError) {
    return error;
  }

  // Handle generic errors
  if (error instanceof Error) {
    return new AppError(error.message, ErrorCode.UNKNOWN_ERROR);
  }

  // Unknown error type
  return new AppError('An unexpected error occurred', ErrorCode.UNKNOWN_ERROR);
};

/**
 * Get user-friendly error message
 */
export const getUserErrorMessage = (error: AppError): string => {
  // Return the error message directly
  return error.message;
};

/**
 * Check if error requires authentication
 */
export const isAuthError = (error: AppError): boolean => {
  return error.code === ErrorCode.UNAUTHORIZED;
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: AppError): boolean => {
  return error.code === ErrorCode.NETWORK_ERROR || error.code === ErrorCode.TIMEOUT_ERROR;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: AppError): boolean => {
  return error.code === ErrorCode.VALIDATION_ERROR;
};
