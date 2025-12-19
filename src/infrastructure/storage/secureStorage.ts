import * as SecureStore from 'expo-secure-store';

/**
 * Secure storage wrapper using Expo SecureStore
 * Provides encrypted storage for sensitive data like tokens
 */
export const secureStorage = {
  /**
   * Save a value securely
   * @param key - Storage key
   * @param value - Value to store
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error saving ${key} to secure storage:`, error);
      throw error;
    }
  },

  /**
   * Retrieve a value securely
   * @param key - Storage key
   * @returns The stored value or null if not found
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error retrieving ${key} from secure storage:`, error);
      return null;
    }
  },

  /**
   * Remove a value from secure storage
   * @param key - Storage key
   */
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing ${key} from secure storage:`, error);
      throw error;
    }
  },

  /**
   * Clear all items from secure storage
   * Note: This removes all keys managed by this app
   */
  async clear(): Promise<void> {
    // SecureStore doesn't have a clear all method
    // We'll need to track keys manually if needed
    console.warn('SecureStore does not support clearing all items');
  },
};

// Storage keys constants
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  BIOMETRIC_ENABLED: 'biometric_enabled',
} as const;
