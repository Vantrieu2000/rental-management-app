/**
 * Dashboard Stack Navigator
 * Handles dashboard-related screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DashboardStackParamList } from '@/shared/types/navigation';

// Screens
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export default function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
        }}
      />
    </Stack.Navigator>
  );
}
