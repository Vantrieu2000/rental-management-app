/**
 * Add/Edit Property Screen
 * Form for creating or editing a property with validation
 */

import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useCreateProperty,
  useUpdateProperty,
  useProperty,
} from '../hooks/useProperties';
import { useTranslation } from 'react-i18next';

// Validation schema
const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  totalRooms: z.number().min(1, 'Must have at least 1 room'),
  defaultElectricityRate: z.number().min(0, 'Rate must be non-negative'),
  defaultWaterRate: z.number().min(0, 'Rate must be non-negative'),
  defaultGarbageRate: z.number().min(0, 'Rate must be non-negative'),
  defaultParkingRate: z.number().min(0, 'Rate must be non-negative'),
  billingDayOfMonth: z
    .number()
    .min(1, 'Day must be between 1 and 31')
    .max(31, 'Day must be between 1 and 31'),
  reminderDaysBefore: z.number().min(0, 'Must be non-negative'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export const AddEditPropertyScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const propertyId = (route.params as any)?.propertyId;

  const isEditMode = !!propertyId;

  const { data: existingProperty, isLoading: isLoadingProperty } = useProperty(
    propertyId || ''
  );

  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      address: '',
      totalRooms: 0,
      defaultElectricityRate: 0,
      defaultWaterRate: 0,
      defaultGarbageRate: 0,
      defaultParkingRate: 0,
      billingDayOfMonth: 1,
      reminderDaysBefore: 3,
    },
  });

  // Load existing property data in edit mode
  useEffect(() => {
    if (existingProperty && isEditMode) {
      reset({
        name: existingProperty.name,
        address: existingProperty.address,
        totalRooms: existingProperty.totalRooms,
        defaultElectricityRate: existingProperty.defaultElectricityRate,
        defaultWaterRate: existingProperty.defaultWaterRate,
        defaultGarbageRate: existingProperty.defaultGarbageRate,
        defaultParkingRate: existingProperty.defaultParkingRate,
        billingDayOfMonth: existingProperty.billingDayOfMonth,
        reminderDaysBefore: existingProperty.reminderDaysBefore,
      });
    }
  }, [existingProperty, isEditMode, reset]);

  const onSubmit = async (data: PropertyFormData) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: propertyId,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save property:', error);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || isLoadingProperty;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="headlineSmall" style={styles.title}>
          {isEditMode ? t('editProperty') : t('addProperty')}
        </Text>

        {/* Property Name */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label={t('propertyName')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.name}
                mode="outlined"
              />
              {errors.name && (
                <HelperText type="error">{errors.name.message}</HelperText>
              )}
            </View>
          )}
        />

        {/* Address */}
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label={t('address')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.address}
                mode="outlined"
                multiline
                numberOfLines={2}
              />
              {errors.address && (
                <HelperText type="error">{errors.address.message}</HelperText>
              )}
            </View>
          )}
        />

        {/* Total Rooms */}
        <Controller
          control={control}
          name="totalRooms"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label={t('totalRooms')}
                value={value.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                onBlur={onBlur}
                error={!!errors.totalRooms}
                mode="outlined"
                keyboardType="numeric"
              />
              {errors.totalRooms && (
                <HelperText type="error">{errors.totalRooms.message}</HelperText>
              )}
            </View>
          )}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          {t('defaultRates')}
        </Text>

        {/* Electricity Rate */}
        <Controller
          control={control}
          name="defaultElectricityRate"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label={t('electricityRate')}
                value={value.toString()}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                onBlur={onBlur}
                error={!!errors.defaultElectricityRate}
                mode="outlined"
                keyboardType="numeric"
              />
              {errors.defaultElectricityRate && (
                <HelperText type="error">
                  {errors.defaultElectricityRate.message}
                </HelperText>
              )}
            </View>
          )}
        />

        {/* Water Rate */}
        <Controller
          control={control}
          name="defaultWaterRate"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label={t('waterRate')}
                value={value.toString()}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                onBlur={onBlur}
                error={!!errors.defaultWaterRate}
                mode="outlined"
                keyboardType="numeric"
              />
              {errors.defaultWaterRate && (
                <HelperText type="error">
                  {errors.defaultWaterRate.message}
                </HelperText>
              )}
            </View>
          )}
        />

        {/* Garbage Rate */}
        <Controller
          control={control}
          name="defaultGarbageRate"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label={t('garbageRate')}
                value={value.toString()}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                onBlur={onBlur}
                error={!!errors.defaultGarbageRate}
                mode="outlined"
                keyboardType="numeric"
              />
              {errors.defaultGarbageRate && (
                <HelperText type="error">
                  {errors.defaultGarbageRate.message}
                </HelperText>
              )}
            </View>
          )}
        />

        {/* Parking Rate */}
        <Controller
          control={control}
          name="defaultParkingRate"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label={t('parkingRate')}
                value={value.toString()}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                onBlur={onBlur}
                error={!!errors.defaultParkingRate}
                mode="outlined"
                keyboardType="numeric"
              />
              {errors.defaultParkingRate && (
                <HelperText type="error">
                  {errors.defaultParkingRate.message}
                </HelperText>
              )}
            </View>
          )}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          {t('billingSettings')}
        </Text>

        {/* Billing Day of Month */}
        <Controller
          control={control}
          name="billingDayOfMonth"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label={t('billingDayOfMonth')}
                value={value.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 1)}
                onBlur={onBlur}
                error={!!errors.billingDayOfMonth}
                mode="outlined"
                keyboardType="numeric"
              />
              {errors.billingDayOfMonth && (
                <HelperText type="error">
                  {errors.billingDayOfMonth.message}
                </HelperText>
              )}
            </View>
          )}
        />

        {/* Reminder Days Before */}
        <Controller
          control={control}
          name="reminderDaysBefore"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label={t('reminderDaysBefore')}
                value={value.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                onBlur={onBlur}
                error={!!errors.reminderDaysBefore}
                mode="outlined"
                keyboardType="numeric"
              />
              {errors.reminderDaysBefore && (
                <HelperText type="error">
                  {errors.reminderDaysBefore.message}
                </HelperText>
              )}
            </View>
          )}
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
          >
            {isEditMode ? t('updateProperty') : t('createProperty')}
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  submitButton: {
    marginBottom: 8,
  },
});
