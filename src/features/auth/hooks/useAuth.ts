/**
 * Authentication Hook
 * Provides authentication functionality to components
 */

import { useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '../services/authApi';
import { biometricAuth } from '../services/biometricAuth';
import { LoginCredentials } from '../types';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    logout: storeLogout,
    updateProfile: storeUpdateProfile,
    restoreSession,
    clearError,
    accessToken,
  } = useAuthStore();

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        clearError();
        const response = await authApi.login(credentials);
        await storeLogin(response.user, response.tokens);
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        return { success: false, error: message };
      }
    },
    [storeLogin, clearError]
  );

  /**
   * Login with biometric authentication
   */
  const loginWithBiometric = useCallback(async () => {
    try {
      clearError();

      // Check if biometric is available and enabled
      const isAvailable = await biometricAuth.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available',
        };
      }

      const isEnabled = await biometricAuth.isEnabled();
      if (!isEnabled) {
        return {
          success: false,
          error: 'Biometric authentication is not enabled',
        };
      }

      // Authenticate
      const result = await biometricAuth.authenticate('Login to Rental Management');

      if (result.success) {
        // Restore session after successful biometric auth
        await restoreSession();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Biometric authentication failed';
      return { success: false, error: message };
    }
  }, [restoreSession, clearError]);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await authApi.logout(accessToken);
      }
      await storeLogout();
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local state
      await storeLogout();
      const message = error instanceof Error ? error.message : 'Logout failed';
      return { success: false, error: message };
    }
  }, [storeLogout, accessToken]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (data: Partial<typeof user>) => {
      try {
        if (!accessToken) {
          throw new Error('Not authenticated');
        }

        clearError();
        const updatedUser = await authApi.updateProfile(accessToken, data);
        storeUpdateProfile(updatedUser);
        return { success: true, user: updatedUser };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Update failed';
        return { success: false, error: message };
      }
    },
    [storeUpdateProfile, accessToken, clearError]
  );

  /**
   * Enable biometric authentication
   */
  const enableBiometric = useCallback(async () => {
    try {
      const isAvailable = await biometricAuth.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device',
        };
      }

      // Test authentication before enabling
      const result = await biometricAuth.authenticate('Enable biometric authentication');

      if (result.success) {
        await biometricAuth.enable();
        if (user) {
          storeUpdateProfile({ biometricEnabled: true });
        }
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to enable biometric';
      return { success: false, error: message };
    }
  }, [user, storeUpdateProfile]);

  /**
   * Disable biometric authentication
   */
  const disableBiometric = useCallback(async () => {
    try {
      await biometricAuth.disable();
      if (user) {
        storeUpdateProfile({ biometricEnabled: false });
      }
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to disable biometric';
      return { success: false, error: message };
    }
  }, [user, storeUpdateProfile]);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginWithBiometric,
    logout,
    updateProfile,
    enableBiometric,
    disableBiometric,
    restoreSession,
    clearError,
  };
};
