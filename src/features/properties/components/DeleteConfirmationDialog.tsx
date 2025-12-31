import React from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal, Text, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Property } from '../types';

interface DeleteConfirmationDialogProps {
  visible: boolean;
  property: Property | null;
  hasRooms: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  visible,
  property,
  hasRooms,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  const { t } = useTranslation();

  if (!property) return null;

  const message = hasRooms
    ? t('properties.confirmDelete.messageWithRooms', { count: property.totalRooms })
    : t('properties.confirmDelete.message');

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{t('properties.confirmDelete.title')}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
          {property && (
            <Text variant="bodySmall" style={styles.propertyDetails}>
              {'\n'}
              {property.name}
              {'\n'}
              {property.address}
            </Text>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel} disabled={isLoading}>
            {t('properties.confirmDelete.cancel')}
          </Button>
          <Button
            onPress={onConfirm}
            loading={isLoading}
            disabled={isLoading}
            textColor="#d32f2f"
          >
            {t('properties.confirmDelete.confirm')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  propertyDetails: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    color: '#666',
  },
});
