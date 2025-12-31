/**
 * RoomCardSkeleton Component
 * Loading skeleton for room cards
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

export function RoomCardSkeleton() {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        {/* Header skeleton */}
        <View style={styles.header}>
          <View style={[styles.skeleton, styles.roomCode]} />
          <View style={[styles.skeleton, styles.badge]} />
        </View>

        {/* Room name skeleton */}
        <View style={[styles.skeleton, styles.roomName]} />

        {/* Price skeleton */}
        <View style={[styles.skeleton, styles.price]} />

        {/* Chip skeleton */}
        <View style={[styles.skeleton, styles.chip]} />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    minHeight: 44,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skeleton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  roomCode: {
    width: 80,
    height: 20,
  },
  badge: {
    width: 60,
    height: 24,
    borderRadius: 12,
  },
  roomName: {
    width: '70%',
    height: 18,
    marginBottom: 8,
  },
  price: {
    width: 120,
    height: 24,
    marginTop: 8,
  },
  chip: {
    width: 100,
    height: 28,
    marginTop: 8,
    borderRadius: 14,
  },
});
