import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface OccupancyIndicatorProps {
  rate: number;
}

export const OccupancyIndicator: React.FC<OccupancyIndicatorProps> = ({ rate }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Determine color based on occupancy rate
  const getColor = (occupancyRate: number): string => {
    if (occupancyRate >= 0.8) return '#4caf50'; // Green
    if (occupancyRate >= 0.5) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const color = getColor(rate);
  const percentage = (rate * 100).toFixed(1);

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title}>
            {t('dashboard.occupancyRate')}
          </Text>
          <Text variant="headlineMedium" style={[styles.percentage, { color }]}>
            {percentage}%
          </Text>
        </View>
        <ProgressBar
          progress={rate}
          color={color}
          style={styles.progressBar}
        />
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f44336' }]} />
            <Text variant="bodySmall" style={styles.legendText}>
              {'< 50%'}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ff9800' }]} />
            <Text variant="bodySmall" style={styles.legendText}>
              50-80%
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4caf50' }]} />
            <Text variant="bodySmall" style={styles.legendText}>
              {'> 80%'}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: '600',
  },
  percentage: {
    fontWeight: 'bold',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    opacity: 0.7,
  },
});
