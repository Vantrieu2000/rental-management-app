/**
 * Room Error Handler
 * Centralized error handling for room operations
 */

export interface ErrorResponse {
  type: 'validation' | 'api' | 'network' | 'unknown';
  message: string;
  canRetry: boolean;
  fields?: Record<string, string>;
}

export class RoomErrorHandler {
  /**
   * Handle any error and return a structured error response
   */
  static handle(error: unknown, t: (key: string) => string): ErrorResponse {
    // Network errors
    if (error instanceof Error && error.message.includes('timeout')) {
      return {
        type: 'network',
        message: t('rooms.errors.networkError'),
        canRetry: true,
      };
    }

    if (error instanceof Error && error.message.includes('Network')) {
      return {
        type: 'network',
        message: t('rooms.errors.networkError'),
        canRetry: true,
      };
    }

    // API errors
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('duplicate') || message.includes('already exists')) {
        return {
          type: 'api',
          message: t('rooms.errors.duplicateCode'),
          canRetry: false,
        };
      }

      if (message.includes('not found') || message.includes('404')) {
        return {
          type: 'api',
          message: t('rooms.errors.roomNotFound'),
          canRetry: false,
        };
      }

      if (message.includes('payment') || message.includes('cannot delete')) {
        return {
          type: 'api',
          message: t('rooms.errors.cannotDeleteWithPayments'),
          canRetry: false,
        };
      }

      if (message.includes('500') || message.includes('server')) {
        return {
          type: 'api',
          message: t('rooms.errors.serverError'),
          canRetry: true,
        };
      }

      return {
        type: 'api',
        message: t('rooms.errors.invalidRequest'),
        canRetry: false,
      };
    }

    // Unknown errors
    return {
      type: 'unknown',
      message: t('common.error'),
      canRetry: false,
    };
  }

  /**
   * Get user-friendly error message for specific operations
   */
  static getOperationError(operation: 'load' | 'create' | 'update' | 'delete', t: (key: string) => string): string {
    switch (operation) {
      case 'load':
        return t('rooms.errors.loadFailed');
      case 'create':
        return t('rooms.errors.createFailed');
      case 'update':
        return t('rooms.errors.updateFailed');
      case 'delete':
        return t('rooms.errors.deleteFailed');
      default:
        return t('common.error');
    }
  }
}
