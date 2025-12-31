/**
 * EditTenantModal Component
 * Modal for editing tenant information in a room
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  IconButton,
  useTheme,
  HelperText,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Room, UpdateTenantDto } from '../types';
import { useUpdateTenant } from '../hooks/useRooms';

interface EditTenantModalProps {
  visible: boolean;
  room: Room;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditTenantModal({
  visible,
  room,
  onClose,
  onSuccess,
}: EditTenantModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { mutate: updateTenant, isPending } = useUpdateTenant();

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [moveInDate, setMoveInDate] = useState(new Date());
  const [paymentDueDate, setPaymentDueDate] = useState(new Date());
  const [showMoveInDatePicker, setShowMoveInDatePicker] = useState(false);
  const [showPaymentDueDatePicker, setShowPaymentDueDatePicker] = useState(false);

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Initialize form with current tenant data
  useEffect(() => {
    if (visible && room.currentTenant) {
      setName(room.currentTenant.name || '');
      setPhone(room.currentTenant.phone || '');
      setMoveInDate(
        room.currentTenant.moveInDate
          ? new Date(room.currentTenant.moveInDate)
          : new Date()
      );
      setPaymentDueDate(
        room.currentTenant.paymentDueDate
          ? new Date(room.currentTenant.paymentDueDate)
          : new Date()
      );
    } else if (visible && !room.currentTenant) {
      // Reset form for new tenant
      setName('');
      setPhone('');
      setMoveInDate(new Date());
      setPaymentDueDate(new Date());
    }
    // Clear errors when modal opens
    setNameError('');
    setPhoneError('');
  }, [visible, room]);

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError(t('rooms.tenant.errors.nameRequired'));
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate phone
    if (!phone.trim()) {
      setPhoneError(t('rooms.tenant.errors.phoneRequired'));
      isValid = false;
    } else if (!/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))) {
      setPhoneError(t('rooms.tenant.errors.phoneInvalid'));
      isValid = false;
    } else {
      setPhoneError('');
    }

    return isValid;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const data: UpdateTenantDto = {
      name: name.trim(),
      phone: phone.trim(),
      moveInDate: moveInDate.toISOString(),
      paymentDueDate: paymentDueDate.toISOString(),
    };

    updateTenant(
      { roomId: room.id, data },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
        onError: (error) => {
          console.error('Failed to update tenant:', error);
          // You can show a toast/snackbar here
        },
      }
    );
  };

  const handleMoveInDateChange = (_event: any, selectedDate?: Date) => {
    setShowMoveInDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setMoveInDate(selectedDate);
    }
  };

  const handlePaymentDueDateChange = (_event: any, selectedDate?: Date) => {
    setShowPaymentDueDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setPaymentDueDate(selectedDate);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            {room.currentTenant
              ? t('rooms.tenant.editTenant')
              : t('rooms.tenant.addTenant')}
          </Text>
          <IconButton icon="close" size={24} onPress={onClose} />
        </View>

        <ScrollView style={styles.content}>
          {/* Name Input */}
          <TextInput
            label={t('rooms.tenant.name')}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (nameError) setNameError('');
            }}
            mode="outlined"
            style={styles.input}
            error={!!nameError}
            disabled={isPending}
            left={<TextInput.Icon icon="account" />}
          />
          {nameError ? (
            <HelperText type="error" visible={!!nameError}>
              {nameError}
            </HelperText>
          ) : null}

          {/* Phone Input */}
          <TextInput
            label={t('rooms.tenant.phone')}
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (phoneError) setPhoneError('');
            }}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
            error={!!phoneError}
            disabled={isPending}
            left={<TextInput.Icon icon="phone" />}
          />
          {phoneError ? (
            <HelperText type="error" visible={!!phoneError}>
              {phoneError}
            </HelperText>
          ) : null}

          {/* Move In Date */}
          <View style={styles.dateContainer}>
            <Text variant="bodyMedium" style={styles.dateLabel}>
              {t('rooms.tenant.moveInDate')}
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowMoveInDatePicker(true)}
              icon="calendar"
              style={styles.dateButton}
              disabled={isPending}
            >
              {moveInDate.toLocaleDateString()}
            </Button>
          </View>

          {showMoveInDatePicker && (
            <DateTimePicker
              value={moveInDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleMoveInDateChange}
              maximumDate={new Date()}
            />
          )}

          {/* Payment Due Date */}
          <View style={styles.dateContainer}>
            <Text variant="bodyMedium" style={styles.dateLabel}>
              {t('rooms.tenant.paymentDueDate')}
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowPaymentDueDatePicker(true)}
              icon="calendar-clock"
              style={styles.dateButton}
              disabled={isPending}
            >
              {paymentDueDate.toLocaleDateString()}
            </Button>
          </View>

          {showPaymentDueDatePicker && (
            <DateTimePicker
              value={paymentDueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handlePaymentDueDateChange}
            />
          )}
        </ScrollView>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={onClose}
            style={styles.button}
            disabled={isPending}
          >
            {t('common.cancel')}
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            loading={isPending}
            disabled={isPending}
          >
            {t('common.save')}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  input: {
    marginBottom: 8,
  },
  dateContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  dateLabel: {
    marginBottom: 8,
    opacity: 0.7,
  },
  dateButton: {
    justifyContent: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.12)',
  },
  button: {
    minWidth: 100,
  },
});
