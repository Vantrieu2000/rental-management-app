/**
 * Environment Configuration
 *
 * This file provides type-safe access to environment variables.
 * All environment variables should be accessed through this module.
 */

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
 * Parse boolean from string
 */
const parseBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

/**
 * Get environment variable with fallback
 */
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

/**
 * Environment configuration object
 */
export const env: EnvConfig = {
  // API Configuration
  apiUrl: getEnvVar('API_URL', 'http://localhost:3000/api'),
  apiTimeout: parseInt(getEnvVar('API_TIMEOUT', '30000'), 10),

  // Authentication
  jwtSecretKey: getEnvVar('JWT_SECRET_KEY', 'dev-secret-key'),
  tokenExpiry: getEnvVar('TOKEN_EXPIRY', '30m'),
  refreshTokenExpiry: getEnvVar('REFRESH_TOKEN_EXPIRY', '7d'),

  // Database
  mongodbUri: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017/rental-management'),

  // App Configuration
  appName: getEnvVar('APP_NAME', 'Rental Management'),
  defaultLanguage: getEnvVar('DEFAULT_LANGUAGE', 'vi') as 'vi' | 'en',
  defaultCurrency: getEnvVar('DEFAULT_CURRENCY', 'VND') as 'VND' | 'USD',

  // Feature Flags
  enableBiometricAuth: parseBoolean(getEnvVar('ENABLE_BIOMETRIC_AUTH'), true),
  enableOfflineMode: parseBoolean(getEnvVar('ENABLE_OFFLINE_MODE'), true),
  enableAnalytics: parseBoolean(getEnvVar('ENABLE_ANALYTICS'), false),

  // Development
  debugMode: parseBoolean(getEnvVar('DEBUG_MODE'), false),
  logLevel: getEnvVar('LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',
};

/**
 * Validate that required environment variables are set
 */
export const validateEnv = (): void => {
  const requiredVars = ['API_URL', 'MONGODB_URI'];
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`);
  }
};

// Validate on module load in production
if (process.env.NODE_ENV === 'production') {
  validateEnv();
}
