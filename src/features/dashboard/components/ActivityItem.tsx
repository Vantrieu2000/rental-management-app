/**
 * ActivityItem Component
 * Displays a single activity item in the recent activity feed
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { RecentActivity } from '../types';

interface ActivityItemProps {
  activity: RecentActivity;
}

const activityIcons: Record<RecentActivity['type'], keyof typeof MaterialCommunityIcons.glyphMap> =
  {
    payment: 'cash-check',
    tenant_move_in: 'account-arrow-right',
    tenant_move_out: 'account-arrow-left',
    maintenance: 'tools',
    room_created: 'home-plus',
  };

const activityColors: Record<RecentActivity['type'], string> = {
  payment: '#4CAF50',
  tenant_move_in: '#2196F3',
  tenant_move_out: '#FF9800',
  maintenance: '#F44336',
  room_created: '#9C27B0',
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const theme = useTheme();
  const icon = activityIcons[activity.type];
  const color = activityColors[activity.type];

  return (
    <List.Item
      title={activity.title}
      description={activity.description}
      left={(props) => (
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <MaterialCommunityIcons name={icon} size={24} color={color} />
        </View>
      )}
      right={() => (
        <Text variant="bodySmall" style={styles.timestamp}>
          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
        </Text>
      )}
      style={styles.item}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  timestamp: {
    opacity: 0.6,
    marginTop: 4,
  },
});
