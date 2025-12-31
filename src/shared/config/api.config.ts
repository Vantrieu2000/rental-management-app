/**
 * API Configuration
 * Centralized configuration for API settings
 */

// Set this to false when backend is ready
export const USE_MOCK_API = false;

// API endpoints will be configured here
export const API_CONFIG = {
  // Change this to your backend URL when ready
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 30000, // 30 seconds
  
  // Feature flags
  useMockData: {
    properties: USE_MOCK_API,
    rooms: USE_MOCK_API,
    tenants: USE_MOCK_API,
    payments: USE_MOCK_API,
    reports: USE_MOCK_API,
    maintenance: USE_MOCK_API,
    dashboard: USE_MOCK_API,
  },
};

/**
 * Helper to check if we should use mock data for a feature
 */
export const shouldUseMock = (feature: keyof typeof API_CONFIG.useMockData): boolean => {
  return API_CONFIG.useMockData[feature];
};
