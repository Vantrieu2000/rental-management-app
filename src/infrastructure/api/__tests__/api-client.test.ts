/**
 * API Client Tests
 */

import { AppError, ErrorCode } from '../types';
import { handleApiError } from '../errorHandler';
import { AxiosError } from 'axios';

// Mock auth store
jest.mock('@/store/auth.store', () => ({
  useAuthStore: {
    getState: jest.fn(() => ({
      accessToken: 'test-token',
      refreshToken: 'test-refresh-token',
      setTokens: jest.fn(),
      logout: jest.fn(),
    })),
  },
}));

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      const networkError = new AxiosError('Network Error');
      networkError.code = 'ERR_NETWORK';

      const appError = handleApiError(networkError);

      expect(appError).toBeInstanceOf(AppError);
      expect(appError.code).toBe(ErrorCode.NETWORK_ERROR);
      expect(appError.message).toContain('Network error');
    });

    it('should handle timeout errors', () => {
      const timeoutError = new AxiosError('Timeout');
      timeoutError.code = 'ECONNABORTED';

      const appError = handleApiError(timeoutError);

      expect(appError).toBeInstanceOf(AppError);
      expect(appError.code).toBe(ErrorCode.TIMEOUT_ERROR);
      expect(appError.message).toContain('timeout');
    });

    it('should handle 401 unauthorized errors', () => {
      const unauthorizedError = new AxiosError('Unauthorized');
      unauthorizedError.response = {
        status: 401,
        data: { message: 'Invalid token' },
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      };

      const appError = handleApiError(unauthorizedError);

      expect(appError).toBeInstanceOf(AppError);
      expect(appError.code).toBe(ErrorCode.UNAUTHORIZED);
      expect(appError.status).toBe(401);
    });

    it('should handle 404 not found errors', () => {
      const notFoundError = new AxiosError('Not Found');
      notFoundError.response = {
        status: 404,
        data: { message: 'Resource not found' },
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      };

      const appError = handleApiError(notFoundError);

      expect(appError).toBeInstanceOf(AppError);
      expect(appError.code).toBe(ErrorCode.NOT_FOUND);
      expect(appError.status).toBe(404);
    });

    it('should handle validation errors with field errors', () => {
      const validationError = new AxiosError('Validation Failed');
      validationError.response = {
        status: 422,
        data: {
          message: 'Validation failed',
          errors: {
            email: ['Email is required'],
            password: ['Password must be at least 8 characters'],
          },
        },
        statusText: 'Unprocessable Entity',
        headers: {},
        config: {} as any,
      };

      const appError = handleApiError(validationError);

      expect(appError).toBeInstanceOf(AppError);
      expect(appError.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(appError.status).toBe(422);
      expect(appError.errors).toEqual({
        email: ['Email is required'],
        password: ['Password must be at least 8 characters'],
      });
    });

    it('should handle server errors', () => {
      const serverError = new AxiosError('Internal Server Error');
      serverError.response = {
        status: 500,
        data: { message: 'Internal server error' },
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      };

      const appError = handleApiError(serverError);

      expect(appError).toBeInstanceOf(AppError);
      expect(appError.code).toBe(ErrorCode.SERVER_ERROR);
      expect(appError.status).toBe(500);
    });

    it('should handle generic errors', () => {
      const genericError = new Error('Something went wrong');

      const appError = handleApiError(genericError);

      expect(appError).toBeInstanceOf(AppError);
      expect(appError.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(appError.message).toBe('Something went wrong');
    });
  });

  describe('AppError', () => {
    it('should create AppError with all properties', () => {
      const error = new AppError(
        'Test error',
        ErrorCode.VALIDATION_ERROR,
        422,
        { field: ['Error message'] }
      );

      expect(error.message).toBe('Test error');
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.status).toBe(422);
      expect(error.errors).toEqual({ field: ['Error message'] });
      expect(error.name).toBe('AppError');
    });

    it('should create AppError with default values', () => {
      const error = new AppError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(error.status).toBeUndefined();
      expect(error.errors).toBeUndefined();
    });
  });
});
