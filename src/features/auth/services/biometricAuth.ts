/**
 * Biometric Authentication Service
 * Handles biometric authentication (fingerprint, face recognition)
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { BiometricAuthResult } from '../types';
import { secureStorage, STORAGE_KEYS } from '@/infrastructure/storage/secureStorage';

class BiometricAuthService {
  /**
   * Check if biometric authentication is available on the device
   */
  async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Get supported biometric types
   */
  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Error getting supported biometric types:', error);
      return [];
    }
  }

  /**
   * Authenticate using biometrics
   */
  async authenticate(promptMessage?: string): Promise<BiometricAuthResult> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || 'Authenticate to continue',
        fallbackLabel: 'Use password',
        disableDeviceFallback: false,
      });

      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || 'Authentication failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication error',
      };
    }
  }

  /**
   * Check if biometric authentication is enabled for the user
   */
  async isEnabled(): Promise<boolean> {
    try {
      const enabled = await secureStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric enabled status:', error);
      return false;
    }
  }

  /**
   * Enable biometric authentication
   */
  async enable(): Promise<void> {
    try {
      await secureStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
    } catch (error) {
      console.error('Error enabling biometric authentication:', error);
      throw error;
    }
  }

  /**
   * Disable biometric authentication
   */
  async disable(): Promise<void> {
    try {
      await secureStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'false');
    } catch (error) {
      console.error('Error disabling biometric authentication:', error);
      throw error;
    }
  }

  /**
   * Get biometric type name for display
   */
  getBiometricTypeName(type: LocalAuthentication.AuthenticationType): string {
    switch (type) {
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return 'Fingerprint';
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return 'Face Recognition';
      case LocalAuthentication.AuthenticationType.IRIS:
        return 'Iris';
      default:
        return 'Biometric';
    }
  }
}

export const biometricAuth = new BiometricAuthService();
