/**
 * Login Screen
 * Placeholder for authentication implementation
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { AuthStackScreenProps } from '@/shared/types/navigation';

type Props = AuthStackScreenProps<'Login'>;

export default function LoginScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen</Text>
      <Text style={styles.subtitle}>Authentication will be implemented here</Text>
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
