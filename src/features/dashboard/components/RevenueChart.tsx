/**
 * RevenueChart Component
 * Displays revenue trends over time
 * Note: Using placeholder until Victory Native is properly configured
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { RevenueData } from '../types';

interface RevenueChartProps {
  data: RevenueData[];
  title?: string;
}

export function RevenueChart({ data, title = 'Revenue Trends' }: RevenueChartProps) {
  const theme = useTheme();

  // Calculate summary statistics
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = totalRevenue / data.length;
  const maxRevenue = Math.max(...data.map((item) => item.revenue));
  const minRevenue = Math.min(...data.map((item) => item.revenue));

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>
              Average
            </Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {(avgRevenue / 1000000).toFixed(1)}M VND
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>
              Highest
            </Text>
            <Text variant="titleMedium" style={[styles.statValue, { color: theme.colors.primary }]}>
              {(maxRevenue / 1000000).toFixed(1)}M VND
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>
              Lowest
            </Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {(minRevenue / 1000000).toFixed(1)}M VND
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
