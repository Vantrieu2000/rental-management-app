/**
 * Retry Utility
 * Implements retry logic with exponential backoff
 */

import { AppError, ErrorCode } from './types';

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: AppError, attempt: number) => boolean;
  onRetry?: (error: AppError, attempt: number) => void;
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  shouldRetry: (error: AppError) => {
    // Don't retry auth errors
    if (error.code === ErrorCode.UNAUTHORIZED || error.code === ErrorCode.FORBIDDEN) {
      return false;
    }

    // Don't retry validation errors
    if (error.code === ErrorCode.VALIDATION_ERROR) {
      return false;
    }

    // Don't retry 404 errors
    if (error.code === ErrorCode.NOT_FOUND) {
      return false;
    }

    // Retry network and server errors
    return (
      error.code === ErrorCode.NETWORK_ERROR ||
      error.code === ErrorCode.TIMEOUT_ERROR ||
      error.code === ErrorCode.SERVER_ERROR
    );
  },
  onRetry: () => {
    // Default: do nothing
  },
};

/**
 * Calculate delay with exponential backoff
 */
const calculateDelay = (
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffMultiplier: number
): number => {
  const delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);
  return Math.min(delay, maxDelay);
};

/**
 * Sleep for specified milliseconds
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let lastError: AppError;

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Convert to AppError if needed
      lastError =
        error instanceof AppError ? error : new AppError('Unknown error', ErrorCode.UNKNOWN_ERROR);

      // Check if we should retry
      const shouldRetry = opts.shouldRetry(lastError, attempt);

      // If this is the last attempt or we shouldn't retry, throw
      if (attempt === opts.maxRetries || !shouldRetry) {
        throw lastError;
      }

      // Calculate delay
      const delay = calculateDelay(
        attempt,
        opts.initialDelay,
        opts.maxDelay,
        opts.backoffMultiplier
      );

      // Call retry callback
      opts.onRetry(lastError, attempt);

      // Wait before retrying
      await sleep(delay);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError!;
}

/**
 * Create a retry wrapper for a function
 */
export function withRetry<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: RetryOptions = {}
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    return retryWithBackoff(() => fn(...args), options);
  };
}

/**
 * Retry configuration presets
 */
export const retryPresets = {
  /**
   * Aggressive retry for critical operations
   */
  aggressive: {
    maxRetries: 5,
    initialDelay: 500,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },

  /**
   * Standard retry for normal operations
   */
  standard: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
  },

  /**
   * Conservative retry for non-critical operations
   */
  conservative: {
    maxRetries: 2,
    initialDelay: 2000,
    maxDelay: 60000,
    backoffMultiplier: 3,
  },

  /**
   * No retry
   */
  none: {
    maxRetries: 1,
    initialDelay: 0,
    maxDelay: 0,
    backoffMultiplier: 1,
  },
};
