/**
 * Report Dashboard Screen
 * Main screen for reports and analytics
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ReportsStackScreenProps } from '@/shared/types/navigation';

type Props = ReportsStackScreenProps<'ReportDashboard'>;

export default function ReportDashboardScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reports</Text>
      <Text style={styles.subtitle}>Reports and analytics will be displayed here</Text>
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
