/**
 * UsageInputForm Component
 * Allows landlords to input electricity and water usage for a room
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Divider,
  useTheme,
  HelperText,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { getPaymentApi } from '../services/paymentApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface Payment {
  _id: string;
  electricityUsage: number;
  waterUsage: number;
  previousElectricityReading?: number;
  currentElectricityReading?: number;
  previousWaterReading?: number;
  currentWaterReading?: number;
  adjustments?: number;
  notes?: string;
}

interface UsageInputFormProps {
  roomId: string;
  currentPayment?: Payment;
  onSuccess: () => void;
}

interface CalculatedAmounts {
  rentalAmount: number;
  electricityAmount: number;
  waterAmount: number;
  garbageAmount: number;
  parkingAmount: number;
  adjustments: number;
  totalAmount: number;
}

export function UsageInputForm({
  roomId,
  currentPayment,
  onSuccess,
}: UsageInputFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { accessToken } = useAuth();

  const [electricityUsage, setElectricityUsage] = useState(
    currentPayment?.electricityUsage?.toString() || '0',
  );
  const [waterUsage, setWaterUsage] = useState(
    currentPayment?.waterUsage?.toString() || '0',
  );
  const [previousElectricityReading, setPreviousElectricityReading] = useState(
    currentPayment?.previousElectricityReading?.toString() || '0',
  );
  const [currentElectricityReading, setCurrentElectricityReading] = useState(
    currentPayment?.currentElectricityReading?.toString() || '0',
  );
  const [previousWaterReading, setPreviousWaterReading] = useState(
    currentPayment?.previousWaterReading?.toString() || '0',
  );
  const [currentWaterReading, setCurrentWaterReading] = useState(
    currentPayment?.currentWaterReading?.toString() || '0',
  );
  const [adjustments, setAdjustments] = useState(
    currentPayment?.adjustments?.toString() || '0',
  );
  const [notes, setNotes] = useState(currentPayment?.notes || '');

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [calculatedAmounts, setCalculatedAmounts] = useState<CalculatedAmounts | null>(null);

  // Default unit prices (will be replaced with actual room prices)
  const electricityUnitPrice = 3000; // VND per kWh
  const waterUnitPrice = 20000; // VND per m³

  // Calculate amounts in real-time
  useEffect(() => {
    const elecUsage = parseFloat(electricityUsage) || 0;
    const waterUse = parseFloat(waterUsage) || 0;
    const adj = parseFloat(adjustments) || 0;

    // TODO: Get actual room prices from API
    const rentalAmount = 0; // Will be fetched from room data
    const garbageAmount = 0;
    const parkingAmount = 0;

    const electricityAmount = elecUsage * electricityUnitPrice;
    const waterAmount = waterUse * waterUnitPrice;
    const totalAmount = rentalAmount + electricityAmount + waterAmount + garbageAmount + parkingAmount + adj;

    setCalculatedAmounts({
      rentalAmount,
      electricityAmount,
      waterAmount,
      garbageAmount,
      parkingAmount,
      adjustments: adj,
      totalAmount,
    });
  }, [electricityUsage, waterUsage, adjustments]);

  // Calculate usage from meter readings
  useEffect(() => {
    const prevElec = parseFloat(previousElectricityReading) || 0;
    const currElec = parseFloat(currentElectricityReading) || 0;
    if (currElec > prevElec) {
      setElectricityUsage((currElec - prevElec).toString());
    }
  }, [previousElectricityReading, currentElectricityReading]);

  useEffect(() => {
    const prevWater = parseFloat(previousWaterReading) || 0;
    const currWater = parseFloat(currentWaterReading) || 0;
    if (currWater > prevWater) {
      setWaterUsage((currWater - prevWater).toString());
    }
  }, [previousWaterReading, currentWaterReading]);

  const validateInputs = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const elecUsage = parseFloat(electricityUsage);
    const waterUse = parseFloat(waterUsage);

    if (isNaN(elecUsage) || elecUsage < 0) {
      newErrors.electricityUsage = t(
        'payments.usage.errors.electricityNegative',
        'Electricity usage must be non-negative',
      );
    }

    if (isNaN(waterUse) || waterUse < 0) {
      newErrors.waterUsage = t(
        'payments.usage.errors.waterNegative',
        'Water usage must be non-negative',
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    if (!accessToken) {
      Alert.alert(
        t('common.error', 'Error'),
        t('auth.notAuthenticated', 'Not authenticated'),
      );
      return;
    }

    setIsLoading(true);

    try {
      const paymentApi = getPaymentApi();
      await paymentApi.recordUsage(accessToken, roomId, {
        electricityUsage: parseFloat(electricityUsage),
        waterUsage: parseFloat(waterUsage),
        previousElectricityReading: parseFloat(previousElectricityReading) || undefined,
        currentElectricityReading: parseFloat(currentElectricityReading) || undefined,
        previousWaterReading: parseFloat(previousWaterReading) || undefined,
        currentWaterReading: parseFloat(currentWaterReading) || undefined,
        adjustments: parseFloat(adjustments) || undefined,
        notes: notes || undefined,
      });

      Alert.alert(
        t('common.success', 'Success'),
        t('payments.usage.recordSuccess', 'Usage recorded successfully'),
      );

      onSuccess();
    } catch (error) {
      console.error('Failed to record usage:', error);
      Alert.alert(
        t('common.error', 'Error'),
        error instanceof Error ? error.message : t('payments.usage.recordError', 'Failed to record usage'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          {t('payments.usage.title', 'Record Utility Usage')}
        </Text>
        <Divider style={styles.divider} />

        <ScrollView>
          {/* Electricity Section */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {t('payments.usage.electricity', 'Electricity')}
          </Text>

          <TextInput
            label={t('payments.usage.previousReading', 'Previous Reading (kWh)')}
            value={previousElectricityReading}
            onChangeText={setPreviousElectricityReading}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label={t('payments.usage.currentReading', 'Current Reading (kWh)')}
            value={currentElectricityReading}
            onChangeText={setCurrentElectricityReading}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label={t('payments.usage.electricityUsage', 'Electricity Usage (kWh)')}
            value={electricityUsage}
            onChangeText={setElectricityUsage}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            error={!!errors.electricityUsage}
          />
          {errors.electricityUsage && (
            <HelperText type="error">{errors.electricityUsage}</HelperText>
          )}

          <Divider style={styles.divider} />

          {/* Water Section */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {t('payments.usage.water', 'Water')}
          </Text>

          <TextInput
            label={t('payments.usage.previousReading', 'Previous Reading (m³)')}
            value={previousWaterReading}
            onChangeText={setPreviousWaterReading}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label={t('payments.usage.currentReading', 'Current Reading (m³)')}
            value={currentWaterReading}
            onChangeText={setCurrentWaterReading}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label={t('payments.usage.waterUsage', 'Water Usage (m³)')}
            value={waterUsage}
            onChangeText={setWaterUsage}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            error={!!errors.waterUsage}
          />
          {errors.waterUsage && (
            <HelperText type="error">{errors.waterUsage}</HelperText>
          )}

          <Divider style={styles.divider} />

          {/* Adjustments */}
          <TextInput
            label={t('payments.usage.adjustments', 'Adjustments (VND)')}
            value={adjustments}
            onChangeText={setAdjustments}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />

          {/* Notes */}
          <TextInput
            label={t('payments.usage.notes', 'Notes')}
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
          >
            {t('payments.usage.submit', 'Record Usage')}
          </Button>

          {/* Calculation Display */}
          {calculatedAmounts && (
            <View style={styles.calculationContainer}>
              <Divider style={styles.divider} />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                {t('payments.usage.calculation', 'Calculation')}
              </Text>

              <View style={styles.calculationRow}>
                <Text variant="bodyMedium">{t('payments.usage.electricity', 'Electricity')}:</Text>
                <Text variant="bodyMedium" style={styles.calculationValue}>
                  {calculatedAmounts.electricityAmount.toLocaleString('vi-VN')} VND
                </Text>
              </View>

              <View style={styles.calculationRow}>
                <Text variant="bodyMedium">{t('payments.usage.water', 'Water')}:</Text>
                <Text variant="bodyMedium" style={styles.calculationValue}>
                  {calculatedAmounts.waterAmount.toLocaleString('vi-VN')} VND
                </Text>
              </View>

              {calculatedAmounts.adjustments !== 0 && (
                <View style={styles.calculationRow}>
                  <Text variant="bodyMedium">{t('payments.usage.adjustments', 'Adjustments')}:</Text>
                  <Text variant="bodyMedium" style={styles.calculationValue}>
                    {calculatedAmounts.adjustments.toLocaleString('vi-VN')} VND
                  </Text>
                </View>
              )}

              <Divider style={styles.divider} />

              <View style={styles.calculationRow}>
                <Text variant="titleMedium" style={styles.totalLabel}>
                  {t('payments.usage.total', 'Total')}:
                </Text>
                <Text variant="titleLarge" style={[styles.calculationValue, { color: theme.colors.primary }]}>
                  {calculatedAmounts.totalAmount.toLocaleString('vi-VN')} VND
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 16,
  },
  calculationContainer: {
    marginTop: 16,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  calculationValue: {
    fontWeight: '600',
  },
  totalLabel: {
    fontWeight: 'bold',
  },
});
