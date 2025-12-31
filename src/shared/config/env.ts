/**
 * Environment Configuration
 *
 * This file provides type-safe access to environment variables.
 * All environment variables should be accessed through this module.
 */

import Constants from 'expo-constants';

interface EnvConfig {
  // API Configuration
  apiUrl: string;
  apiTimeout: number;

  // Authentication
  jwtSecretKey: string;
  tokenExpiry: string;
  refreshTokenExpiry: string;

  // Database
  mongodbUri: string;

  // App Configuration
  appName: string;
  defaultLanguage: 'vi' | 'en';
  defaultCurrency: 'VND' | 'USD';

  // Feature Flags
  enableBiometricAuth: boolean;
  enableOfflineMode: boolean;
  enableAnalytics: boolean;

  // Development
  debugMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Get config from Expo Constants
 */
const getConfig = () => {
  const extra = Constants.expoConfig?.extra || {};
  
  return {
    apiUrl: extra.apiUrl || 'https://rental-api.melidev.id.vn',
    apiTimeout: extra.apiTimeout || 30000,
    jwtSecretKey: extra.jwtSecretKey || 'dev-secret-key',
    tokenExpiry: extra.tokenExpiry || '30m',
    refreshTokenExpiry: extra.refreshTokenExpiry || '7d',
    mongodbUri: extra.mongodbUri || 'mongodb://localhost:27017/rental-management',
    appName: extra.appName || 'Rental Management',
    defaultLanguage: (extra.defaultLanguage || 'vi') as 'vi' | 'en',
    defaultCurrency: (extra.defaultCurrency || 'VND') as 'VND' | 'USD',
    enableBiometricAuth: extra.enableBiometricAuth !== false,
    enableOfflineMode: extra.enableOfflineMode !== false,
    enableAnalytics: extra.enableAnalytics === true,
    debugMode: extra.debugMode === true,
    logLevel: (extra.logLevel || 'info') as 'debug' | 'info' | 'warn' | 'error',
  };
};

/**
 * Environment configuration object
 */
export const env: EnvConfig = getConfig();

/**
 * Validate that required environment variables are set
 */
export const validateEnv = (): void => {
  if (!env.apiUrl) {
    console.warn('Warning: API_URL is not configured');
  }
  
  // Log current configuration in development
  if (env.debugMode) {
    console.log('📋 Environment Configuration:');
    console.log('  API URL:', env.apiUrl);
    console.log('  Language:', env.defaultLanguage);
    console.log('  Currency:', env.defaultCurrency);
  }
};

// Validate on module load
validateEnv();
