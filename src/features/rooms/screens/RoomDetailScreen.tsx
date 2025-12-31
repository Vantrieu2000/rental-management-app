/**
 * RoomDetailScreen Component
 * Displays detailed information about a specific room with beautiful UI
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
  Surface,
  FAB,
  Dialog,
  Portal,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRoom, useDeleteRoom, useRemoveTenant } from '../hooks/useRooms';
import { StatusBadge } from '../components/StatusBadge';
import { EditRoomModal } from '../components/EditRoomModal';
import { EditTenantModal } from '../components/EditTenantModal';
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

  const { data: room, isLoading, isError, refetch } = useRoom(roomId);

  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom();
  const { mutate: removeTenant, isPending: isRemovingTenant } = useRemoveTenant();

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [removeTenantDialogVisible, setRemoveTenantDialogVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTenantModalVisible, setEditTenantModalVisible] = useState(false);

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

  const handleEditTenant = () => {
    setEditTenantModalVisible(true);
  };

  const handleRemoveTenant = () => {
    removeTenant(roomId, {
      onSuccess: () => {
        setRemoveTenantDialogVisible(false);
        refetch();
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

  // Calculate total monthly cost
  const totalMonthlyCost = room.rentalPrice + room.electricityFee + room.waterFee + room.garbageFee + room.parkingFee;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero Card with Room Info */}
        <Surface style={styles.heroCard} elevation={2}>
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <View style={styles.heroTitleContainer}>
                <Text variant="displaySmall" style={styles.roomCode}>
                  {room.roomCode}
                </Text>
                <Text variant="titleLarge" style={styles.roomName}>
                  {room.roomName}
                </Text>
              </View>
              <StatusBadge status={room.status} />
            </View>
            
            <Divider style={styles.heroDivider} />
            
            <View style={styles.priceHighlight}>
              <Text variant="labelLarge" style={styles.priceLabel}>
                {t('rooms.rentalPrice')}
              </Text>
              <Text variant="headlineLarge" style={[styles.priceValue, { color: theme.colors.primary }]}>
                {formatCurrency(room.rentalPrice, locale)}
              </Text>
              <Text variant="bodySmall" style={styles.priceSubtext}>
                /{t('common.month')}
              </Text>
            </View>
          </View>
        </Surface>

        {/* Fees Breakdown Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <IconButton icon="cash-multiple" size={24} />
              <Text variant="titleLarge" style={styles.cardTitle}>
                Chi phí hàng tháng
              </Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.feesList}>
              <View style={styles.feeItem}>
                <View style={styles.feeLeft}>
                  <IconButton icon="lightning-bolt" size={20} iconColor={theme.colors.primary} />
                  <Text variant="bodyLarge">{t('rooms.electricityFee')}</Text>
                </View>
                <Text variant="titleMedium" style={styles.feeValue}>
                  {formatCurrency(room.electricityFee, locale)}
                </Text>
              </View>

              <View style={styles.feeItem}>
                <View style={styles.feeLeft}>
                  <IconButton icon="water" size={20} iconColor="#2196F3" />
                  <Text variant="bodyLarge">{t('rooms.waterFee')}</Text>
                </View>
                <Text variant="titleMedium" style={styles.feeValue}>
                  {formatCurrency(room.waterFee, locale)}
                </Text>
              </View>

              <View style={styles.feeItem}>
                <View style={styles.feeLeft}>
                  <IconButton icon="delete" size={20} iconColor="#4CAF50" />
                  <Text variant="bodyLarge">{t('rooms.garbageFee')}</Text>
                </View>
                <Text variant="titleMedium" style={styles.feeValue}>
                  {formatCurrency(room.garbageFee, locale)}
                </Text>
              </View>

              <View style={styles.feeItem}>
                <View style={styles.feeLeft}>
                  <IconButton icon="car" size={20} iconColor="#FF9800" />
                  <Text variant="bodyLarge">{t('rooms.parkingFee')}</Text>
                </View>
                <Text variant="titleMedium" style={styles.feeValue}>
                  {formatCurrency(room.parkingFee, locale)}
                </Text>
              </View>

              <Divider style={styles.totalDivider} />

              <View style={styles.totalRow}>
                <Text variant="titleLarge" style={styles.totalLabel}>
                  Tổng cộng
                </Text>
                <Text variant="headlineSmall" style={[styles.totalValue, { color: theme.colors.primary }]}>
                  {formatCurrency(totalMonthlyCost, locale)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Tenant Information Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <IconButton icon="account" size={24} />
              <Text variant="titleLarge" style={styles.cardTitle}>
                {t('rooms.tenant.label')}
              </Text>
              {room.status === 'occupied' && room.currentTenant && (
                <View style={styles.tenantActions}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={handleEditTenant}
                  />
                  <IconButton
                    icon="account-remove"
                    size={20}
                    iconColor={theme.colors.error}
                    onPress={() => setRemoveTenantDialogVisible(true)}
                  />
                </View>
              )}
            </View>
            <Divider style={styles.divider} />

            {room.status === 'occupied' && room.currentTenant ? (
              <View style={styles.tenantInfo}>
                <View style={styles.tenantRow}>
                  <IconButton icon="account-circle" size={20} />
                  <View style={styles.tenantDetail}>
                    <Text variant="labelMedium" style={styles.tenantLabel}>
                      {t('rooms.tenant.name')}
                    </Text>
                    <Text variant="titleMedium" style={styles.tenantValue}>
                      {room.currentTenant.name}
                    </Text>
                  </View>
                </View>

                <View style={styles.tenantRow}>
                  <IconButton icon="phone" size={20} />
                  <View style={styles.tenantDetail}>
                    <Text variant="labelMedium" style={styles.tenantLabel}>
                      {t('rooms.tenant.phone')}
                    </Text>
                    <Text variant="titleMedium" style={styles.tenantValue}>
                      {room.currentTenant.phone}
                    </Text>
                  </View>
                </View>

                <View style={styles.tenantRow}>
                  <IconButton icon="calendar" size={20} />
                  <View style={styles.tenantDetail}>
                    <Text variant="labelMedium" style={styles.tenantLabel}>
                      {t('rooms.tenant.moveInDate')}
                    </Text>
                    <Text variant="titleMedium" style={styles.tenantValue}>
                      {new Date(room.currentTenant.moveInDate).toLocaleDateString(locale)}
                    </Text>
                  </View>
                </View>

                <View style={styles.tenantRow}>
                  <IconButton icon="calendar-clock" size={20} />
                  <View style={styles.tenantDetail}>
                    <Text variant="labelMedium" style={styles.tenantLabel}>
                      {t('rooms.tenant.paymentDueDate')}
                    </Text>
                    <Text variant="titleMedium" style={styles.tenantValue}>
                      Ngày {room.currentTenant.paymentDueDay} hàng tháng
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.emptyTenant}>
                <IconButton icon="account-off" size={48} iconColor={theme.colors.outline} />
                <Text variant="bodyLarge" style={styles.emptyText}>
                  {t('rooms.tenant.noTenant')}
                </Text>
                <Text variant="bodySmall" style={styles.emptySubtext}>
                  {t('rooms.tenant.roomEmpty')}
                </Text>
                <Button
                  mode="contained"
                  icon="account-plus"
                  onPress={handleEditTenant}
                  style={styles.addTenantButton}
                >
                  {t('rooms.tenant.addTenant')}
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Room Metadata Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <IconButton icon="information" size={24} />
              <Text variant="titleLarge" style={styles.cardTitle}>
                Thông tin khác
              </Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.metadataRow}>
              <Text variant="bodyMedium" style={styles.metadataLabel}>
                Ngày tạo
              </Text>
              <Text variant="bodyMedium" style={styles.metadataValue}>
                {new Date(room.createdAt).toLocaleDateString(locale)}
              </Text>
            </View>

            <View style={styles.metadataRow}>
              <Text variant="bodyMedium" style={styles.metadataLabel}>
                Cập nhật lần cuối
              </Text>
              <Text variant="bodyMedium" style={styles.metadataValue}>
                {new Date(room.updatedAt).toLocaleDateString(locale)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Delete Confirmation Dialog */}
        {deleteDialogVisible && (
          <Portal>
            <Dialog
              visible={deleteDialogVisible}
              onDismiss={() => setDeleteDialogVisible(false)}
            >
              <Dialog.Icon icon="alert-circle" size={48} color={theme.colors.error} />
              <Dialog.Title style={styles.dialogTitle}>
                {t('rooms.confirmDelete.title')}
              </Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium" style={styles.dialogMessage}>
                  {t('rooms.confirmDelete.message')}
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => setDeleteDialogVisible(false)}
                  disabled={isDeleting}
                >
                  {t('rooms.confirmDelete.cancel')}
                </Button>
                <Button
                  onPress={handleDelete}
                  loading={isDeleting}
                  disabled={isDeleting}
                  textColor={theme.colors.error}
                >
                  {t('rooms.confirmDelete.confirm')}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        )}

        {/* Remove Tenant Confirmation Dialog */}
        {removeTenantDialogVisible && (
          <Portal>
            <Dialog
              visible={removeTenantDialogVisible}
              onDismiss={() => setRemoveTenantDialogVisible(false)}
            >
              <Dialog.Icon icon="account-remove" size={48} color={theme.colors.error} />
              <Dialog.Title style={styles.dialogTitle}>
                {t('rooms.tenant.confirmRemove.title')}
              </Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium" style={styles.dialogMessage}>
                  {t('rooms.tenant.confirmRemove.message')}
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => setRemoveTenantDialogVisible(false)}
                  disabled={isRemovingTenant}
                >
                  {t('rooms.tenant.confirmRemove.cancel')}
                </Button>
                <Button
                  onPress={handleRemoveTenant}
                  loading={isRemovingTenant}
                  disabled={isRemovingTenant}
                  textColor={theme.colors.error}
                >
                  {t('rooms.tenant.confirmRemove.confirm')}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        )}

        {/* Spacing for FAB */}
        <View style={styles.fabSpacing} />
      </ScrollView>

      {/* Floating Action Buttons */}
      <FAB.Group
        open={false}
        visible
        icon="pencil"
        actions={[
          {
            icon: 'delete',
            label: t('rooms.deleteRoom'),
            onPress: () => setDeleteDialogVisible(true),
            color: theme.colors.error,
          },
          {
            icon: 'pencil',
            label: t('rooms.editRoom'),
            onPress: handleEdit,
          },
        ]}
        onStateChange={() => {}}
        onPress={handleEdit}
        fabStyle={styles.fab}
      />

      {/* Edit Room Modal */}
      {room && (
        <EditRoomModal
          visible={editModalVisible}
          room={room}
          onClose={() => setEditModalVisible(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Edit Tenant Modal */}
      {room && (
        <EditTenantModal
          visible={editTenantModalVisible}
          room={room}
          onClose={() => setEditTenantModalVisible(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
  heroCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroContent: {
    padding: 24,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroTitleContainer: {
    flex: 1,
  },
  roomCode: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roomName: {
    opacity: 0.8,
  },
  heroDivider: {
    marginVertical: 16,
  },
  priceHighlight: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    opacity: 0.7,
    marginBottom: 4,
  },
  priceValue: {
    fontWeight: 'bold',
  },
  priceSubtext: {
    opacity: 0.6,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  divider: {
    marginBottom: 16,
  },
  feesList: {
    gap: 8,
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  feeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  feeValue: {
    fontWeight: '500',
  },
  totalDivider: {
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalValue: {
    fontWeight: 'bold',
  },
  tenantInfo: {
    gap: 12,
  },
  tenantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tenantDetail: {
    flex: 1,
  },
  tenantLabel: {
    opacity: 0.7,
    marginBottom: 4,
  },
  tenantValue: {
    fontWeight: '500',
  },
  emptyTenant: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 8,
    opacity: 0.7,
  },
  emptySubtext: {
    marginTop: 4,
    opacity: 0.5,
  },
  addTenantButton: {
    marginTop: 16,
  },
  tenantActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metadataLabel: {
    opacity: 0.7,
  },
  metadataValue: {
    fontWeight: '500',
  },
  dialogTitle: {
    textAlign: 'center',
  },
  dialogMessage: {
    textAlign: 'center',
  },
  deleteDialog: {
    margin: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
  },
  deleteHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteTitle: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  deleteMessage: {
    textAlign: 'center',
    marginBottom: 24,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 12,
  },
  dialogButton: {
    flex: 1,
  },
  fabSpacing: {
    height: 80,
  },
  fab: {
    bottom: 16,
    right: 16,
  },
});
