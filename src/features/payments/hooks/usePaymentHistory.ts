/**
 * usePaymentHistory Hook
 * Fetches payment history for a room
 */

import { useQuery } from '@tanstack/react-query';
import { getPaymentApi, Payment } from '../services/paymentApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function usePaymentHistory(roomId: string, limit?: number) {
  const { accessToken } = useAuth();

  return useQuery<Payment[], Error>({
    queryKey: ['paymentHistory', roomId, limit],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }
      const paymentApi = getPaymentApi();
      return paymentApi.getPaymentHistory(accessToken, roomId, limit);
    },
    enabled: !!accessToken && !!roomId,
  });
}
