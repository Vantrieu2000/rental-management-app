import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, TextInput, Button, HelperText, Menu } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Property, PropertyFormData, propertySchema, PROPERTY_TYPES } from '../types';

interface PropertyFormModalProps {
  visible: boolean;
  property?: Property;
  onClose: () => void;
  onSubmit: (data: PropertyFormData) => void;
  isLoading: boolean;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  visible,
  property,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const { t } = useTranslation();
  const isEditMode = !!property;
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      address: '',
      type: 'apartment',
      totalRooms: 1,
      defaultElectricityRate: 3500,
      defaultWaterRate: 20000,
      defaultGarbageRate: 50000,
      defaultParkingRate: 100000,
      billingDayOfMonth: 5,
      reminderDaysBefore: 3,
    },
  });

  // Reset form when modal opens/closes or property changes
  useEffect(() => {
    if (visible) {
      if (property) {
        reset({
          name: property.name,
          address: property.address,
          type: property.type,
          totalRooms: property.totalRooms,
          defaultElectricityRate: property.defaultElectricityRate || 3500,
          defaultWaterRate: property.defaultWaterRate || 20000,
          defaultGarbageRate: property.defaultGarbageRate || 50000,
          defaultParkingRate: property.defaultParkingRate || 100000,
          billingDayOfMonth: property.billingDayOfMonth || 5,
          reminderDaysBefore: property.reminderDaysBefore || 3,
        });
      } else {
        reset({
          name: '',
          address: '',
          type: 'apartment',
          totalRooms: 1,
          defaultElectricityRate: 3500,
          defaultWaterRate: 20000,
          defaultGarbageRate: 50000,
          defaultParkingRate: 100000,
          billingDayOfMonth: 5,
          reminderDaysBefore: 3,
        });
      }
    }
  }, [visible, property, reset]);

  const handleFormSubmit = (data: PropertyFormData) => {
    onSubmit(data);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modal}
      >
        <ScrollView>
          <Text variant="headlineSmall" style={styles.title}>
            {isEditMode ? t('properties.editProperty') : t('properties.addProperty')}
          </Text>

          <View style={styles.form}>
            {/* Property Name */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldContainer}>
                  <TextInput
                    label={t('properties.form.name')}
                    placeholder={t('properties.form.namePlaceholder')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.name}
                    disabled={isLoading}
                    mode="outlined"
                  />
                  {errors.name && (
                    <HelperText type="error" visible={!!errors.name}>
                      {t(errors.name.message || '')}
                    </HelperText>
                  )}
                </View>
              )}
            />

            {/* Address */}
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldContainer}>
                  <TextInput
                    label={t('properties.form.address')}
                    placeholder={t('properties.form.addressPlaceholder')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.address}
                    disabled={isLoading}
                    mode="outlined"
                    multiline
                    numberOfLines={2}
                  />
                  {errors.address && (
                    <HelperText type="error" visible={!!errors.address}>
                      {t(errors.address.message || '')}
                    </HelperText>
                  )}
                </View>
              )}
            />

            {/* Property Type */}
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Menu
                    visible={typeMenuVisible}
                    onDismiss={() => setTypeMenuVisible(false)}
                    anchor={
                      <TextInput
                        label={t('properties.form.type')}
                        value={t(PROPERTY_TYPES.find(t => t.value === value)?.labelKey || '')}
                        onFocus={() => setTypeMenuVisible(true)}
                        error={!!errors.type}
                        disabled={isLoading}
                        mode="outlined"
                        right={<TextInput.Icon icon="chevron-down" />}
                        editable={false}
                      />
                    }
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <Menu.Item
                        key={type.value}
                        onPress={() => {
                          onChange(type.value);
                          setTypeMenuVisible(false);
                        }}
                        title={t(type.labelKey)}
                        leadingIcon={type.icon}
                      />
                    ))}
                  </Menu>
                  {errors.type && (
                    <HelperText type="error" visible={!!errors.type}>
                      {t(errors.type.message || '')}
                    </HelperText>
                  )}
                </View>
              )}
            />

            {/* Total Rooms */}
            <Controller
              control={control}
              name="totalRooms"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldContainer}>
                  <TextInput
                    label={t('properties.form.totalRooms')}
                    placeholder={t('properties.form.totalRoomsPlaceholder')}
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const num = parseInt(text, 10);
                      onChange(isNaN(num) ? 0 : num);
                    }}
                    onBlur={onBlur}
                    error={!!errors.totalRooms}
                    disabled={isLoading}
                    mode="outlined"
                    keyboardType="number-pad"
                  />
                  {errors.totalRooms && (
                    <HelperText type="error" visible={!!errors.totalRooms}>
                      {t(errors.totalRooms.message || '')}
                    </HelperText>
                  )}
                </View>
              )}
            />

            {/* Section: Default Utility Rates */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('properties.form.defaultRates')}
            </Text>

            {/* Default Electricity Rate */}
            <Controller
              control={control}
              name="defaultElectricityRate"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldContainer}>
                  <TextInput
                    label={t('properties.form.defaultElectricityRate')}
                    placeholder="3500"
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const num = parseFloat(text);
                      onChange(isNaN(num) ? undefined : num);
                    }}
                    onBlur={onBlur}
                    error={!!errors.defaultElectricityRate}
                    disabled={isLoading}
                    mode="outlined"
                    keyboardType="numeric"
                    right={<TextInput.Affix text="₫/kWh" />}
                  />
                  {errors.defaultElectricityRate && (
                    <HelperText type="error" visible={!!errors.defaultElectricityRate}>
                      {t(errors.defaultElectricityRate.message || '')}
                    </HelperText>
                  )}
                </View>
              )}
            />

            {/* Default Water Rate */}
            <Controller
              control={control}
              name="defaultWaterRate"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldContainer}>
                  <TextInput
                    label={t('properties.form.defaultWaterRate')}
                    placeholder="20000"
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const num = parseFloat(text);
                      onChange(isNaN(num) ? undefined : num);
                    }}
                    onBlur={onBlur}
                    error={!!errors.defaultWaterRate}
                    disabled={isLoading}
                    mode="outlined"
                    keyboardType="numeric"
                    right={<TextInput.Affix text="₫/m³" />}
                  />
                  {errors.defaultWaterRate && (
                    <HelperText type="error" visible={!!errors.defaultWaterRate}>
                      {t(errors.defaultWaterRate.message || '')}
                    </HelperText>
                  )}
                </View>
              )}
            />

            {/* Default Garbage Rate */}
            <Controller
              control={control}
              name="defaultGarbageRate"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldContainer}>
                  <TextInput
                    label={t('properties.form.defaultGarbageRate')}
                    placeholder="50000"
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const num = parseFloat(text);
                      onChange(isNaN(num) ? undefined : num);
                    }}
                    onBlur={onBlur}
                    error={!!errors.defaultGarbageRate}
                    disabled={isLoading}
                    mode="outlined"
                    keyboardType="numeric"
                    right={<TextInput.Affix text="₫/tháng" />}
                  />
                  {errors.defaultGarbageRate && (
                    <HelperText type="error" visible={!!errors.defaultGarbageRate}>
                      {t(errors.defaultGarbageRate.message || '')}
                    </HelperText>
                  )}
                </View>
              )}
            />

            {/* Default Parking Rate */}
            <Controller
              control={control}
              name="defaultParkingRate"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldContainer}>
                  <TextInput
                    label={t('properties.form.defaultParkingRate')}
                    placeholder="100000"
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const num = parseFloat(text);
                      onChange(isNaN(num) ? undefined : num);
                    }}
                    onBlur={onBlur}
                    error={!!errors.defaultParkingRate}
                    disabled={isLoading}
                    mode="outlined"
                    keyboardType="numeric"
                    right={<TextInput.Affix text="₫/tháng" />}
                  />
                  {errors.defaultParkingRate && (
                    <HelperText type="error" visible={!!errors.defaultParkingRate}>
                      {t(errors.defaultParkingRate.message || '')}
                    </HelperText>
                  )}
                </View>
              )}
            />

            {/* Section: Billing Settings */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('properties.form.billingSettings')}
            </Text>

            {/* Billing Day of Month */}
            <Controller
              control={control}
              name="billingDayOfMonth"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.fieldContainer}>
                  <TextInput
                    label={t('properties.form.billingDayOfMonth')}
                    placeholder="5"
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const num = parseInt(text, 10);
                      onChange(isNaN(num) ? undefined : num);
                    }}
                    onBlur={onBlur}
                    error={!!errors.billingDayOfMonth}
                    disabled={isLoading}
                    mode="outlined"
                    keyboardType="number-pad"
                  />
                  <HelperText type="info" visible={!errors.billingDayOfMonth}>
                    {t('properties.form.billingDayHelper')}
                  </HelperText>
                  {errors.billingDayOfMonth && (
                    <HelperText type="error" visible={!!errors.billingDayOfMonth}>
                      {t(errors.billingDayOfMonth.message || '')}
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
                <View style={styles.fieldContainer}>
                  <TextInput
                    label={t('properties.form.reminderDaysBefore')}
                    placeholder="3"
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const num = parseInt(text, 10);
                      onChange(isNaN(num) ? undefined : num);
                    }}
                    onBlur={onBlur}
                    error={!!errors.reminderDaysBefore}
                    disabled={isLoading}
                    mode="outlined"
                    keyboardType="number-pad"
                  />
                  <HelperText type="info" visible={!errors.reminderDaysBefore}>
                    {t('properties.form.reminderDaysHelper')}
                  </HelperText>
                  {errors.reminderDaysBefore && (
                    <HelperText type="error" visible={!!errors.reminderDaysBefore}>
                      {t(errors.reminderDaysBefore.message || '')}
                    </HelperText>
                  )}
                </View>
              )}
            />
          </View>

          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={onClose}
              disabled={isLoading}
              style={styles.button}
            >
              {t('properties.form.cancel')}
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit(handleFormSubmit)}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              {t('properties.form.submit')}
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  title: {
    marginBottom: 20,
    fontWeight: '600',
  },
  form: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 12,
    fontWeight: '600',
    color: '#1976d2',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    minWidth: 100,
  },
});
