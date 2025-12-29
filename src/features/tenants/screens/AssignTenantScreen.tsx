/**
 * Assign Tenant Screen
 * Screen for assigning a tenant to a room
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, TextInput, HelperText, ActivityIndicator } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateTenant } from '../hooks/useTenants';
import { createTenantSchema, CreateTenantFormData } from '../validation/tenantSchemas';

type RootStackParamList = {
  AssignTenant: { roomId: string };
};

type AssignTenantScreenRouteProp = RouteProp<RootStackParamList, 'AssignTenant'>;
type AssignTenantScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AssignTenantScreen: React.FC = () => {
  const navigation = useNavigation<AssignTenantScreenNavigationProp>();
  const route = useRoute<AssignTenantScreenRouteProp>();
  const { roomId } = route.params;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const createTenantMutation = useCreateTenant();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      roomId,
      moveInDate: new Date(),
    },
  });

  const moveInDate = watch('moveInDate');

  const onSubmit = async (data: CreateTenantFormData) => {
    try {
      await createTenantMutation.mutateAsync(data);
      Alert.alert('Success', 'Tenant assigned successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to assign tenant');
    }
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue('moveInDate', selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Tenant Name *"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.name}
                style={styles.input}
              />
              {errors.name && <HelperText type="error">{errors.name.message}</HelperText>}
            </>
          )}
        />

        {/* Phone */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Phone Number *"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.phone}
                keyboardType="phone-pad"
                placeholder="0901234567"
                style={styles.input}
              />
              {errors.phone && <HelperText type="error">{errors.phone.message}</HelperText>}
            </>
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Email"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              {errors.email && <HelperText type="error">{errors.email.message}</HelperText>}
            </>
          )}
        />

        {/* ID Number */}
        <Controller
          control={control}
          name="idNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="ID Number"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.idNumber}
                style={styles.input}
              />
              {errors.idNumber && <HelperText type="error">{errors.idNumber.message}</HelperText>}
            </>
          )}
        />

        {/* Move-in Date */}
        <View style={styles.dateContainer}>
          <TextInput
            label="Move-in Date *"
            mode="outlined"
            value={moveInDate ? moveInDate.toLocaleDateString() : ''}
            editable={false}
            right={
              <TextInput.Icon
                icon="calendar"
                onPress={() => setShowDatePicker(true)}
              />
            }
            style={styles.input}
          />
          {errors.moveInDate && (
            <HelperText type="error">{errors.moveInDate.message}</HelperText>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={moveInDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Emergency Contact Section */}
        <View style={styles.section}>
          <TextInput
            label="Emergency Contact Name"
            mode="outlined"
            onChangeText={(text) => setValue('emergencyContact.name', text)}
            style={styles.input}
          />

          <TextInput
            label="Emergency Contact Phone"
            mode="outlined"
            onChangeText={(text) => setValue('emergencyContact.phone', text)}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            label="Relationship"
            mode="outlined"
            onChangeText={(text) => setValue('emergencyContact.relationship', text)}
            style={styles.input}
          />
        </View>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          disabled={createTenantMutation.isPending}
          style={styles.button}
        >
          {createTenantMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            'Assign Tenant'
          )}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  dateContainer: {
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
});
