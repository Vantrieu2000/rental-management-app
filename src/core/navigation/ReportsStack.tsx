/**
 * Reports Stack Navigator
 * Handles report generation and viewing screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/shared/types/navigation';

// Screens
import ReportDashboardScreen from '@/features/reports/screens/ReportDashboardScreen';

const Stack = createNativeStackNavigator<ReportsStackParamList>();

export default function ReportsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="ReportDashboard"
        component={ReportDashboardScreen}
        options={{
          title: 'Reports',
        }}
      />
    </Stack.Navigator>
  );
}
