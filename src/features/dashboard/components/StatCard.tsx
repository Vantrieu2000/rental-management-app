import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatCardProps } from '../types/dashboard.types';

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color,
  format = 'number',
}) => {
  const theme = useTheme();
  const cardColor = color || theme.colors.primary;

  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'currency':
        // Format as Vietnamese Dong
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);

      case 'percentage':
        // Format as percentage
        return `${(val * 100).toFixed(1)}%`;

      case 'number':
      default:
        // Format with thousands separator
        return new Intl.NumberFormat('vi-VN').format(val);
    }
  };

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: `${cardColor}20` }]}>
            <MaterialCommunityIcons
              name={icon as any}
              size={32}
              color={cardColor}
            />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text variant="bodyMedium" style={styles.label}>
            {label}
          </Text>
          <Text variant="headlineSmall" style={[styles.value, { color: cardColor }]}>
            {formatValue(value)}
          </Text>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    opacity: 0.7,
    marginBottom: 4,
  },
  value: {
    fontWeight: 'bold',
  },
});
