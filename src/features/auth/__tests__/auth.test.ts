/**
 * Unit Tests for Authentication System
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '../services/authApi';
import { biometricAuth } from '../services/biometricAuth';
import { secureStorage, STORAGE_KEYS } from '@/infrastructure/storage/secureStorage';

// Mock dependencies
jest.mock('../services/authApi');
jest.mock('../services/biometricAuth');
jest.mock('@/infrastructure/storage/secureStorage');

describe('Authentication System', () => {
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

  describe('useAuth hook', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'owner' as const,
        language: 'en' as const,
        currency: 'VND' as const,
        timezone: 'Asia/Ho_Chi_Minh',
        biometricEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      (authApi.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        tokens: mockTokens,
      });

      (secureStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(loginResult).toEqual({ success: true });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    it('should handle login failure', async () => {
      (authApi.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      const { result } = renderHook(() => useAuth());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'wrong-password',
        });
      });

      expect(loginResult).toEqual({
        success: false,
        error: 'Invalid credentials',
      });
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('should logout successfully', async () => {
      // Setup authenticated state
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'owner' as const,
        language: 'en' as const,
        currency: 'VND' as const,
        timezone: 'Asia/Ho_Chi_Minh',
        biometricEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      useAuthStore.setState({
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        isAuthenticated: true,
      });

      (authApi.logout as jest.Mock).mockResolvedValue(undefined);
      (secureStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(secureStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN);
      expect(secureStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
      expect(secureStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.USER_DATA);
    });

    it('should enable biometric authentication', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'owner' as const,
        language: 'en' as const,
        currency: 'VND' as const,
        timezone: 'Asia/Ho_Chi_Minh',
        biometricEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
      });

      (biometricAuth.isAvailable as jest.Mock).mockResolvedValue(true);
      (biometricAuth.authenticate as jest.Mock).mockResolvedValue({ success: true });
      (biometricAuth.enable as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      let enableResult;
      await act(async () => {
        enableResult = await result.current.enableBiometric();
      });

      expect(enableResult).toEqual({ success: true });
      expect(biometricAuth.enable).toHaveBeenCalled();
    });

    it('should handle biometric not available', async () => {
      (biometricAuth.isAvailable as jest.Mock).mockResolvedValue(false);

      const { result } = renderHook(() => useAuth());

      let enableResult;
      await act(async () => {
        enableResult = await result.current.enableBiometric();
      });

      expect(enableResult).toEqual({
        success: false,
        error: 'Biometric authentication is not available on this device',
      });
    });
  });

  describe('Auth Store', () => {
    it('should update user profile', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'owner' as const,
        language: 'en' as const,
        currency: 'VND' as const,
        timezone: 'Asia/Ho_Chi_Minh',
        biometricEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      useAuthStore.setState({ user: mockUser });

      act(() => {
        useAuthStore.getState().updateProfile({ name: 'Updated Name' });
      });

      const state = useAuthStore.getState();
      expect(state.user?.name).toBe('Updated Name');
    });

    it('should restore session from storage', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'owner' as const,
        language: 'en' as const,
        currency: 'VND' as const,
        timezone: 'Asia/Ho_Chi_Minh',
        biometricEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (secureStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === STORAGE_KEYS.AUTH_TOKEN) return Promise.resolve('access-token');
        if (key === STORAGE_KEYS.REFRESH_TOKEN) return Promise.resolve('refresh-token');
        if (key === STORAGE_KEYS.USER_DATA) return Promise.resolve(JSON.stringify(mockUser));
        return Promise.resolve(null);
      });

      await act(async () => {
        await useAuthStore.getState().restoreSession();
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.id).toBe(mockUser.id);
      expect(state.user?.email).toBe(mockUser.email);
      expect(state.user?.name).toBe(mockUser.name);
      expect(state.accessToken).toBe('access-token');
      expect(state.refreshToken).toBe('refresh-token');
    });
  });
});
