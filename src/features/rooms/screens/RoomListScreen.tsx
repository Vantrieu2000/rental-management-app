/**
 * Room List Screen
 * Displays list of all rooms with search and filter
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { RoomsStackScreenProps } from '@/shared/types/navigation';

type Props = RoomsStackScreenProps<'RoomList'>;

export default function RoomListScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Room List</Text>
      <Text style={styles.subtitle}>All rooms will be displayed here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});
