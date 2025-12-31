/**
 * Settings Stack Navigator
 * Handles settings and preferences screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/shared/types/navigation';

// Screens
import SettingsHomeScreen from '@/features/settings/screens/SettingsHomeScreen';
import LanguageScreen from '@/features/settings/screens/LanguageScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="SettingsHome"
        component={SettingsHomeScreen}
        options={{
          title: 'Cài Đặt',
        }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{
          headerShown: false, // LanguageScreen has its own header
        }}
      />
    </Stack.Navigator>
  );
}
