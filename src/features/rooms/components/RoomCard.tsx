/**
 * RoomCard Component
 * Displays a room card with key information
 * Optimized with React.memo for better performance
 */

import React, { memo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Text, useTheme, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Room } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { StatusBadge } from './StatusBadge';
import { PaymentStatusBadge } from '@/shared/components';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
  onUpdatePaymentStatus?: (roomId: string, status: 'paid' | 'unpaid') => Promise<void>;
}

const RoomCardComponent = ({ room, onPress, onUpdatePaymentStatus }: RoomCardProps) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'vi' | 'en';
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePaymentStatus = async () => {
    if (!onUpdatePaymentStatus || !room.paymentStatus) return;

    const currentStatus = room.paymentStatus.status;
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';

    Alert.alert(
      t('rooms.payment.updateTitle', 'Update Payment Status'),
      t('rooms.payment.updateMessage', `Mark as ${newStatus}?`),
      [
        {
          text: t('common.cancel', 'Cancel'),
          style: 'cancel',
        },
        {
          text: t('common.confirm', 'Confirm'),
          onPress: async () => {
            try {
              setIsUpdating(true);
              await onUpdatePaymentStatus(room.id, newStatus);
            } catch (error) {
              Alert.alert(
                t('common.error', 'Error'),
                t('rooms.payment.updateError', 'Failed to update payment status'),
              );
            } finally {
              setIsUpdating(false);
            }
          },
        },
      ],
    );
  };

  const accessibilityLabel = `${t('rooms.roomCode')}: ${room.roomCode}, ${t('rooms.roomName')}: ${room.roomName}, ${t('rooms.status.label')}: ${t(`rooms.status.${room.status}`)}, ${t('rooms.rentalPrice')}: ${formatCurrency(room.rentalPrice, locale)}${room.currentTenant ? `, ${t('rooms.tenant.label')}: ${room.currentTenant.name}` : ''}`;

  return (
    <Card style={styles.card} mode="elevated">
      <TouchableOpacity
        onPress={() => onPress(room)}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityHint={t('rooms.roomDetails')}
      >
        <Card.Content>
          {/* Header: Room Code and Status */}
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.roomCode}>
              {room.roomCode}
            </Text>
            <StatusBadge status={room.status} />
          </View>

          {/* Room Name */}
          <Text variant="bodyLarge" style={styles.roomName}>
            {room.roomName}
          </Text>

          {/* Tenant Info (if occupied) */}
          {room.status === 'occupied' && room.currentTenant && (
            <View style={styles.tenantInfo}>
              <Text variant="bodySmall" style={styles.tenantLabel}>
                {t('rooms.tenant.label')}:
              </Text>
              <Text variant="bodyMedium" style={styles.tenantName}>
                {room.currentTenant.name}
              </Text>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text variant="titleLarge" style={[styles.price, { color: theme.colors.primary }]}>
              {formatCurrency(room.rentalPrice, locale)}
            </Text>
            <Text variant="bodySmall" style={styles.priceLabel}>
              /{t('common.month', 'month')}
            </Text>
          </View>

          {/* Payment Status (if available) */}
          {room.paymentStatus && room.status === 'occupied' && (
            <View style={styles.paymentStatusContainer}>
              <View style={styles.paymentInfo}>
                <PaymentStatusBadge
                  status={room.paymentStatus.status}
                  dueDate={room.paymentStatus.dueDate ?? undefined}
                  showDueDate={true}
                  size="small"
                />
                {room.paymentStatus.amount !== null && room.paymentStatus.amount > 0 && (
                  <View style={styles.amountContainer}>
                    <Text variant="bodySmall" style={styles.amountLabel}>
                      {t('payment.amount', 'Amount')}:
                    </Text>
                    <Text variant="titleSmall" style={[styles.amount, { color: theme.colors.primary }]}>
                      {formatCurrency(room.paymentStatus.amount, locale)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </Card.Content>
      </TouchableOpacity>

      {/* Payment Action Button - Outside TouchableOpacity to avoid nested buttons */}
      {room.paymentStatus && room.status === 'occupied' && onUpdatePaymentStatus && (
        <View style={styles.actionButtonContainer}>
          <IconButton
            icon={room.paymentStatus.status === 'paid' ? 'close-circle' : 'check-circle'}
            size={20}
            disabled={isUpdating}
            onPress={handleUpdatePaymentStatus}
            style={styles.updateButton}
          />
        </View>
      )}
    </Card>
  );
};

// Memoize component to prevent unnecessary re-renders
export const RoomCard = memo(RoomCardComponent, (prevProps, nextProps) => {
  // Only re-render if room data or onPress function changes
  return (
    prevProps.room.id === nextProps.room.id &&
    prevProps.room.status === nextProps.room.status &&
    prevProps.room.paymentStatus?.status === nextProps.room.paymentStatus?.status &&
    prevProps.room.rentalPrice === nextProps.room.rentalPrice &&
    prevProps.room.currentTenant?.name === nextProps.room.currentTenant?.name
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    minHeight: 44, // Minimum touch target size
    position: 'relative',
    paddingTop: 12,
    paddingBottom: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomCode: {
    fontWeight: 'bold',
  },
  roomName: {
    marginBottom: 8,
  },
  tenantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tenantLabel: {
    opacity: 0.6,
    marginRight: 4,
  },
  tenantName: {
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  price: {
    fontWeight: 'bold',
    textDecorationLine: 'none',
  },
  priceLabel: {
    opacity: 0.6,
    marginLeft: 4,
  },
  paymentStatusContainer: {
    marginTop: 12,
  },
  paymentInfo: {
    flexDirection: 'column',
    gap: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  amountLabel: {
    opacity: 0.6,
  },
  amount: {
    fontWeight: 'bold',
  },
  actionButtonContainer: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  updateButton: {
    margin: 0,
  },
});
