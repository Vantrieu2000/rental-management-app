/**
 * Rooms Stack Navigator
 * Handles room management screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { RoomsStackParamList } from '@/shared/types/navigation';

// Screens
import { RoomsScreen } from '@/features/rooms/screens/RoomsScreen';
import { RoomDetailScreen } from '@/features/rooms/screens/RoomDetailScreen';

const Stack = createNativeStackNavigator<RoomsStackParamList>();

export default function RoomsStack() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="RoomList"
        component={RoomsScreen}
        options={{
          title: t('rooms.title'),
        }}
      />
      <Stack.Screen
        name="RoomDetail"
        component={RoomDetailScreen}
        options={{
          title: t('rooms.roomDetails'),
        }}
      />
    </Stack.Navigator>
  );
}
