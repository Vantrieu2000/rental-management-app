/**
 * Payments Stack Navigator
 * Handles payment management screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PaymentsStackParamList } from '@/shared/types/navigation';

// Screens
import PaymentListScreen from '@/features/payments/screens/PaymentListScreen';

const Stack = createNativeStackNavigator<PaymentsStackParamList>();

export default function PaymentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="PaymentList"
        component={PaymentListScreen}
        options={{
          title: 'Payments',
        }}
      />
    </Stack.Navigator>
  );
}
