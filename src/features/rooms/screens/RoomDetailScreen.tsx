/**
 * RoomDetailScreen Component
 * Displays detailed information about a specific room
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Divider,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRoom, useDeleteRoom } from '../hooks/useRooms';
import { StatusBadge } from '../components/StatusBadge';
import { EditRoomModal } from '../components/EditRoomModal';
import { formatCurrency } from '../utils/formatCurrency';

interface RoomDetailScreenProps {
  route: {
    params: {
      roomId: string;
    };
  };
  navigation: any;
}

export function RoomDetailScreen({ route, navigation }: RoomDetailScreenProps) {
  const { roomId } = route.params;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const locale = i18n.language as 'vi' | 'en';

  const { data: room, isLoading, isError, error, refetch } = useRoom(roomId);
  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom();

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    refetch();
  };

  const handleDelete = () => {
    deleteRoom(roomId, {
      onSuccess: () => {
        navigation.goBack();
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  if (isError || !room) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="titleMedium">{t('rooms.errors.roomNotFound')}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
          {t('common.back')}
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text variant="headlineMedium" style={styles.roomCode}>
                {room.roomCode}
              </Text>
              <Text variant="titleMedium" style={styles.roomName}>
                {room.roomName}
              </Text>
            </View>
            <StatusBadge status={room.status} />
          </View>
        </Card.Content>
      </Card>

      {/* Pricing Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {t('rooms.price')}
          </Text>
          <Divider style={styles.divider} />

          <View style={styles.feeRow}>
            <Text variant="bodyLarge">{t('rooms.rentalPrice')}</Text>
            <Text variant="titleMedium" style={[styles.price, { color: theme.colors.primary }]}>
              {formatCurrency(room.rentalPrice, locale)}
            </Text>
          </View>

          <View style={styles.feeRow}>
            <Text variant="bodyMedium">{t('rooms.electricityFee')}</Text>
            <Text variant="bodyMedium">{formatCurrency(room.electricityFee, locale)}</Text>
          </View>

          <View style={styles.feeRow}>
            <Text variant="bodyMedium">{t('rooms.waterFee')}</Text>
            <Text variant="bodyMedium">{formatCurrency(room.waterFee, locale)}</Text>
          </View>

          <View style={styles.feeRow}>
            <Text variant="bodyMedium">{t('rooms.garbageFee')}</Text>
            <Text variant="bodyMedium">{formatCurrency(room.garbageFee, locale)}</Text>
          </View>

          <View style={styles.feeRow}>
            <Text variant="bodyMedium">{t('rooms.parkingFee')}</Text>
            <Text variant="bodyMedium">{formatCurrency(room.parkingFee, locale)}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Tenant Information */}
      {room.status === 'occupied' && room.currentTenant ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('rooms.tenant.label')}
            </Text>
            <Divider style={styles.divider} />

            <View style={styles.tenantRow}>
              <Text variant="bodyMedium" style={styles.label}>
                {t('rooms.tenant.name')}:
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {room.currentTenant.name}
              </Text>
            </View>

            <View style={styles.tenantRow}>
              <Text variant="bodyMedium" style={styles.label}>
                {t('rooms.tenant.phone')}:
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {room.currentTenant.phone}
              </Text>
            </View>

            <View style={styles.tenantRow}>
              <Text variant="bodyMedium" style={styles.label}>
                {t('rooms.tenant.moveInDate')}:
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {new Date(room.currentTenant.moveInDate).toLocaleDateString(locale)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('rooms.tenant.label')}
            </Text>
            <Divider style={styles.divider} />
            <Text variant="bodyMedium" style={styles.emptyText}>
              {t('rooms.tenant.noTenant')}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleEdit}
          style={styles.actionButton}
          icon="pencil"
          accessible={true}
          accessibilityLabel={t('rooms.editRoom')}
          accessibilityRole="button"
        >
          {t('rooms.editRoom')}
        </Button>
        <Button
          mode="outlined"
          onPress={() => setDeleteDialogVisible(true)}
          style={styles.actionButton}
          icon="delete"
          textColor={theme.colors.error}
          accessible={true}
          accessibilityLabel={t('rooms.deleteRoom')}
          accessibilityRole="button"
        >
          {t('rooms.deleteRoom')}
        </Button>
      </View>

      {/* Delete Confirmation Dialog */}
      {deleteDialogVisible && (
        <Card style={styles.deleteDialog}>
          <Card.Content>
            <Text variant="titleMedium">{t('rooms.confirmDelete.title')}</Text>
            <Text variant="bodyMedium" style={styles.deleteMessage}>
              {t('rooms.confirmDelete.message')}
            </Text>
            <View style={styles.dialogActions}>
              <Button
                mode="outlined"
                onPress={() => setDeleteDialogVisible(false)}
                disabled={isDeleting}
              >
                {t('rooms.confirmDelete.cancel')}
              </Button>
              <Button
                mode="contained"
                onPress={handleDelete}
                loading={isDeleting}
                disabled={isDeleting}
                buttonColor={theme.colors.error}
              >
                {t('rooms.confirmDelete.confirm')}
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Edit Room Modal */}
      {room && (
        <EditRoomModal
          visible={editModalVisible}
          room={room}
          onClose={() => setEditModalVisible(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backButton: {
    marginTop: 16,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roomCode: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roomName: {
    opacity: 0.8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  price: {
    fontWeight: 'bold',
  },
  tenantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    opacity: 0.7,
  },
  value: {
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    paddingVertical: 16,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
    minHeight: 44, // Minimum touch target size
  },
  deleteDialog: {
    margin: 16,
    backgroundColor: '#FFEBEE',
  },
  deleteMessage: {
    marginTop: 12,
    marginBottom: 16,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
