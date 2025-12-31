/**
 * Maintenance Detail Screen
 * Displays detailed information about a maintenance request
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Chip,
  ActivityIndicator,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import { format } from 'date-fns';
import {
  useMaintenanceRequest,
  useDeleteMaintenanceRequest,
  useResolveMaintenanceRequest,
} from '../hooks/useMaintenance';

export const MaintenanceDetailScreen = ({ navigation, route }: any) => {
  const { maintenanceId } = route.params;
  const [resolveDialogVisible, setResolveDialogVisible] = useState(false);
  const [resolutionCost, setResolutionCost] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const { data: maintenanceRequest, isLoading } =
    useMaintenanceRequest(maintenanceId);
  const deleteMutation = useDeleteMaintenanceRequest();
  const resolveMutation = useResolveMaintenanceRequest();

  const handleDelete = () => {
    Alert.alert(
      'Delete Maintenance Request',
      'Are you sure you want to delete this maintenance request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(maintenanceId);
              Alert.alert('Success', 'Maintenance request deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Failed to delete'
              );
            }
          },
        },
      ]
    );
  };

  const handleResolve = async () => {
    try {
      await resolveMutation.mutateAsync({
        id: maintenanceId,
        data: {
          completedDate: new Date(),
          cost: resolutionCost ? parseFloat(resolutionCost) : undefined,
          notes: resolutionNotes || undefined,
        },
      });
      setResolveDialogVisible(false);
      Alert.alert('Success', 'Maintenance request resolved successfully');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to resolve'
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!maintenanceRequest) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="bodyLarge">Maintenance request not found</Text>
      </View>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#F44336';
      case 'high':
        return '#FF9800';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'in_progress':
        return '#2196F3';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#757575';
      default:
        return '#757575';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>
              {maintenanceRequest.title}
            </Text>
            <View style={styles.badges}>
              <Chip
                mode="flat"
                style={[
                  styles.chip,
                  { backgroundColor: getPriorityColor(maintenanceRequest.priority) },
                ]}
                textStyle={styles.chipText}
              >
                {maintenanceRequest.priority.toUpperCase()}
              </Chip>
              <Chip
                mode="flat"
                style={[
                  styles.chip,
                  { backgroundColor: getStatusColor(maintenanceRequest.status) },
                ]}
                textStyle={styles.chipText}
              >
                {maintenanceRequest.status.replace('_', ' ').toUpperCase()}
              </Chip>
            </View>
          </View>

          <Text variant="bodyLarge" style={styles.description}>
            {maintenanceRequest.description}
          </Text>

          <View style={styles.infoSection}>
            <Text variant="labelLarge" style={styles.sectionTitle}>
              Details
            </Text>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.infoLabel}>
                Reported By:
              </Text>
              <Text variant="bodyMedium">{maintenanceRequest.reportedBy}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.infoLabel}>
                Reported Date:
              </Text>
              <Text variant="bodyMedium">
                {format(maintenanceRequest.reportedDate, 'MMM dd, yyyy')}
              </Text>
            </View>
            {maintenanceRequest.assignedTo && (
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Assigned To:
                </Text>
                <Text variant="bodyMedium">{maintenanceRequest.assignedTo}</Text>
              </View>
            )}
            {maintenanceRequest.scheduledDate && (
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Scheduled Date:
                </Text>
                <Text variant="bodyMedium">
                  {format(maintenanceRequest.scheduledDate, 'MMM dd, yyyy')}
                </Text>
              </View>
            )}
            {maintenanceRequest.completedDate && (
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Completed Date:
                </Text>
                <Text variant="bodyMedium">
                  {format(maintenanceRequest.completedDate, 'MMM dd, yyyy')}
                </Text>
              </View>
            )}
            {maintenanceRequest.cost && (
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Cost:
                </Text>
                <Text variant="bodyMedium" style={styles.costText}>
                  ${maintenanceRequest.cost.toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          {maintenanceRequest.notes && (
            <View style={styles.infoSection}>
              <Text variant="labelLarge" style={styles.sectionTitle}>
                Notes
              </Text>
              <Text variant="bodyMedium">{maintenanceRequest.notes}</Text>
            </View>
          )}

          {maintenanceRequest.photos.length > 0 && (
            <View style={styles.infoSection}>
              <Text variant="labelLarge" style={styles.sectionTitle}>
                Photos
              </Text>
              <View style={styles.photosContainer}>
                {maintenanceRequest.photos.map((photo, index) => (
                  <TouchableOpacity key={index}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {maintenanceRequest.status !== 'completed' &&
          maintenanceRequest.status !== 'cancelled' && (
            <>
              <Button
                mode="contained"
                onPress={() => setResolveDialogVisible(true)}
                style={styles.actionButton}
              >
                Mark as Resolved
              </Button>
              <Button
                mode="outlined"
                onPress={() =>
                  navigation.navigate('AddEditMaintenance', { maintenanceId })
                }
                style={styles.actionButton}
              >
                Edit
              </Button>
            </>
          )}
        <Button
          mode="outlined"
          onPress={handleDelete}
          textColor="#F44336"
          style={styles.actionButton}
        >
          Delete
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={resolveDialogVisible}
          onDismiss={() => setResolveDialogVisible(false)}
        >
          <Dialog.Title>Resolve Maintenance Request</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Cost (optional)"
              mode="outlined"
              value={resolutionCost}
              onChangeText={setResolutionCost}
              keyboardType="numeric"
              style={styles.dialogInput}
            />
            <TextInput
              label="Resolution Notes (optional)"
              mode="outlined"
              value={resolutionNotes}
              onChangeText={setResolutionNotes}
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setResolveDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={handleResolve}
              loading={resolveMutation.isPending}
              disabled={resolveMutation.isPending}
            >
              Resolve
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontWeight: '600',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    height: 28,
  },
  chipText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  description: {
    marginBottom: 24,
    color: '#424242',
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    color: '#212121',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#757575',
  },
  costText: {
    fontWeight: '600',
    color: '#2196F3',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    marginBottom: 0,
  },
  dialogInput: {
    marginBottom: 12,
  },
});
