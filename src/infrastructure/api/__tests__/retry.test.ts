/**
 * Retry Logic Tests
 */

import { retryWithBackoff, withRetry, retryPresets } from '../retry';
import { AppError, ErrorCode } from '../types';

// Mock sleep to speed up tests
jest.mock('../retry', () => {
  const actual = jest.requireActual('../retry');
  return {
    ...actual,
    // Override sleep in tests to be instant
  };
});

describe('Retry Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('retryWithBackoff', () => {
    it('should succeed on first attempt', async () => {
      const fn = jest.fn().mockResolvedValue('success');

      const result = await retryWithBackoff(fn, { maxRetries: 3 });

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on network errors', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new AppError('Network error', ErrorCode.NETWORK_ERROR))
        .mockResolvedValue('success');

      const result = await retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelay: 10,
      });

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should retry on server errors', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new AppError('Server error', ErrorCode.SERVER_ERROR))
        .mockResolvedValue('success');

      const result = await retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelay: 10,
      });

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should not retry on auth errors', async () => {
      const fn = jest.fn().mockRejectedValue(new AppError('Unauthorized', ErrorCode.UNAUTHORIZED));

      await expect(
        retryWithBackoff(fn, {
          maxRetries: 3,
          initialDelay: 10,
        })
      ).rejects.toThrow('Unauthorized');

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not retry on validation errors', async () => {
      const fn = jest
        .fn()
        .mockRejectedValue(new AppError('Validation failed', ErrorCode.VALIDATION_ERROR));

      await expect(
        retryWithBackoff(fn, {
          maxRetries: 3,
          initialDelay: 10,
        })
      ).rejects.toThrow('Validation failed');

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not retry on not found errors', async () => {
      const fn = jest.fn().mockRejectedValue(new AppError('Not found', ErrorCode.NOT_FOUND));

      await expect(
        retryWithBackoff(fn, {
          maxRetries: 3,
          initialDelay: 10,
        })
      ).rejects.toThrow('Not found');

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should throw after max retries', async () => {
      const fn = jest.fn().mockRejectedValue(new AppError('Network error', ErrorCode.NETWORK_ERROR));

      await expect(
        retryWithBackoff(fn, {
          maxRetries: 3,
          initialDelay: 10,
        })
      ).rejects.toThrow('Network error');

      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should call onRetry callback', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new AppError('Network error', ErrorCode.NETWORK_ERROR))
        .mockResolvedValue('success');

      const onRetry = jest.fn();

      await retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelay: 10,
        onRetry,
      });

      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(expect.any(AppError), 1);
    });

    it('should use custom shouldRetry function', async () => {
      const fn = jest.fn().mockRejectedValue(new AppError('Custom error', ErrorCode.UNKNOWN_ERROR));

      const shouldRetry = jest.fn().mockReturnValue(false);

      await expect(
        retryWithBackoff(fn, {
          maxRetries: 3,
          initialDelay: 10,
          shouldRetry,
        })
      ).rejects.toThrow('Custom error');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(shouldRetry).toHaveBeenCalledWith(expect.any(AppError), 1);
    });
  });

  describe('withRetry', () => {
    it('should create a retry wrapper function', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const wrappedFn = withRetry(fn, { maxRetries: 3 });

      const result = await wrappedFn('arg1', 'arg2');

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should retry wrapped function', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new AppError('Network error', ErrorCode.NETWORK_ERROR))
        .mockResolvedValue('success');

      const wrappedFn = withRetry(fn, {
        maxRetries: 3,
        initialDelay: 10,
      });

      const result = await wrappedFn();

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('retryPresets', () => {
    it('should have aggressive preset', () => {
      expect(retryPresets.aggressive).toEqual({
        maxRetries: 5,
        initialDelay: 500,
        maxDelay: 10000,
        backoffMultiplier: 2,
      });
    });

    it('should have standard preset', () => {
      expect(retryPresets.standard).toEqual({
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 30000,
        backoffMultiplier: 2,
      });
    });

    it('should have conservative preset', () => {
      expect(retryPresets.conservative).toEqual({
        maxRetries: 2,
        initialDelay: 2000,
        maxDelay: 60000,
        backoffMultiplier: 3,
      });
    });

    it('should have none preset', () => {
      expect(retryPresets.none).toEqual({
        maxRetries: 1,
        initialDelay: 0,
        maxDelay: 0,
        backoffMultiplier: 1,
      });
    });
  });
});
