/**
 * Payment List Screen
 * Displays list of all payments
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { PaymentsStackScreenProps } from '@/shared/types/navigation';

type Props = PaymentsStackScreenProps<'PaymentList'>;

export default function PaymentListScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Payment List</Text>
      <Text style={styles.subtitle}>All payments will be displayed here</Text>
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
