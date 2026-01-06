/**
 * BankQRCode Component - Native Version
 * Generates VietQR code for bank transfer on iOS and Android
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Surface } from 'react-native-paper';

interface BankQRCodeProps {
  amount: number;
  description: string;
  style?: any;
}

// Check if QRCode module is available
let QRCode: any = null;
let isQRCodeAvailable = false;

try {
  QRCode = require('react-native-qrcode-svg').default;
  isQRCodeAvailable = true;
} catch (error) {
  console.log('QRCode module not available - showing bank info only');
  isQRCodeAvailable = false;
}

/**
 * Generate VietQR string following VietQR standard
 */
function generateVietQRString(
  bankBin: string,
  accountNumber: string,
  accountName: string,
  amount: number,
  description: string
): string {
  const qrData = {
    bankBin,
    accountNumber,
    accountName,
    amount,
    description,
    template: 'compact',
  };

  return JSON.stringify(qrData);
}

export function BankQRCode({ amount, description, style }: BankQRCodeProps) {
  const Constants = require('expo-constants').default;
  const bankName = Constants.expoConfig?.extra?.bankName || 'Ngân hàng';
  const accountNumber = Constants.expoConfig?.extra?.bankAccountNumber || '';
  const accountName = Constants.expoConfig?.extra?.bankAccountName || '';
  const bankBin = Constants.expoConfig?.extra?.bankBin || '';

  // Generate QR code data
  const qrValue = generateVietQRString(
    bankBin,
    accountNumber,
    accountName,
    amount,
    description
  );

  return (
    <Card style={[styles.container, style]}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          {isQRCodeAvailable ? 'Quét mã QR để chuyển khoản' : 'Thông tin chuyển khoản'}
        </Text>

        {isQRCodeAvailable ? (
          <Surface style={styles.qrContainer} elevation={0}>
            <QRCode
              value={qrValue}
              size={200}
              backgroundColor="white"
              color="black"
            />
          </Surface>
        ) : (
          <Surface style={styles.placeholderContainer} elevation={0}>
            <Text variant="bodySmall" style={styles.placeholderText}>
              📱 QR Code sẽ hiển thị sau khi rebuild app
            </Text>
            <Text variant="bodySmall" style={styles.placeholderSubtext}>
              Chạy: npx expo run:android
            </Text>
          </Surface>
        )}

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
          {isQRCodeAvailable 
            ? '💡 Quét mã QR bằng app ngân hàng để chuyển khoản nhanh chóng'
            : '💡 Vui lòng chuyển khoản theo thông tin trên'}
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
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholderText: {
    color: '#1976d2',
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderSubtext: {
    color: '#1976d2',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.7,
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
