/**
 * PaymentHistory Component
 * Displays payment history with usage details for a room
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  Text,
  Card,
  Divider,
  ActivityIndicator,
  useTheme,
  Chip,
  IconButton,
  Button,
  Portal,
  Dialog,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { usePaymentHistory } from '../hooks/usePaymentHistory';
import { paymentApi } from '../services/paymentApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface Payment {
  _id: string;
  billingMonth: number;
  billingYear: number;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  electricityUsage: number;
  waterUsage: number;
  previousElectricityReading: number;
  currentElectricityReading: number;
  previousWaterReading: number;
  currentWaterReading: number;
  electricityAmount: number;
  waterAmount: number;
  rentalAmount: number;
  garbageAmount: number;
  parkingAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: string;
  paidDate?: string;
  dueDate: string;
}

interface PaymentHistoryProps {
  roomId: string;
  onEditUsage?: (payment: Payment) => void;
}

export function PaymentHistory({ roomId, onEditUsage }: PaymentHistoryProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading, isError } = usePaymentHistory(roomId, 12);
  const [markingAsPaid, setMarkingAsPaid] = useState<string | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [resultDialogVisible, setResultDialogVisible] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [resultIsError, setResultIsError] = useState(false);

  const handleMarkAsPaid = (payment: Payment) => {
    if (!accessToken) {
      return;
    }
    setSelectedPayment(payment);
    setConfirmDialogVisible(true);
  };

  const confirmMarkAsPaid = async () => {
    if (!selectedPayment || !accessToken) return;

    setConfirmDialogVisible(false);
    
    try {
      setMarkingAsPaid(selectedPayment._id);
      await paymentApi.markAsPaid(accessToken, selectedPayment._id, selectedPayment.totalAmount, 'cash');
      
      await queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
      
      setResultMessage(t('payments.result.successMessage'));
      setResultIsError(false);
      setResultDialogVisible(true);
    } catch (error) {
      console.error('[PaymentHistory] Error marking as paid:', error);
      setResultMessage(error instanceof Error ? error.message : t('payments.result.errorMessage'));
      setResultIsError(true);
      setResultDialogVisible(true);
    } finally {
      setMarkingAsPaid(null);
      setSelectedPayment(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#4CAF50';
      case 'unpaid':
        return '#FF9800';
      case 'partial':
        return '#2196F3';
      case 'overdue':
        return '#F44336';
      default:
        return theme.colors.outline;
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`payments.status.${status}`, status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const canEdit = (payment: Payment) => {
    return payment.status !== 'paid' && onEditUsage;
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => {
    return (
    <Card key={item._id} style={styles.paymentCard}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.periodContainer}>
            <Text variant="titleMedium" style={styles.period}>
              {formatDate(item.billingPeriodStart)} → {formatDate(item.billingPeriodEnd)}
            </Text>
            <Text variant="bodySmall" style={styles.periodSubtext}>
              {t('payments.history.period', 'Period')}: {item.billingMonth}/{item.billingYear}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Chip
              mode="flat"
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
              textStyle={{ color: getStatusColor(item.status), fontWeight: '600' }}
            >
              {getStatusLabel(item.status)}
            </Chip>
            {canEdit(item) && (
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => onEditUsage!(item)}
                style={styles.editButton}
              />
            )}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Usage Details */}
        <View style={styles.usageSection}>
          <Text variant="labelLarge" style={styles.sectionTitle}>
            {t('payments.history.usage', 'Usage')}
          </Text>

          <View style={styles.row}>
            <Text variant="bodyMedium">{t('payments.usage.electricity', 'Electricity')}:</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {item.electricityUsage} kWh × {(item.electricityAmount / (item.electricityUsage || 1)).toLocaleString('vi-VN')} = {item.electricityAmount.toLocaleString('vi-VN')} VND
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="bodyMedium">{t('payments.usage.water', 'Water')}:</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {item.waterUsage} m³ × {(item.waterAmount / (item.waterUsage || 1)).toLocaleString('vi-VN')} = {item.waterAmount.toLocaleString('vi-VN')} VND
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Amount Breakdown */}
        <View style={styles.amountSection}>
          <Text variant="labelLarge" style={styles.sectionTitle}>
            {t('payments.history.breakdown', 'Breakdown')}
          </Text>

          <View style={styles.row}>
            <Text variant="bodyMedium">{t('rooms.rentalPrice', 'Rental')}:</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {item.rentalAmount.toLocaleString('vi-VN')} VND
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="bodyMedium">{t('rooms.garbageFee', 'Garbage')}:</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {item.garbageAmount.toLocaleString('vi-VN')} VND
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="bodyMedium">{t('rooms.parkingFee', 'Parking')}:</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {item.parkingAmount.toLocaleString('vi-VN')} VND
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Total */}
        <View style={styles.totalRow}>
          <Text variant="titleMedium" style={styles.totalLabel}>
            {t('payments.history.total', 'Total')}:
          </Text>
          <Text variant="titleLarge" style={[styles.totalValue, { color: theme.colors.primary }]}>
            {item.totalAmount.toLocaleString('vi-VN')} VND
          </Text>
        </View>

        {/* Paid Info */}
        {item.status === 'paid' && item.paidDate && (
          <View style={styles.paidInfo}>
            <Text variant="bodySmall" style={styles.paidText}>
              {t('payments.history.paidOn', 'Paid on')}: {new Date(item.paidDate).toLocaleDateString('vi-VN')}
            </Text>
          </View>
        )}

        {item.status === 'partial' && (
          <View style={styles.paidInfo}>
            <Text variant="bodySmall" style={styles.paidText}>
              {t('payments.history.paidAmount', 'Paid')}: {item.paidAmount.toLocaleString('vi-VN')} VND
            </Text>
          </View>
        )}

        {/* Mark as Paid Button */}
        {item.status !== 'paid' && (
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              icon="check-circle"
              onPress={() => handleMarkAsPaid(item)}
              loading={markingAsPaid === item._id}
              disabled={markingAsPaid === item._id}
              style={styles.markPaidButton}
            >
              {t('payments.markAsPaid')}
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  )};


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          {t('common.loading', 'Loading...')}
        </Text>
      </View>
    );
  }

  if (payments.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Card.Content>
          <Text variant="bodyLarge" style={styles.emptyText}>
            {t('payments.history.empty', 'No payment history available')}
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {t('payments.history.title', 'Payment History')}
      </Text>
      
      {/* Render payments directly without FlatList */}
      <View style={styles.listContent}>
        {payments.map((item) => renderPaymentItem({ item }))}
      </View>

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={confirmDialogVisible} onDismiss={() => setConfirmDialogVisible(false)}>
          <Dialog.Title>{t('payments.confirmPayment.title')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {selectedPayment && 
                t('payments.confirmPayment.message', {
                  period: `${formatDate(selectedPayment.billingPeriodStart)} → ${formatDate(selectedPayment.billingPeriodEnd)}`
                })
              }
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDialogVisible(false)}>{t('payments.confirmPayment.cancel')}</Button>
            <Button onPress={confirmMarkAsPaid}>{t('payments.confirmPayment.confirm')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Result Dialog */}
      <Portal>
        <Dialog visible={resultDialogVisible} onDismiss={() => setResultDialogVisible(false)}>
          <Dialog.Title>{resultIsError ? t('payments.result.error') : t('payments.result.success')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{resultMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setResultDialogVisible(false)}>{t('payments.result.close')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  paymentCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  periodContainer: {
    flex: 1,
  },
  period: {
    fontWeight: '600',
  },
  periodSubtext: {
    opacity: 0.6,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusChip: {
    height: 32,
  },
  editButton: {
    margin: 0,
  },
  divider: {
    marginVertical: 12,
  },
  usageSection: {
    marginBottom: 8,
  },
  amountSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  value: {
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
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
  paidInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  paidText: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
  actionButtons: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  markPaidButton: {
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
  },
  emptyCard: {
    margin: 16,
    borderRadius: 12,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    paddingVertical: 32,
  },
});
