/**
 * Filter Sheet Component
 * Bottom sheet for filtering rooms
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Chip, TextInput } from 'react-native-paper';
import type { RoomFilters } from '@/features/rooms/types';

interface FilterSheetProps {
  filters: RoomFilters;
  onApplyFilters: (filters: RoomFilters) => void;
  onClose: () => void;
}

export default function FilterSheet({
  filters,
  onApplyFilters,
  onClose,
}: FilterSheetProps) {
  const [localFilters, setLocalFilters] = useState<RoomFilters>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
  };

  const updateFilter = (key: keyof RoomFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge">Filters</Text>
        <Button onPress={handleClear}>Clear All</Button>
      </View>

      <ScrollView style={styles.content}>
        {/* Status Filter */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Room Status
          </Text>
          <View style={styles.chipContainer}>
            <Chip
              selected={localFilters.status === 'vacant'}
              onPress={() =>
                updateFilter(
                  'status',
                  localFilters.status === 'vacant' ? undefined : 'vacant'
                )
              }
              style={styles.chip}
            >
              Vacant
            </Chip>
            <Chip
              selected={localFilters.status === 'occupied'}
              onPress={() =>
                updateFilter(
                  'status',
                  localFilters.status === 'occupied' ? undefined : 'occupied'
                )
              }
              style={styles.chip}
            >
              Occupied
            </Chip>
            <Chip
              selected={localFilters.status === 'maintenance'}
              onPress={() =>
                updateFilter(
                  'status',
                  localFilters.status === 'maintenance' ? undefined : 'maintenance'
                )
              }
              style={styles.chip}
            >
              Maintenance
            </Chip>
          </View>
        </View>

        {/* Payment Status Filter */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Payment Status
          </Text>
          <View style={styles.chipContainer}>
            <Chip
              selected={localFilters.paymentStatus === 'paid'}
              onPress={() =>
                updateFilter(
                  'paymentStatus',
                  localFilters.paymentStatus === 'paid' ? undefined : 'paid'
                )
              }
              style={styles.chip}
            >
              Paid
            </Chip>
            <Chip
              selected={localFilters.paymentStatus === 'unpaid'}
              onPress={() =>
                updateFilter(
                  'paymentStatus',
                  localFilters.paymentStatus === 'unpaid' ? undefined : 'unpaid'
                )
              }
              style={styles.chip}
            >
              Unpaid
            </Chip>
          </View>
        </View>

        {/* Price Range Filter */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Price Range
          </Text>
          <View style={styles.priceInputs}>
            <TextInput
              label="Min Price"
              value={localFilters.minPrice?.toString() || ''}
              onChangeText={(text) => {
                const value = text ? parseInt(text, 10) : undefined;
                updateFilter('minPrice', value);
              }}
              keyboardType="numeric"
              style={styles.priceInput}
              mode="outlined"
            />
            <Text style={styles.priceSeparator}>-</Text>
            <TextInput
              label="Max Price"
              value={localFilters.maxPrice?.toString() || ''}
              onChangeText={(text) => {
                const value = text ? parseInt(text, 10) : undefined;
                updateFilter('maxPrice', value);
              }}
              keyboardType="numeric"
              style={styles.priceInput}
              mode="outlined"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={onClose} style={styles.button}>
          Cancel
        </Button>
        <Button mode="contained" onPress={handleApply} style={styles.button}>
          Apply Filters
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceInput: {
    flex: 1,
  },
  priceSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flex: 1,
  },
});
