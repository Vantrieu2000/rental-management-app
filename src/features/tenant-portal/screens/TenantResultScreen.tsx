/**
 * Tenant Result Screen
 * Displays payment results for tenant
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  Card,
  Chip,
  IconButton,
  useTheme,
  Divider,
  Surface,
} from 'react-native-paper';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { TenantPaymentResult } from '../types';

interface TenantResultScreenProps {
  route: {
    params: {
      results: TenantPaymentResult[];
    };
  };
  navigation: any;
}

export function TenantResultScreen({ route, navigation }: TenantResultScreenProps) {
  const { results } = route.params;
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#4caf50';
      case 'partial':
        return '#ff9800';
      case 'unpaid':
        return '#9e9e9e';
      case 'overdue':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Đã đóng';
      case 'partial':
        return 'Đóng 1 phần';
      case 'unpaid':
        return 'Chưa đóng';
      case 'overdue':
        return 'Quá hạn';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  const handleViewDetail = (result: TenantPaymentResult) => {
    navigation.navigate('TenantDetail', { result });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineMedium" style={styles.title}>
          Kết Quả Tra Cứu
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Summary */}
        <Surface style={styles.summaryCard} elevation={1}>
          <Text variant="titleMedium" style={styles.summaryTitle}>
            Tìm thấy {results.length} phòng
          </Text>
          <Text variant="bodyMedium" style={styles.summaryText}>
            Người thuê: {results[0]?.room.tenant.name}
          </Text>
        </Surface>

        {/* Room Cards */}
        {results.map((result, index) => (
          <Card
            key={result.room.id}
            style={styles.card}
            onPress={() => handleViewDetail(result)}
          >
            <Card.Content>
              {/* Room Info */}
              <View style={styles.cardHeader}>
                <View style={styles.roomInfo}>
                  <Text variant="titleLarge" style={styles.roomCode}>
                    {result.room.roomCode}
                  </Text>
                  <Text variant="bodyMedium" style={styles.roomName}>
                    {result.room.roomName}
                  </Text>
                  <Text variant="bodySmall" style={styles.propertyName}>
                    📍 {result.room.propertyName}
                  </Text>
                </View>
                {result.latestPayment && (
                  <Chip
                    mode="flat"
                    style={[
                      styles.statusChip,
                      { backgroundColor: getStatusColor(result.latestPayment.status) },
                    ]}
                    textStyle={styles.statusText}
                  >
                    {getStatusLabel(result.latestPayment.status)}
                  </Chip>
                )}
              </View>

              <Divider style={styles.divider} />

              {/* Latest Payment */}
              {result.latestPayment ? (
                <View style={styles.paymentInfo}>
                  <Text variant="labelMedium" style={styles.label}>
                    Tháng {result.latestPayment.billingMonth}/{result.latestPayment.billingYear}
                  </Text>

                  <View style={styles.row}>
                    <Text variant="bodyMedium" style={styles.label}>
                      Tổng tiền:
                    </Text>
                    <Text variant="titleMedium" style={[styles.value, { color: theme.colors.primary }]}>
                      {formatCurrency(result.latestPayment.totalAmount)}
                    </Text>
                  </View>

                  {result.latestPayment.paidAmount > 0 && (
                    <View style={styles.row}>
                      <Text variant="bodySmall" style={styles.label}>
                        Đã đóng:
                      </Text>
                      <Text variant="bodySmall" style={[styles.value, styles.paidAmount]}>
                        {formatCurrency(result.latestPayment.paidAmount)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.row}>
                    <Text variant="bodySmall" style={styles.label}>
                      Hạn đóng:
                    </Text>
                    <Text variant="bodySmall" style={styles.value}>
                      {format(new Date(result.latestPayment.dueDate), 'dd/MM/yyyy')}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.noPayment}>
                  <IconButton icon="information" size={24} iconColor="#999" />
                  <Text variant="bodyMedium" style={styles.noPaymentText}>
                    Chưa có thông tin thanh toán
                  </Text>
                </View>
              )}

              {/* View Detail Button */}
              <View style={styles.cardFooter}>
                <Text variant="bodySmall" style={styles.viewDetailText}>
                  Xem chi tiết →
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  summaryTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryText: {
    color: '#666',
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomCode: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roomName: {
    color: '#666',
    marginBottom: 4,
  },
  propertyName: {
    color: '#999',
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    marginBottom: 12,
  },
  paymentInfo: {
    gap: 8,
  },
  label: {
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontWeight: '500',
  },
  paidAmount: {
    color: '#4caf50',
  },
  noPayment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  noPaymentText: {
    color: '#999',
    marginLeft: 8,
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'flex-end',
  },
  viewDetailText: {
    color: '#1976d2',
    fontWeight: '500',
  },
});
