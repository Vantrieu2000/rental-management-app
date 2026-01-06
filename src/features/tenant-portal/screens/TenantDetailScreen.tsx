/**
 * Tenant Detail Screen
 * Displays detailed payment information for a specific room
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  Card,
  IconButton,
  useTheme,
  Divider,
  Surface,
  Chip,
} from 'react-native-paper';
import { format } from 'date-fns';
import { TenantPaymentResult } from '../types';
import { BankQRCode } from '@/shared/components/BankQRCode';
import { AdBanner } from '@/shared/components/AdBanner';

interface TenantDetailScreenProps {
  route: {
    params: {
      result: TenantPaymentResult;
    };
  };
  navigation: any;
}

export function TenantDetailScreen({ route, navigation }: TenantDetailScreenProps) {
  const { result } = route.params;
  const theme = useTheme();

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

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
          Chi Tiết Thanh Toán
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Ad Banner */}
      <AdBanner />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Room Info Card */}
        <Surface style={styles.heroCard} elevation={2}>
          <Text variant="displaySmall" style={styles.roomCode}>
            {result.room.roomCode}
          </Text>
          <Text variant="titleLarge" style={styles.roomName}>
            {result.room.roomName}
          </Text>
          <Text variant="bodyMedium" style={styles.propertyInfo}>
            📍 {result.room.propertyName}
          </Text>
          <Text variant="bodySmall" style={styles.propertyAddress}>
            {result.room.propertyAddress}
          </Text>
        </Surface>

        {/* Tenant Info */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <IconButton icon="account" size={24} />
              <Text variant="titleMedium" style={styles.cardTitle}>
                Thông tin người thuê
              </Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                Họ tên:
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                {result.room.tenant.name}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                Số điện thoại:
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                {result.room.tenant.phone}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                Ngày vào ở:
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                {format(new Date(result.room.tenant.moveInDate), 'dd/MM/yyyy')}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                Ngày đóng tiền:
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                Ngày {result.room.tenant.paymentDueDay} hàng tháng
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Latest Payment */}
        {result.latestPayment && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <IconButton icon="cash" size={24} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Thanh toán tháng {result.latestPayment.billingMonth}/{result.latestPayment.billingYear}
                </Text>
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
              </View>
              <Divider style={styles.divider} />

              {/* Fee Breakdown */}
              <View style={styles.feesList}>
                <View style={styles.feeItem}>
                  <Text variant="bodyMedium" style={styles.feeLabel}>
                    Tiền phòng:
                  </Text>
                  <Text variant="bodyMedium" style={styles.feeValue}>
                    {formatCurrency(result.latestPayment.rentalAmount)}
                  </Text>
                </View>

                <View style={styles.feeItem}>
                  <Text variant="bodyMedium" style={styles.feeLabel}>
                    Tiền điện:
                  </Text>
                  <Text variant="bodyMedium" style={styles.feeValue}>
                    {formatCurrency(result.latestPayment.electricityAmount)}
                  </Text>
                </View>

                <View style={styles.feeItem}>
                  <Text variant="bodyMedium" style={styles.feeLabel}>
                    Tiền nước:
                  </Text>
                  <Text variant="bodyMedium" style={styles.feeValue}>
                    {formatCurrency(result.latestPayment.waterAmount)}
                  </Text>
                </View>

                <View style={styles.feeItem}>
                  <Text variant="bodyMedium" style={styles.feeLabel}>
                    Tiền rác:
                  </Text>
                  <Text variant="bodyMedium" style={styles.feeValue}>
                    {formatCurrency(result.latestPayment.garbageAmount)}
                  </Text>
                </View>

                <View style={styles.feeItem}>
                  <Text variant="bodyMedium" style={styles.feeLabel}>
                    Tiền gửi xe:
                  </Text>
                  <Text variant="bodyMedium" style={styles.feeValue}>
                    {formatCurrency(result.latestPayment.parkingAmount)}
                  </Text>
                </View>

                {result.latestPayment.adjustments !== 0 && (
                  <View style={styles.feeItem}>
                    <Text variant="bodyMedium" style={styles.feeLabel}>
                      Điều chỉnh:
                    </Text>
                    <Text
                      variant="bodyMedium"
                      style={[
                        styles.feeValue,
                        { color: result.latestPayment.adjustments > 0 ? '#f44336' : '#4caf50' },
                      ]}
                    >
                      {result.latestPayment.adjustments > 0 ? '+' : ''}
                      {formatCurrency(result.latestPayment.adjustments)}
                    </Text>
                  </View>
                )}

                <Divider style={styles.totalDivider} />

                <View style={styles.totalRow}>
                  <Text variant="titleLarge" style={styles.totalLabel}>
                    Tổng cộng:
                  </Text>
                  <Text
                    variant="headlineSmall"
                    style={[styles.totalValue, { color: theme.colors.primary }]}
                  >
                    {formatCurrency(result.latestPayment.totalAmount)}
                  </Text>
                </View>

                {result.latestPayment.paidAmount > 0 && (
                  <>
                    <View style={styles.feeItem}>
                      <Text variant="bodyMedium" style={styles.feeLabel}>
                        Đã đóng:
                      </Text>
                      <Text variant="bodyMedium" style={[styles.feeValue, styles.paidAmount]}>
                        {formatCurrency(result.latestPayment.paidAmount)}
                      </Text>
                    </View>

                    {result.latestPayment.status === 'partial' && (
                      <View style={styles.feeItem}>
                        <Text variant="bodyMedium" style={styles.feeLabel}>
                          Còn lại:
                        </Text>
                        <Text variant="bodyMedium" style={[styles.feeValue, styles.remaining]}>
                          {formatCurrency(
                            result.latestPayment.totalAmount - result.latestPayment.paidAmount
                          )}
                        </Text>
                      </View>
                    )}
                  </>
                )}

                <View style={styles.dueDateRow}>
                  <IconButton icon="calendar-clock" size={20} />
                  <Text variant="bodyMedium" style={styles.dueDateText}>
                    Hạn đóng: {format(new Date(result.latestPayment.dueDate), 'dd/MM/yyyy')}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* QR Code for Payment */}
        {result.latestPayment && result.latestPayment.status !== 'paid' && (
          <BankQRCode
            amount={result.latestPayment.totalAmount - result.latestPayment.paidAmount}
            description={`${result.room.roomCode} T${result.latestPayment.billingMonth}/${result.latestPayment.billingYear}`}
            style={styles.card}
          />
        )}

        {/* Payment History */}
        {result.paymentHistory.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <IconButton icon="history" size={24} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Lịch sử thanh toán
                </Text>
              </View>
              <Divider style={styles.divider} />

              {result.paymentHistory.map((payment, index) => (
                <View key={payment.id} style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <Text variant="bodyMedium" style={styles.historyMonth}>
                      Tháng {payment.billingMonth}/{payment.billingYear}
                    </Text>
                    <Text variant="bodySmall" style={styles.historyDate}>
                      Hạn: {format(new Date(payment.dueDate), 'dd/MM/yyyy')}
                    </Text>
                  </View>
                  <View style={styles.historyRight}>
                    <Text variant="bodyMedium" style={styles.historyAmount}>
                      {formatCurrency(payment.totalAmount)}
                    </Text>
                    <Chip
                      mode="flat"
                      compact
                      style={[
                        styles.historyStatusChip,
                        { backgroundColor: getStatusColor(payment.status) },
                      ]}
                      textStyle={styles.historyStatusText}
                    >
                      {getStatusLabel(payment.status)}
                    </Chip>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
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
    marginTop : 24,
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
  heroCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  roomCode: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roomName: {
    opacity: 0.8,
    marginBottom: 8,
  },
  propertyInfo: {
    color: '#666',
    marginBottom: 4,
  },
  propertyAddress: {
    color: '#999',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: '600',
    flex: 1,
  },
  statusChip: {
    height: 32,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  divider: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: '500',
  },
  feesList: {
    gap: 8,
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  feeLabel: {
    color: '#666',
  },
  feeValue: {
    fontWeight: '500',
  },
  totalDivider: {
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalValue: {
    fontWeight: 'bold',
  },
  paidAmount: {
    color: '#4caf50',
  },
  remaining: {
    color: '#f57c00',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dueDateText: {
    color: '#666',
    marginLeft: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyLeft: {
    flex: 1,
  },
  historyMonth: {
    fontWeight: '500',
    marginBottom: 4,
  },
  historyDate: {
    color: '#999',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontWeight: '500',
    marginBottom: 4,
  },
  historyStatusChip: {
    height: 32,
  },
  historyStatusText: {
    color: '#fff',
    fontSize: 10,
    lineHeight: 18,
    fontWeight: '600',
  },
});
