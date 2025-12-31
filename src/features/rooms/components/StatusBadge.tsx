/**
 * StatusBadge Component
 * Displays a colored badge for room status
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { RoomStatus } from '../types';

interface StatusBadgeProps {
  status: RoomStatus;
}

const statusColors: Record<RoomStatus, { background: string; text: string }> = {
  vacant: {
    background: '#FFF3E0', // Amber/Orange light
    text: '#F57C00', // Amber/Orange dark
  },
  occupied: {
    background: '#E8F5E9', // Green light
    text: '#2E7D32', // Green dark
  },
  maintenance: {
    background: '#FFEBEE', // Red light
    text: '#C62828', // Red dark
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();
  const colors = statusColors[status];

  return (
    <Chip
      mode="flat"
      textStyle={[styles.text, { color: colors.text }]}
      style={[styles.badge, { backgroundColor: colors.background }]}
      compact
    >
      {t(`rooms.status.${status}`)}
    </Chip>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 28,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
