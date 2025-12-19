/**
 * Token Manager
 * Handles JWT token lifecycle, expiration, and auto-refresh
 */

import { authApi } from './authApi';
import { useAuthStore } from '@/store/auth.store';
import { secureStorage, STORAGE_KEYS } from '@/infrastructure/storage/secureStorage';

class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null;
  private inactivityTimer: NodeJS.Timeout | null = null;
  private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry

  /**
   * Decode JWT token to get expiration time
   */
  private decodeToken(token: string): { exp: number } | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiry(token: string): number {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return 0;
    }

    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
    return Math.max(0, timeUntilExpiry);
  }

  /**
   * Schedule token refresh before expiration
   */
  scheduleTokenRefresh(accessToken: string): void {
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const timeUntilExpiry = this.getTimeUntilExpiry(accessToken);
    const refreshTime = Math.max(0, timeUntilExpiry - this.TOKEN_REFRESH_BUFFER);

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshAccessToken();
      }, refreshTime);
    } else {
      // Token is already expired or about to expire, refresh immediately
      this.refreshAccessToken();
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<void> {
    try {
      const refreshToken = await secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        console.warn('No refresh token available');
        await this.handleTokenExpiration();
        return;
      }

      // Check if refresh token is expired
      if (this.isTokenExpired(refreshToken)) {
        console.warn('Refresh token expired');
        await this.handleTokenExpiration();
        return;
      }

      // Refresh the token
      const tokens = await authApi.refreshToken(refreshToken);

      // Update stored tokens
      await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken);
      await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);

      // Update store
      useAuthStore.getState().setTokens(tokens);

      // Schedule next refresh
      this.scheduleTokenRefresh(tokens.accessToken);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      await this.handleTokenExpiration();
    }
  }

  /**
   * Handle token expiration by logging out user
   */
  private async handleTokenExpiration(): Promise<void> {
    console.log('Token expired, logging out user');
    await useAuthStore.getState().logout();
  }

  /**
   * Start inactivity timer for auto-logout
   */
  startInactivityTimer(): void {
    this.resetInactivityTimer();
  }

  /**
   * Reset inactivity timer
   */
  resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      console.log('User inactive for 30 minutes, logging out');
      this.handleTokenExpiration();
    }, this.INACTIVITY_TIMEOUT);
  }

  /**
   * Stop inactivity timer
   */
  stopInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  /**
   * Stop all timers
   */
  stopAllTimers(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.stopInactivityTimer();
  }

  /**
   * Initialize token management
   */
  async initialize(): Promise<void> {
    const accessToken = await secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (accessToken) {
      // Check if token is expired
      if (this.isTokenExpired(accessToken)) {
        await this.refreshAccessToken();
      } else {
        // Schedule refresh
        this.scheduleTokenRefresh(accessToken);
      }

      // Start inactivity timer
      this.startInactivityTimer();
    }
  }
}

export const tokenManager = new TokenManager();
