import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { PropertyStatistics as PropertyStatsType } from '../types';

interface PropertyStatisticsProps {
  statistics: PropertyStatsType;
  isLoading: boolean;
}

export const PropertyStatistics: React.FC<PropertyStatisticsProps> = ({
  statistics,
  isLoading,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Card style={styles.statCard} mode="elevated">
          <Card.Content>
            <Text variant="bodySmall" style={styles.statLabel}>
              {t('properties.statistics.totalProperties')}
            </Text>
            <Text variant="titleLarge" style={styles.statValue}>
              --
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard} mode="elevated">
          <Card.Content>
            <Text variant="bodySmall" style={styles.statLabel}>
              {t('properties.statistics.totalRooms')}
            </Text>
            <Text variant="titleLarge" style={styles.statValue}>
              --
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.statCard} mode="elevated">
        <Card.Content>
          <Text variant="bodySmall" style={styles.statLabel}>
            {t('properties.statistics.totalProperties')}
          </Text>
          <Text variant="titleLarge" style={styles.statValue}>
            {statistics.totalProperties}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.statCard} mode="elevated">
        <Card.Content>
          <Text variant="bodySmall" style={styles.statLabel}>
            {t('properties.statistics.totalRooms')}
          </Text>
          <Text variant="titleLarge" style={styles.statValue}>
            {statistics.totalRooms}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
  },
  statLabel: {
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontWeight: '700',
    color: '#1976d2',
  },
});
