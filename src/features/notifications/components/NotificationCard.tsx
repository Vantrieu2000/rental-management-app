/**
 * NotificationCard Component
 * Displays a single notification for unpaid/overdue payment
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Notification } from '../types';
import { format } from 'date-fns';

interface NotificationCardProps {
  notification: Notification;
  onPress?: () => void;
}

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const { roomCode, roomName, tenantName, remainingAmount, dueDate, daysOverdue, status } =
    notification;

  // Determine status color and label
  const getStatusInfo = () => {
    if (daysOverdue > 0) {
      return {
        color: '#D32F2F',
        backgroundColor: '#FFEBEE',
        label: `${daysOverdue} days overdue`,
      };
    } else if (status === 'partial') {
      return {
        color: '#F57C00',
        backgroundColor: '#FFF3E0',
        label: 'Partial payment',
      };
    } else {
      return {
        color: '#FFA000',
        backgroundColor: '#FFF8E1',
        label: 'Unpaid',
      };
    }
  };

  const statusInfo = getStatusInfo();

  // Format currency (VND)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: statusInfo.color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.roomInfo}>
          <Text style={styles.roomCode}>{roomCode}</Text>
          <Text style={styles.roomName}>{roomName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>

      {/* Tenant */}
      <View style={styles.row}>
        <Text style={styles.label}>Tenant:</Text>
        <Text style={styles.value}>{tenantName}</Text>
      </View>

      {/* Amount */}
      <View style={styles.row}>
        <Text style={styles.label}>Amount due:</Text>
        <Text style={[styles.value, styles.amount]}>{formatCurrency(remainingAmount)}</Text>
      </View>

      {/* Due date */}
      <View style={styles.row}>
        <Text style={styles.label}>Due date:</Text>
        <Text style={styles.value}>{format(dueDate, 'MMM dd, yyyy')}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomCode: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 2,
  },
  roomName: {
    fontSize: 14,
    color: '#757575',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#757575',
  },
  value: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D32F2F',
  },
});
