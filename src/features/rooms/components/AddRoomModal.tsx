/**
 * AddRoomModal Component
 * Modal for creating a new room
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, HelperText, Snackbar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { createRoomSchema, CreateRoomFormData } from '../validation/roomSchemas';
import { useCreateRoom } from '../hooks/useRooms';

interface AddRoomModalProps {
  visible: boolean;
  propertyId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddRoomModal({ visible, propertyId, onClose, onSuccess }: AddRoomModalProps) {
  const { t } = useTranslation();
  const { mutate: createRoom, isPending } = useCreateRoom();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      propertyId,
      roomCode: '',
      roomName: '',
      rentalPrice: 0,
      electricityFee: 0,
      waterFee: 0,
      garbageFee: 0,
      parkingFee: 0,
    },
  });

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const onSubmit = (data: CreateRoomFormData) => {
    console.log('Submitting room creation with data:', data);
    createRoom(data, {
      onSuccess: () => {
        console.log('Room created successfully');
        showSnackbar(t('rooms.success.created'), 'success');
        reset();
        onSuccess();
        setTimeout(() => onClose(), 1000);
      },
      onError: (error) => {
        console.error('Room creation error:', error);
        console.error('Error message:', error.message);
        
        let errorMessage = t('rooms.errors.createFailed');
        
        if (error.message.includes('duplicate')) {
          errorMessage = t('rooms.errors.duplicateCode');
        } else if (error.message.includes('authentication') || error.message.includes('token')) {
          errorMessage = 'Lỗi xác thực. Vui lòng đăng nhập lại.';
        } else if (error.message) {
          // Show the actual error message for debugging
          errorMessage = `${t('rooms.errors.createFailed')}: ${error.message}`;
        }
        
        showSnackbar(errorMessage, 'error');
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleClose} contentContainerStyle={styles.modal}>
        <ScrollView>
          <Text variant="titleLarge" style={styles.title}>
            {t('rooms.addRoom')}
          </Text>

          {/* Room Code */}
          <Controller
            control={control}
            name="roomCode"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.field}>
                <TextInput
                  label={t('rooms.form.roomCode')}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.roomCode}
                  mode="outlined"
                  autoCapitalize="characters"
                />
                {errors.roomCode && (
                  <HelperText type="error">{errors.roomCode.message}</HelperText>
                )}
              </View>
            )}
          />

          {/* Room Name */}
          <Controller
            control={control}
            name="roomName"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.field}>
                <TextInput
                  label={t('rooms.form.roomName')}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.roomName}
                  mode="outlined"
                />
                {errors.roomName && (
                  <HelperText type="error">{errors.roomName.message}</HelperText>
                )}
              </View>
            )}
          />

          {/* Rental Price */}
          <Controller
            control={control}
            name="rentalPrice"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.field}>
                <TextInput
                  label={t('rooms.form.rentalPrice')}
                  value={value.toString()}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  onBlur={onBlur}
                  error={!!errors.rentalPrice}
                  mode="outlined"
                  keyboardType="numeric"
                />
                {errors.rentalPrice && (
                  <HelperText type="error">{errors.rentalPrice.message}</HelperText>
                )}
              </View>
            )}
          />

          {/* Electricity Fee */}
          <Controller
            control={control}
            name="electricityFee"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.field}>
                <TextInput
                  label={t('rooms.form.electricityFee')}
                  value={value.toString()}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  onBlur={onBlur}
                  error={!!errors.electricityFee}
                  mode="outlined"
                  keyboardType="numeric"
                />
                {errors.electricityFee && (
                  <HelperText type="error">{errors.electricityFee.message}</HelperText>
                )}
              </View>
            )}
          />

          {/* Water Fee */}
          <Controller
            control={control}
            name="waterFee"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.field}>
                <TextInput
                  label={t('rooms.form.waterFee')}
                  value={value.toString()}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  onBlur={onBlur}
                  error={!!errors.waterFee}
                  mode="outlined"
                  keyboardType="numeric"
                />
                {errors.waterFee && (
                  <HelperText type="error">{errors.waterFee.message}</HelperText>
                )}
              </View>
            )}
          />

          {/* Garbage Fee */}
          <Controller
            control={control}
            name="garbageFee"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.field}>
                <TextInput
                  label={t('rooms.form.garbageFee')}
                  value={value.toString()}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  onBlur={onBlur}
                  error={!!errors.garbageFee}
                  mode="outlined"
                  keyboardType="numeric"
                />
                {errors.garbageFee && (
                  <HelperText type="error">{errors.garbageFee.message}</HelperText>
                )}
              </View>
            )}
          />

          {/* Parking Fee */}
          <Controller
            control={control}
            name="parkingFee"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.field}>
                <TextInput
                  label={t('rooms.form.parkingFee')}
                  value={value.toString()}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  onBlur={onBlur}
                  error={!!errors.parkingFee}
                  mode="outlined"
                  keyboardType="numeric"
                />
                {errors.parkingFee && (
                  <HelperText type="error">{errors.parkingFee.message}</HelperText>
                )}
              </View>
            )}
          />

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button mode="outlined" onPress={handleClose} style={styles.button} disabled={isPending}>
              {t('rooms.form.cancel')}
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={styles.button}
              loading={isPending}
              disabled={isPending}
            >
              {t('rooms.form.submit')}
            </Button>
          </View>
        </ScrollView>

        {/* Snackbar for success/error messages */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={snackbarType === 'error' ? styles.errorSnackbar : styles.successSnackbar}
        >
          {snackbarMessage}
        </Snackbar>
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
    maxHeight: '90%',
  },
  title: {
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  successSnackbar: {
    backgroundColor: '#4CAF50',
  },
  errorSnackbar: {
    backgroundColor: '#F44336',
  },
});
