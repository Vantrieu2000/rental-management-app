/**
 * EditUsageModal Component
 * Modal for editing utility usage for an existing payment
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  useTheme,
  Divider,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { paymentApi } from '../services/paymentApi';

interface Payment {
  _id: string;
  billingMonth: number;
  billingYear: number;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  electricityUsage: number;
  waterUsage: number;
  previousElectricityReading: number;
  currentElectricityReading: number;
  previousWaterReading: number;
  currentWaterReading: number;
  adjustments?: number;
  status: string;
}

interface EditUsageModalProps {
  visible: boolean;
  payment: Payment | null;
  onDismiss: () => void;
  onSuccess: () => void;
}

export function EditUsageModal({
  visible,
  payment,
  onDismiss,
  onSuccess,
}: EditUsageModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { accessToken } = useAuth();

  const [previousElectricityReading, setPreviousElectricityReading] = useState('0');
  const [currentElectricityReading, setCurrentElectricityReading] = useState('0');
  const [previousWaterReading, setPreviousWaterReading] = useState('0');
  const [currentWaterReading, setCurrentWaterReading] = useState('0');
  const [adjustments, setAdjustments] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculated values
  const electricityUsage = Math.max(0, parseFloat(currentElectricityReading) - parseFloat(previousElectricityReading)) || 0;
  const waterUsage = Math.max(0, parseFloat(currentWaterReading) - parseFloat(previousWaterReading)) || 0;

  // Load payment data when modal opens
  useEffect(() => {
    if (payment) {
      setPreviousElectricityReading(payment.previousElectricityReading.toString());
      setCurrentElectricityReading(payment.currentElectricityReading.toString());
      setPreviousWaterReading(payment.previousWaterReading.toString());
      setCurrentWaterReading(payment.currentWaterReading.toString());
      setAdjustments(payment.adjustments ? payment.adjustments.toString() : '');
      setNotes('');
    }
  }, [payment]);

  const handleSubmit = async () => {
    if (!payment || !accessToken) return;

    // Validate readings
    const prevElec = parseFloat(previousElectricityReading);
    const currElec = parseFloat(currentElectricityReading);
    const prevWater = parseFloat(previousWaterReading);
    const currWater = parseFloat(currentWaterReading);

    if (isNaN(prevElec) || prevElec < 0) {
      Alert.alert(
        t('common.error', 'Error'),
        'Chỉ số điện cũ không hợp lệ',
      );
      return;
    }

    if (isNaN(currElec) || currElec < 0) {
      Alert.alert(
        t('common.error', 'Error'),
        'Chỉ số điện mới không hợp lệ',
      );
      return;
    }

    if (currElec < prevElec) {
      Alert.alert(
        t('common.error', 'Error'),
        'Chỉ số điện mới phải lớn hơn hoặc bằng chỉ số cũ',
      );
      return;
    }

    if (isNaN(prevWater) || prevWater < 0) {
      Alert.alert(
        t('common.error', 'Error'),
        'Chỉ số nước cũ không hợp lệ',
      );
      return;
    }

    if (isNaN(currWater) || currWater < 0) {
      Alert.alert(
        t('common.error', 'Error'),
        'Chỉ số nước mới không hợp lệ',
      );
      return;
    }

    if (currWater < prevWater) {
      Alert.alert(
        t('common.error', 'Error'),
        'Chỉ số nước mới phải lớn hơn hoặc bằng chỉ số cũ',
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const adjustmentsValue = adjustments ? parseFloat(adjustments) : 0;

      await paymentApi.updatePaymentUsage(accessToken, payment._id, {
        electricityUsage,
        waterUsage,
        previousElectricityReading: prevElec,
        currentElectricityReading: currElec,
        previousWaterReading: prevWater,
        currentWaterReading: currWater,
        adjustments: adjustmentsValue,
        notes: notes || undefined,
      });

      // Invalidate payment history query to refetch updated data
      await queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });

      Alert.alert(
        t('common.success', 'Success'),
        'Cập nhật chỉ số thành công',
      );

      onSuccess();
      onDismiss();
    } catch (error) {
      Alert.alert(
        t('common.error', 'Error'),
        error instanceof Error ? error.message : 'Không thể cập nhật chỉ số',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
      >
        <ScrollView>
          <Text variant="titleLarge" style={styles.title}>
            Chỉnh Sửa Chỉ Số
          </Text>

          {payment && (
            <View style={styles.periodInfo}>
              <Text variant="bodyMedium" style={styles.periodText}>
                Kỳ: {formatDate(payment.billingPeriodStart)} → {formatDate(payment.billingPeriodEnd)}
              </Text>
            </View>
          )}

          <Divider style={styles.divider} />

          {/* Electricity Section */}
          <Text variant="labelLarge" style={styles.sectionTitle}>
            Điện
          </Text>

          <View style={styles.readingRow}>
            <TextInput
              label="Chỉ số cũ"
              value={previousElectricityReading}
              onChangeText={setPreviousElectricityReading}
              keyboardType="numeric"
              mode="outlined"
              style={styles.readingInput}
            />
            <TextInput
              label="Chỉ số mới"
              value={currentElectricityReading}
              onChangeText={setCurrentElectricityReading}
              keyboardType="numeric"
              mode="outlined"
              style={styles.readingInput}
            />
          </View>

          <TextInput
            label="Số điện tiêu thụ (kWh)"
            value={electricityUsage.toString()}
            editable={false}
            mode="outlined"
            style={[styles.input, styles.calculatedInput]}
            right={<TextInput.Icon icon="calculator" />}
          />

          <Divider style={styles.divider} />

          {/* Water Section */}
          <Text variant="labelLarge" style={styles.sectionTitle}>
            Nước
          </Text>

          <View style={styles.readingRow}>
            <TextInput
              label="Chỉ số cũ"
              value={previousWaterReading}
              onChangeText={setPreviousWaterReading}
              keyboardType="numeric"
              mode="outlined"
              style={styles.readingInput}
            />
            <TextInput
              label="Chỉ số mới"
              value={currentWaterReading}
              onChangeText={setCurrentWaterReading}
              keyboardType="numeric"
              mode="outlined"
              style={styles.readingInput}
            />
          </View>

          <TextInput
            label="Số nước tiêu thụ (m³)"
            value={waterUsage.toString()}
            editable={false}
            mode="outlined"
            style={[styles.input, styles.calculatedInput]}
            right={<TextInput.Icon icon="calculator" />}
          />

          <Divider style={styles.divider} />

          {/* Adjustments */}
          <TextInput
            label="Tiền phát sinh (VND)"
            placeholder="Có thể bỏ trống"
            value={adjustments}
            onChangeText={setAdjustments}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />

          {/* Notes */}
          <TextInput
            label="Ghi chú"
            placeholder="Có thể bỏ trống"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={onDismiss}
              disabled={isSubmitting}
              style={styles.button}
            >
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.button}
            >
              Lưu
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: '90%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  periodInfo: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 16,
  },
  periodText: {
    fontWeight: '500',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
    opacity: 0.7,
  },
  input: {
    marginBottom: 12,
  },
  calculatedInput: {
    backgroundColor: '#F0F0F0',
  },
  readingRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  readingInput: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  button: {
    minWidth: 100,
  },
});
