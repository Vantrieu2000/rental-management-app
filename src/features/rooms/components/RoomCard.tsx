/**
 * RoomCard Component
 * Displays a room card with key information
 * Optimized with React.memo for better performance
 */

import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Room } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { StatusBadge } from './StatusBadge';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
}

const RoomCardComponent = ({ room, onPress }: RoomCardProps) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'vi' | 'en';

  const accessibilityLabel = `${t('rooms.roomCode')}: ${room.roomCode}, ${t('rooms.roomName')}: ${room.roomName}, ${t('rooms.status.label')}: ${t(`rooms.status.${room.status}`)}, ${t('rooms.rentalPrice')}: ${formatCurrency(room.rentalPrice, locale)}${room.currentTenant ? `, ${t('rooms.tenant.label')}: ${room.currentTenant.name}` : ''}`;

  return (
    <TouchableOpacity
      onPress={() => onPress(room)}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={t('rooms.roomDetails')}
    >
      <Card style={styles.card} mode="elevated">
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
          {room.paymentStatus && (
            <View style={styles.paymentStatus}>
              <Chip
                mode="flat"
                textStyle={styles.chipText}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      room.paymentStatus === 'paid'
                        ? '#E8F5E9'
                        : room.paymentStatus === 'overdue'
                          ? '#FFEBEE'
                          : '#FFF3E0',
                  },
                ]}
              >
                {t(`rooms.paymentStatus.${room.paymentStatus}`)}
              </Chip>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

// Memoize component to prevent unnecessary re-renders
export const RoomCard = memo(RoomCardComponent, (prevProps, nextProps) => {
  // Only re-render if room data or onPress function changes
  return (
    prevProps.room.id === nextProps.room.id &&
    prevProps.room.status === nextProps.room.status &&
    prevProps.room.paymentStatus === nextProps.room.paymentStatus &&
    prevProps.room.rentalPrice === nextProps.room.rentalPrice &&
    prevProps.room.currentTenant?.name === nextProps.room.currentTenant?.name
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    minHeight: 44, // Minimum touch target size
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
  },
  priceLabel: {
    opacity: 0.6,
    marginLeft: 4,
  },
  paymentStatus: {
    marginTop: 8,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 12,
  },
});
