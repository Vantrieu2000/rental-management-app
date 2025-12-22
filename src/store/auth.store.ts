/**
 * Authentication Store
 * Manages authentication state using Zustand
 */

import { create } from 'zustand';
import { User, AuthTokens } from '@/features/auth/types';
import { secureStorage, STORAGE_KEYS } from '@/infrastructure/storage/secureStorage';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setTokens: (tokens) => {
    if (tokens) {
      set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } else {
      set({
        accessToken: null,
        refreshToken: null,
      });
    }
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  login: async (user, tokens) => {
    try {
      set({ isLoading: true, error: null });

      // Store tokens securely (with error handling)
      try {
        await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken);
        await secureStorage.setItem(
          STORAGE_KEYS.REFRESH_TOKEN,
          tokens.refreshToken
        );
        await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      } catch (storageError) {
        console.warn('Failed to store auth data securely:', storageError);
        // Continue anyway - auth will work but won't persist
      }

      // Update state
      set({
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });

      // Clear secure storage
      await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.USER_DATA);

      // Clear state
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to logout';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateProfile: (data) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...data };
      set({ user: updatedUser });

      // Update stored user data
      secureStorage
        .setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser))
        .catch((error) => {
          console.error('Failed to update stored user data:', error);
        });
    }
  },

  restoreSession: async () => {
    try {
      set({ isLoading: true });

      // Retrieve stored data
      const [accessToken, refreshToken, userData] = await Promise.all([
        secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        secureStorage.getItem(STORAGE_KEYS.USER_DATA),
      ]);

      if (accessToken && refreshToken && userData) {
        const user = JSON.parse(userData) as User;

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      set({ isLoading: false });
    }
  },
}));
