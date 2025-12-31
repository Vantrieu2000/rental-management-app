/**
 * StatCard Component
 * Displays a single statistic with icon and label
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
  subtitle?: string;
}

export function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  const theme = useTheme();
  const iconColor = color || theme.colors.primary;

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon} size={32} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text variant="titleLarge" style={styles.value}>
            {value}
          </Text>
          <Text variant="bodyMedium" style={styles.title}>
            {title}
          </Text>
          {subtitle && (
            <Text variant="bodySmall" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  value: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    opacity: 0.7,
  },
  subtitle: {
    opacity: 0.5,
    marginTop: 2,
  },
});
