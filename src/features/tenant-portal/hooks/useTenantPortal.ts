/**
 * Tenant Portal Hooks
 */

import { useMutation } from '@tanstack/react-query';
import { tenantPortalApi } from '../services/tenantPortalApi';
import { CheckPaymentDto } from '../types';

/**
 * Hook to check payment by phone number
 */
export function useCheckPayment() {
  return useMutation({
    mutationFn: (data: CheckPaymentDto) => tenantPortalApi.checkPayment(data),
  });
}
