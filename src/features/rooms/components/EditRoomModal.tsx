/**
 * EditRoomModal Component
 * Modal for editing an existing room
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, HelperText, Snackbar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { updateRoomSchema, UpdateRoomFormData } from '../validation/roomSchemas';
import { useUpdateRoom } from '../hooks/useRooms';
import { Room } from '../types';

interface EditRoomModalProps {
  visible: boolean;
  room: Room;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditRoomModal({ visible, room, onClose, onSuccess }: EditRoomModalProps) {
  const { t } = useTranslation();
  const { mutate: updateRoom, isPending } = useUpdateRoom();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateRoomFormData>({
    resolver: zodResolver(updateRoomSchema),
    defaultValues: {
      roomName: room.roomName,
      rentalPrice: room.rentalPrice,
      electricityFee: room.electricityFee,
      waterFee: room.waterFee,
      garbageFee: room.garbageFee,
      parkingFee: room.parkingFee,
    },
  });

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const onSubmit = (data: UpdateRoomFormData) => {
    updateRoom(
      { id: room.id, data },
      {
        onSuccess: () => {
          showSnackbar(t('rooms.success.updated'), 'success');
          onSuccess();
          setTimeout(() => onClose(), 1000);
        },
        onError: (error) => {
          showSnackbar(t('rooms.errors.updateFailed'), 'error');
        },
      }
    );
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
            {t('rooms.editRoom')}
          </Text>

          {/* Room Code (Read-only) */}
          <View style={styles.field}>
            <TextInput
              label={t('rooms.form.roomCode')}
              value={room.roomCode}
              mode="outlined"
              disabled
              style={styles.disabledInput}
            />
            <HelperText type="info">
              {t('rooms.form.roomCodeReadOnly', 'Room code cannot be changed')}
            </HelperText>
          </View>

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
                  value={value?.toString() || ''}
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
                  value={value?.toString() || ''}
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
                  value={value?.toString() || ''}
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
                  value={value?.toString() || ''}
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
                  value={value?.toString() || ''}
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
  disabledInput: {
    backgroundColor: '#f5f5f5',
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
