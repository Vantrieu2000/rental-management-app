/**
 * API Client
 * Axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/shared/config/env';
import { useAuthStore } from '@/store/auth.store';
import { handleApiError, isAuthError } from './errorHandler';
import { ApiRequestConfig } from './types';

/**
 * Create Axios instance with default configuration
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: env.apiUrl,
    timeout: env.apiTimeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return instance;
};

/**
 * API Client class with interceptors
 */
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = createAxiosInstance();
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      this.handleRequest.bind(this),
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      this.handleResponseError.bind(this)
    );
  }

  /**
   * Handle outgoing requests
   * Add authentication token if available
   */
  private handleRequest(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    const customConfig = config as InternalAxiosRequestConfig & { skipAuth?: boolean };

    // Skip auth for certain requests
    if (customConfig.skipAuth) {
      return config;
    }

    // Add authentication token
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }

  /**
   * Handle response errors
   * Implement token refresh logic for 401 errors
   */
  private async handleResponseError(error: any): Promise<any> {
    const originalRequest = error.config;

    // Convert to AppError
    const appError = handleApiError(error);

    // Handle authentication errors
    if (isAuthError(appError) && !originalRequest._retry) {
      if (this.isRefreshing) {
        // Wait for token refresh to complete
        return new Promise((resolve) => {
          this.refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(this.client(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        // Attempt to refresh token
        const newToken = await this.refreshAccessToken();

        // Notify all waiting requests
        this.refreshSubscribers.forEach((callback) => callback(newToken));
        this.refreshSubscribers = [];

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return this.client(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        this.refreshSubscribers = [];
        await useAuthStore.getState().logout();
        return Promise.reject(appError);
      } finally {
        this.isRefreshing = false;
      }
    }

    return Promise.reject(appError);
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    const { refreshToken } = useAuthStore.getState();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.client.post(
        '/auth/refresh',
        { refreshToken },
        { skipAuth: true } as any
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      // Update tokens in store
      useAuthStore.getState().setTokens({
        accessToken,
        refreshToken: newRefreshToken,
      });

      return accessToken;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig & ApiRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get the underlying Axios instance
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
