/**
 * Rooms Stack Navigator
 * Handles room management screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RoomsStackParamList } from '@/shared/types/navigation';

// Screens
import RoomListScreen from '@/features/rooms/screens/RoomListScreen';

const Stack = createNativeStackNavigator<RoomsStackParamList>();

export default function RoomsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="RoomList"
        component={RoomListScreen}
        options={{
          title: 'Rooms',
        }}
      />
    </Stack.Navigator>
  );
}
