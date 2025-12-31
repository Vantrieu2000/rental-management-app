/**
 * Add/Edit Maintenance Request Screen
 * Form for creating or editing maintenance requests
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import {
  useCreateMaintenanceRequest,
  useUpdateMaintenanceRequest,
  useMaintenanceRequest,
  useUploadMaintenancePhoto,
} from '../hooks/useMaintenance';
import { createMaintenanceRequestSchema } from '../validation/maintenanceValidation';
import { MaintenancePriority } from '../types';
import { usePropertyStore } from '@/features/properties/store/propertyStore';
import { useAuthStore } from '@/store/auth.store';

export const AddEditMaintenanceScreen = ({ navigation, route }: any) => {
  const { maintenanceId, roomId } = route.params || {};
  const isEditing = !!maintenanceId;

  const selectedPropertyId = usePropertyStore((state) => state.selectedPropertyId);
  const user = useAuthStore((state) => state.user);
  const [photos, setPhotos] = useState<string[]>([]);

  const { data: existingMaintenance, isLoading: isLoadingMaintenance } =
    useMaintenanceRequest(maintenanceId);

  const createMutation = useCreateMaintenanceRequest();
  const updateMutation = useUpdateMaintenanceRequest();
  const uploadPhotoMutation = useUploadMaintenancePhoto();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(createMaintenanceRequestSchema),
    defaultValues: {
      roomId: roomId || '',
      propertyId: selectedPropertyId || '',
      title: '',
      description: '',
      priority: 'medium' as MaintenancePriority,
      reportedBy: user?.name || '',
      photos: [],
      notes: '',
    },
  });

  useEffect(() => {
    if (existingMaintenance) {
      setValue('roomId', existingMaintenance.roomId);
      setValue('propertyId', existingMaintenance.propertyId);
      setValue('title', existingMaintenance.title);
      setValue('description', existingMaintenance.description);
      setValue('priority', existingMaintenance.priority);
      setValue('reportedBy', existingMaintenance.reportedBy);
      setValue('notes', existingMaintenance.notes || '');
      setPhotos(existingMaintenance.photos);
    }
  }, [existingMaintenance, setValue]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to upload photos'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhoto = result.assets[0].uri;
      setPhotos([...photos, newPhoto]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera permissions to take photos'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhoto = result.assets[0].uri;
      setPhotos([...photos, newPhoto]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    try {
      const requestData = {
        ...data,
        photos,
      };

      if (isEditing) {
        await updateMutation.mutateAsync({
          id: maintenanceId,
          data: requestData,
        });
        Alert.alert('Success', 'Maintenance request updated successfully');
      } else {
        const newRequest = await createMutation.mutateAsync(requestData);

        // Upload photos if any
        if (photos.length > 0) {
          for (const photoUri of photos) {
            await uploadPhotoMutation.mutateAsync({
              id: newRequest.id,
              photoUri,
            });
          }
        }

        Alert.alert('Success', 'Maintenance request created successfully');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An error occurred'
      );
    }
  };

  if (isLoadingMaintenance && isEditing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        {isEditing ? 'Edit Maintenance Request' : 'New Maintenance Request'}
      </Text>

      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Title *"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.title}
            style={styles.input}
          />
        )}
      />
      {errors.title && (
        <Text variant="bodySmall" style={styles.errorText}>
          {errors.title.message}
        </Text>
      )}

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Description *"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.description}
            multiline
            numberOfLines={4}
            style={styles.input}
          />
        )}
      />
      {errors.description && (
        <Text variant="bodySmall" style={styles.errorText}>
          {errors.description.message}
        </Text>
      )}

      <Text variant="labelLarge" style={styles.label}>
        Priority *
      </Text>
      <Controller
        control={control}
        name="priority"
        render={({ field: { onChange, value } }) => (
          <SegmentedButtons
            value={value}
            onValueChange={onChange}
            buttons={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
            style={styles.segmentedButtons}
          />
        )}
      />

      <Controller
        control={control}
        name="reportedBy"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Reported By *"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.reportedBy}
            style={styles.input}
          />
        )}
      />
      {errors.reportedBy && (
        <Text variant="bodySmall" style={styles.errorText}>
          {errors.reportedBy.message}
        </Text>
      )}

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Notes"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        )}
      />

      <Text variant="labelLarge" style={styles.label}>
        Photos
      </Text>
      <View style={styles.photoButtons}>
        <Button
          mode="outlined"
          icon="camera"
          onPress={takePhoto}
          style={styles.photoButton}
        >
          Take Photo
        </Button>
        <Button
          mode="outlined"
          icon="image"
          onPress={pickImage}
          style={styles.photoButton}
        >
          Choose Photo
        </Button>
      </View>

      {photos.length > 0 && (
        <View style={styles.photosContainer}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoWrapper}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <IconButton
                icon="close-circle"
                size={24}
                onPress={() => removePhoto(index)}
                style={styles.removePhotoButton}
              />
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={createMutation.isPending || updateMutation.isPending}
          disabled={createMutation.isPending || updateMutation.isPending}
          style={styles.button}
        >
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 24,
    fontWeight: '600',
  },
  input: {
    marginBottom: 8,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  errorText: {
    color: '#F44336',
    marginBottom: 8,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  photoButton: {
    flex: 1,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    margin: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
});
