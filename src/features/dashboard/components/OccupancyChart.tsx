/**
 * OccupancyChart Component
 * Displays occupancy rate trends over time
 * Note: Using placeholder until Victory Native is properly configured
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { OccupancyData } from '../types';

interface OccupancyChartProps {
  data: OccupancyData[];
  title?: string;
}

export function OccupancyChart({ data, title = 'Occupancy Rate' }: OccupancyChartProps) {
  const theme = useTheme();

  // Calculate summary statistics
  const avgOccupancy = data.reduce((sum, item) => sum + item.occupancyRate, 0) / data.length;
  const maxOccupancy = Math.max(...data.map((item) => item.occupancyRate));
  const minOccupancy = Math.min(...data.map((item) => item.occupancyRate));
  const latestOccupancy = data[data.length - 1]?.occupancyRate || 0;

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>
              Current
            </Text>
            <Text variant="titleLarge" style={[styles.statValue, { color: theme.colors.primary }]}>
              {latestOccupancy}%
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>
              Average
            </Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {avgOccupancy.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>
              Peak
            </Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {maxOccupancy}%
            </Text>
          </View>
        </View>
        <Text variant="bodySmall" style={styles.note}>
          Chart visualization coming soon
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    opacity: 0.6,
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  note: {
    textAlign: 'center',
    opacity: 0.5,
    fontStyle: 'italic',
  },
});
