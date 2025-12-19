/**
 * Authentication Types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'owner' | 'manager' | 'staff';

  // Preferences
  language: 'vi' | 'en';
  currency: 'VND' | 'USD';
  timezone: string;

  // Security
  biometricEnabled: boolean;
  lastLoginAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}
