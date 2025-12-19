/**
 * Settings Home Screen
 * Main settings screen with options
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { SettingsStackScreenProps } from '@/shared/types/navigation';

type Props = SettingsStackScreenProps<'SettingsHome'>;

export default function SettingsHomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      <Text style={styles.subtitle}>App settings and preferences</Text>
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
