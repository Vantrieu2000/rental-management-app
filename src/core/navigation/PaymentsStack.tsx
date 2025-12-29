/**
 * Payments Stack Navigator
 * Handles payment management screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PaymentsStackParamList } from '@/shared/types/navigation';

// Screens
import PaymentListScreen from '@/features/payments/screens/PaymentListScreen';
import RecordPaymentScreen from '@/features/payments/screens/RecordPaymentScreen';
import PaymentHistoryScreen from '@/features/payments/screens/PaymentHistoryScreen';

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
      <Stack.Screen
        name="RecordPayment"
        component={RecordPaymentScreen}
        options={{
          title: 'Record Payment',
        }}
      />
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{
          title: 'Payment History',
        }}
      />
    </Stack.Navigator>
  );
}
