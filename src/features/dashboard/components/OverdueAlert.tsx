/**
 * OverdueAlert Component
 * Displays an alert banner for overdue payments
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { OverduePayment } from '../types';

interface OverdueAlertProps {
  overduePayments: OverduePayment[];
  onPress?: () => void;
}

export function OverdueAlert({ overduePayments, onPress }: OverdueAlertProps) {
  const theme = useTheme();

  if (overduePayments.length === 0) {
    return null;
  }

  const totalOverdue = overduePayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, { backgroundColor: '#FFF3E0' }]} mode="elevated">
        <Card.Content style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="alert-circle" size={32} color="#F57C00" />
          </View>
          <View style={styles.textContainer}>
            <Text variant="titleMedium" style={[styles.title, { color: '#E65100' }]}>
              {overduePayments.length} Overdue Payment{overduePayments.length > 1 ? 's' : ''}
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: '#F57C00' }]}>
              Total: {totalOverdue.toLocaleString('vi-VN')} VND
            </Text>
            <Text variant="bodySmall" style={[styles.hint, { color: '#FF6F00' }]}>
              Tap to view details
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#F57C00" />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 2,
  },
  hint: {
    marginTop: 4,
    opacity: 0.8,
  },
});
