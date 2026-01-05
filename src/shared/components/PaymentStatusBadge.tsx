import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Badge } from './Badge';
import { Typography } from './Typography';
import { useTranslation } from 'react-i18next';

export type PaymentStatus = 'paid' | 'unpaid' | 'overdue' | 'partial' | 'no_payment';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  dueDate?: Date | string;
  size?: 'small' | 'medium' | 'large';
  showDueDate?: boolean;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  dueDate,
  size = 'medium',
  showDueDate = false,
}) => {
  const { t } = useTranslation();

  const getStatusVariant = (): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'unpaid':
        return 'warning';
      case 'overdue':
        return 'error';
      case 'partial':
        return 'info';
      case 'no_payment':
      default:
        return 'default';
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case 'paid':
        return t('payment.status.paid', 'Paid');
      case 'unpaid':
        return t('payment.status.unpaid', 'Unpaid');
      case 'overdue':
        return t('payment.status.overdue', 'Overdue');
      case 'partial':
        return t('payment.status.partial', 'Partial');
      case 'no_payment':
        return t('payment.status.no_payment', 'No Payment');
      default:
        return status;
    }
  };

  const formatDueDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Badge variant={getStatusVariant()} size={size}>
        {getStatusText()}
      </Badge>
      {showDueDate && dueDate && (
        <Typography variant="caption" style={styles.dueDate}>
          {t('payment.dueDate', 'Due')}: {formatDueDate(dueDate)}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 4,
  },
  dueDate: {
    marginTop: 2,
    opacity: 0.7,
  },
});
