/**
 * Record Payment Screen
 * Screen for recording a new payment
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, Button, TextInput, SegmentedButtons, Card } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import type { PaymentsStackScreenProps } from '@/shared/types/navigation';
import { markPaidSchema, type MarkPaidFormData } from '../validation/paymentSchemas';
import { useMarkPaymentAsPaid } from '../hooks/usePayments';
import { PaymentRecord } from '../types';

type Props = PaymentsStackScreenProps<'RecordPayment'>;

export default function RecordPaymentScreen({ navigation, route }: Props) {
  const { payment } = route.params;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const markAsPaid = useMarkPaymentAsPaid();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MarkPaidFormData>({
    resolver: zodResolver(markPaidSchema),
    defaultValues: {
      paidAmount: payment.totalAmount - payment.paidAmount,
      paidDate: new Date(),
      paymentMethod: 'cash',
      notes: '',
    },
  });

  const paidAmount = watch('paidAmount');
  const remainingBalance = payment.totalAmount - payment.paidAmount - (paidAmount || 0);

  const onSubmit = async (data: MarkPaidFormData) => {
    try {
      await markAsPaid.mutateAsync({
        id: payment.id,
        data,
      });

      Alert.alert('Success', 'Payment recorded successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to record payment');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Payment Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.summaryTitle}>
              Payment Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">Total Amount:</Text>
              <Text variant="bodyMedium" style={styles.amount}>
                {payment.totalAmount.toLocaleString('vi-VN')} ₫
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">Already Paid:</Text>
              <Text variant="bodyMedium" style={styles.amount}>
                {payment.paidAmount.toLocaleString('vi-VN')} ₫
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.divider]}>
              <Text variant="bodyMedium" style={styles.bold}>
                Remaining:
              </Text>
              <Text variant="bodyMedium" style={[styles.amount, styles.bold]}>
                {(payment.totalAmount - payment.paidAmount).toLocaleString('vi-VN')} ₫
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Payment Form */}
        <View style={styles.form}>
          {/* Amount */}
          <View style={styles.field}>
            <Text variant="labelLarge" style={styles.label}>
              Payment Amount *
            </Text>
            <Controller
              control={control}
              name="paidAmount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  value={value?.toString() || ''}
                  onChangeText={(text) => {
                    const numValue = parseFloat(text);
                    onChange(isNaN(numValue) ? 0 : numValue);
                  }}
                  onBlur={onBlur}
                  error={!!errors.paidAmount}
                  right={<TextInput.Affix text="₫" />}
                />
              )}
            />
            {errors.paidAmount && (
              <Text variant="bodySmall" style={styles.error}>
                {errors.paidAmount.message}
              </Text>
            )}
            {remainingBalance < 0 && (
              <Text variant="bodySmall" style={styles.warning}>
                Amount exceeds remaining balance
              </Text>
            )}
            {remainingBalance > 0 && paidAmount > 0 && (
              <Text variant="bodySmall" style={styles.info}>
                Remaining after payment: {remainingBalance.toLocaleString('vi-VN')} ₫
              </Text>
            )}
          </View>

          {/* Payment Date */}
          <View style={styles.field}>
            <Text variant="labelLarge" style={styles.label}>
              Payment Date *
            </Text>
            <Controller
              control={control}
              name="paidDate"
              render={({ field: { value } }) => (
                <>
                  <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker(true)}
                    icon="calendar"
                    style={styles.dateButton}
                    contentStyle={styles.dateButtonContent}
                  >
                    {format(value, 'dd/MM/yyyy')}
                  </Button>
                  {showDatePicker && (
                    <DateTimePicker
                      value={value}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setValue('paidDate', selectedDate);
                        }
                      }}
                    />
                  )}
                </>
              )}
            />
            {errors.paidDate && (
              <Text variant="bodySmall" style={styles.error}>
                {errors.paidDate.message}
              </Text>
            )}
          </View>

          {/* Payment Method */}
          <View style={styles.field}>
            <Text variant="labelLarge" style={styles.label}>
              Payment Method *
            </Text>
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field: { onChange, value } }) => (
                <SegmentedButtons
                  value={value}
                  onValueChange={onChange}
                  buttons={[
                    { value: 'cash', label: 'Cash' },
                    { value: 'bank_transfer', label: 'Bank' },
                    { value: 'e_wallet', label: 'E-Wallet' },
                  ]}
                />
              )}
            />
            {errors.paymentMethod && (
              <Text variant="bodySmall" style={styles.error}>
                {errors.paymentMethod.message}
              </Text>
            )}
          </View>

          {/* Notes */}
          <View style={styles.field}>
            <Text variant="labelLarge" style={styles.label}>
              Notes (Optional)
            </Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Add any notes about this payment"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={3}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting || markAsPaid.isPending}
          disabled={isSubmitting || markAsPaid.isPending || remainingBalance < 0}
          style={styles.submitButton}
        >
          Record Payment
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
    paddingTop: 12,
  },
  amount: {
    fontWeight: '500',
  },
  bold: {
    fontWeight: '700',
  },
  form: {
    gap: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  error: {
    color: '#d32f2f',
    marginTop: 4,
  },
  warning: {
    color: '#f57c00',
    marginTop: 4,
  },
  info: {
    color: '#1976d2',
    marginTop: 4,
  },
  dateButton: {
    justifyContent: 'flex-start',
  },
  dateButtonContent: {
    justifyContent: 'flex-start',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    paddingVertical: 6,
  },
});
