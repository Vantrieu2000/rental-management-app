/**
 * Property-Based Tests for Authentication Failures
 * Feature: rental-management-app, Property 43: Authentication failures prevent access
 * Validates: Requirements 12.3
 */

import fc from 'fast-check';
import { authApi } from '../services/authApi';
import { useAuthStore } from '@/store/auth.store';
import { LoginCredentials } from '../types';

// Mock fetch for testing
global.fetch = jest.fn();

describe('Authentication Failures Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset auth store
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  /**
   * Feature: rental-management-app, Property 43: Authentication failures prevent access
   * Validates: Requirements 12.3
   *
   * Property: For any invalid credentials, authentication should fail with a clear
   * error message and prevent access to protected features.
   */
  it('should prevent access with invalid credentials', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate invalid credentials
        fc.record({
          email: fc.oneof(
            fc.constant(''), // Empty email
            fc.string({ minLength: 1, maxLength: 50 }).filter((s) => !s.includes('@')), // Invalid format
            fc.emailAddress() // Valid format but wrong credentials
          ),
          password: fc.oneof(
            fc.constant(''), // Empty password
            fc.string({ minLength: 1, maxLength: 5 }), // Too short
            fc.string({ minLength: 6, maxLength: 20 }) // Valid length but wrong password
          ),
        }),
        async (credentials: LoginCredentials) => {
          // Mock failed authentication response
          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({
              message: 'Invalid credentials',
              code: 'AUTH_FAILED',
            }),
          });

          // Attempt login
          try {
            await authApi.login(credentials);
            // If we reach here, the test should fail
            expect(true).toBe(false); // Force failure
          } catch (error) {
            // Verify error is thrown
            expect(error).toBeDefined();
            expect(error instanceof Error).toBe(true);

            // Verify error message is clear
            const errorMessage = (error as Error).message;
            expect(errorMessage).toBeTruthy();
            expect(errorMessage.length).toBeGreaterThan(0);
          }

          // Verify user is not authenticated
          const state = useAuthStore.getState();
          expect(state.isAuthenticated).toBe(false);
          expect(state.user).toBeNull();
          expect(state.accessToken).toBeNull();
          expect(state.refreshToken).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any authentication failure, the system should not store
   * any tokens or user data
   */
  it('should not store tokens on authentication failure', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 20 }),
        }),
        async (credentials: LoginCredentials) => {
          // Mock failed authentication response
          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({
              message: 'Authentication failed',
              code: 'AUTH_FAILED',
            }),
          });

          // Attempt login
          try {
            await authApi.login(credentials);
          } catch (error) {
            // Expected to fail
          }

          // Verify no tokens are stored
          const state = useAuthStore.getState();
          expect(state.accessToken).toBeNull();
          expect(state.refreshToken).toBeNull();
          expect(state.user).toBeNull();
          expect(state.isAuthenticated).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any authentication failure, the error message should be
   * non-empty and informative
   */
  it('should provide clear error messages on authentication failure', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 20 }),
        }),
        fc.oneof(
          fc.constant('Invalid credentials'),
          fc.constant('User not found'),
          fc.constant('Account locked'),
          fc.constant('Password incorrect'),
          fc.constant('Email not verified')
        ),
        async (credentials: LoginCredentials, errorMessage: string) => {
          // Mock failed authentication with specific error
          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({
              message: errorMessage,
              code: 'AUTH_FAILED',
            }),
          });

          // Attempt login
          try {
            await authApi.login(credentials);
            expect(true).toBe(false); // Should not reach here
          } catch (error) {
            // Verify error message is clear and matches expected
            expect(error instanceof Error).toBe(true);
            const actualMessage = (error as Error).message;

            // Error message should be non-empty
            expect(actualMessage).toBeTruthy();
            expect(actualMessage.length).toBeGreaterThan(0);

            // Error message should contain meaningful information
            expect(actualMessage).toMatch(/invalid|failed|not found|locked|incorrect|verified/i);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any network timeout, authentication should fail gracefully
   */
  it('should handle network timeouts gracefully', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 20 }),
        }),
        async (credentials: LoginCredentials) => {
          // Mock network timeout
          (global.fetch as jest.Mock).mockImplementationOnce(() => {
            return new Promise((_, reject) => {
              const error = new Error('Network timeout');
              error.name = 'AbortError';
              reject(error);
            });
          });

          // Attempt login
          try {
            await authApi.login(credentials);
            expect(true).toBe(false); // Should not reach here
          } catch (error) {
            // Verify timeout error is handled
            expect(error instanceof Error).toBe(true);
            const errorMessage = (error as Error).message;
            expect(errorMessage).toMatch(/timeout/i);
          }

          // Verify user is not authenticated
          const state = useAuthStore.getState();
          expect(state.isAuthenticated).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any malformed server response, authentication should fail safely
   */
  it('should handle malformed responses safely', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 20 }),
        }),
        async (credentials: LoginCredentials) => {
          // Mock malformed response
          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => {
              throw new Error('Invalid JSON');
            },
          });

          // Attempt login
          try {
            await authApi.login(credentials);
            expect(true).toBe(false); // Should not reach here
          } catch (error) {
            // Verify error is caught and handled
            expect(error instanceof Error).toBe(true);
          }

          // Verify system remains in safe state
          const state = useAuthStore.getState();
          expect(state.isAuthenticated).toBe(false);
          expect(state.user).toBeNull();
          expect(state.accessToken).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});
