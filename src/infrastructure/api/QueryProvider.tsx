/**
 * Query Provider Component
 * Wraps the app with TanStack Query provider
 */

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Query Provider component
 * Provides TanStack Query context to the app
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
