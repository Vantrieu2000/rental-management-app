/**
 * Root Navigator
 * Handles authentication flow (Auth vs Main stack)
 */

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/shared/types/navigation';
import { useAuthStore } from '@/store/auth.store';

// Navigators
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();

  // Restore session on mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return null; // TODO: Add proper loading screen
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
