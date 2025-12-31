import { TFunction } from 'i18next';
import { AppError } from '@/infrastructure/api/types';

/**
 * Handle property-related errors and return user-friendly messages
 */
export function handlePropertyError(error: unknown, t: TFunction): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const appError = error as AppError;
    
    switch (appError.code) {
      case 'NETWORK_ERROR':
        return t('properties.errors.networkError');
      
      case 'NOT_FOUND':
        return t('properties.errors.notFound');
      
      case 'VALIDATION_ERROR':
        return t('properties.errors.validationError');
      
      case 'SERVER_ERROR':
        return t('properties.errors.serverError');
      
      case 'CONFLICT':
        return t('properties.errors.cannotDeleteWithRooms');
      
      default:
        return t('errors.serverError');
    }
  }
  
  return t('errors.serverError');
}

/**
 * Check if property has rooms (for delete warning)
 */
export function propertyHasRooms(property: { totalRooms: number }): boolean {
  return property.totalRooms > 0;
}
