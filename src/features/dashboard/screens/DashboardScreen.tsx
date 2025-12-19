/**
 * Dashboard Screen
 * Main dashboard showing property overview and statistics
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DashboardStackScreenProps } from '@/shared/types/navigation';

type Props = DashboardStackScreenProps<'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
      <Text style={styles.subtitle}>Property overview and statistics</Text>
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
