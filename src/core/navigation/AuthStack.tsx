/**
 * Auth Stack Navigator
 * Handles authentication flow screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/shared/types/navigation';

// Screens
import LoginScreen from '@/features/auth/screens/LoginScreen';
import { TenantCheckScreen } from '@/features/tenant-portal/screens/TenantCheckScreen';
import { TenantResultScreen } from '@/features/tenant-portal/screens/TenantResultScreen';
import { TenantDetailScreen } from '@/features/tenant-portal/screens/TenantDetailScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="TenantCheck" component={TenantCheckScreen} />
      <Stack.Screen name="TenantResult" component={TenantResultScreen} />
      <Stack.Screen name="TenantDetail" component={TenantDetailScreen} />
    </Stack.Navigator>
  );
}
