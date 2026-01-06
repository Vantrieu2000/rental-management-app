/**
 * BankQRCode Component - Web Version
 * Shows bank information without QR code (QR code requires native modules)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Surface } from 'react-native-paper';
import Constants from 'expo-constants';

interface BankQRCodeProps {
  amount: number;
  description: string;
  style?: any;
}

export function BankQRCode({ amount, description, style }: BankQRCodeProps) {
  const bankName = Constants.expoConfig?.extra?.bankName || 'Ngân hàng';
  const accountNumber = Constants.expoConfig?.extra?.bankAccountNumber || '';
  const accountName = Constants.expoConfig?.extra?.bankAccountName || '';

  return (
    <Card style={[styles.container, style]}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Thông tin chuyển khoản
        </Text>

        <Surface style={styles.placeholderContainer} elevation={0}>
          <Text variant="bodySmall" style={styles.placeholderText}>
            💳 Vui lòng chuyển khoản theo thông tin bên dưới
          </Text>
        </Surface>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text variant="bodySmall" style={styles.label}>
              Ngân hàng:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {bankName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodySmall" style={styles.label}>
              Số tài khoản:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {accountNumber}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodySmall" style={styles.label}>
              Chủ tài khoản:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {accountName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodySmall" style={styles.label}>
              Số tiền:
            </Text>
            <Text variant="titleMedium" style={[styles.value, styles.amount]}>
              {amount.toLocaleString('vi-VN')}₫
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodySmall" style={styles.label}>
              Nội dung:
            </Text>
            <Text variant="bodyMedium" style={[styles.value, styles.description]}>
              {description}
            </Text>
          </View>
        </View>

        <Text variant="bodySmall" style={styles.note}>
          💡 Vui lòng chuyển khoản theo thông tin trên
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholderText: {
    color: '#1976d2',
    fontWeight: '600',
    textAlign: 'center',
  },
  infoContainer: {
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    color: '#666',
    flex: 1,
  },
  value: {
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  amount: {
    color: '#1976d2',
    fontSize: 18,
  },
  description: {
    color: '#f57c00',
  },
  note: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});
