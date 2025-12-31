/**
 * FilterModal Component
 * Modal for filtering rooms by status and payment status
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, Chip, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { RoomFilters, RoomStatus, PaymentStatus } from '../types';

interface FilterModalProps {
  visible: boolean;
  currentFilters: RoomFilters;
  onClose: () => void;
  onApply: (filters: RoomFilters) => void;
}

const ROOM_STATUSES: RoomStatus[] = ['vacant', 'occupied', 'maintenance'];
const PAYMENT_STATUSES: PaymentStatus[] = ['paid', 'unpaid', 'overdue'];

export function FilterModal({ visible, currentFilters, onClose, onApply }: FilterModalProps) {
  const { t } = useTranslation();
  const [selectedStatuses, setSelectedStatuses] = useState<RoomStatus[]>(
    currentFilters.status || []
  );
  const [selectedPaymentStatuses, setSelectedPaymentStatuses] = useState<PaymentStatus[]>(
    currentFilters.paymentStatus || []
  );
  const [minPrice, setMinPrice] = useState<string>(
    currentFilters.minPrice?.toString() || ''
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    currentFilters.maxPrice?.toString() || ''
  );

  const toggleStatus = (status: RoomStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const togglePaymentStatus = (status: PaymentStatus) => {
    setSelectedPaymentStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleApply = () => {
    const filters: RoomFilters = {
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      paymentStatus: selectedPaymentStatuses.length > 0 ? selectedPaymentStatuses : undefined,
    };
    
    // Add price filters if provided
    const minPriceNum = minPrice ? parseFloat(minPrice) : undefined;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : undefined;
    
    if (minPriceNum && minPriceNum > 0) {
      filters.minPrice = minPriceNum;
    }
    
    if (maxPriceNum && maxPriceNum > 0) {
      filters.maxPrice = maxPriceNum;
    }
    
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setSelectedStatuses([]);
    setSelectedPaymentStatuses([]);
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
        <ScrollView>
          <Text variant="titleLarge" style={styles.title}>
            {t('common.filter')}
          </Text>

          {/* Room Status Filter */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('rooms.status.label')}
            </Text>
            <View style={styles.chipContainer}>
              {ROOM_STATUSES.map((status) => (
                <Chip
                  key={status}
                  selected={selectedStatuses.includes(status)}
                  onPress={() => toggleStatus(status)}
                  style={styles.chip}
                  mode="outlined"
                >
                  {t(`rooms.status.${status}`)}
                </Chip>
              ))}
            </View>
          </View>

          {/* Payment Status Filter */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('rooms.paymentStatus.label')}
            </Text>
            <View style={styles.chipContainer}>
              {PAYMENT_STATUSES.map((status) => (
                <Chip
                  key={status}
                  selected={selectedPaymentStatuses.includes(status)}
                  onPress={() => togglePaymentStatus(status)}
                  style={styles.chip}
                  mode="outlined"
                >
                  {t(`rooms.paymentStatus.${status}`)}
                </Chip>
              ))}
            </View>
          </View>

          {/* Price Range Filter */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('rooms.priceRange')}
            </Text>
            <View style={styles.priceInputs}>
              <TextInput
                label={t('rooms.form.minPrice', 'Giá tối thiểu')}
                value={minPrice}
                onChangeText={setMinPrice}
                keyboardType="numeric"
                mode="outlined"
                style={styles.priceInput}
                right={<TextInput.Affix text="₫" />}
              />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInput
                label={t('rooms.form.maxPrice', 'Giá tối đa')}
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="numeric"
                mode="outlined"
                style={styles.priceInput}
                right={<TextInput.Affix text="₫" />}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button mode="outlined" onPress={handleClear} style={styles.button}>
              {t('common.clear', 'Clear')}
            </Button>
            <Button mode="contained" onPress={handleApply} style={styles.button}>
              {t('common.apply', 'Apply')}
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    marginBottom: 20,
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
    marginHorizontal: 8,
    fontSize: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});
