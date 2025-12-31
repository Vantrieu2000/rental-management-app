/**
 * Settings Home Screen
 * Main settings screen with options
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Divider, Avatar, Snackbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import { getCurrentLanguage, getAvailableLanguages } from '@/shared/i18n';
import type { SettingsStackScreenProps } from '@/shared/types/navigation';
import { PropertiesSection } from '@/features/properties/components/PropertiesSection';
import { PropertyFormModal } from '@/features/properties/components/PropertyFormModal';
import { DeleteConfirmationDialog } from '@/features/properties/components/DeleteConfirmationDialog';
import { useCreateProperty, useUpdateProperty, useDeleteProperty } from '@/features/properties/hooks/useProperties';
import { Property, PropertyFormData } from '@/features/properties/types';

type Props = SettingsStackScreenProps<'SettingsHome'>;

export default function SettingsHomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const currentLanguage = getCurrentLanguage();
  const languages = getAvailableLanguages();
  const currentLanguageName = languages.find(lang => lang.code === currentLanguage)?.name || 'Tiếng Việt';

  // Property form state
  const [formVisible, setFormVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>();
  
  // Delete confirmation state
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  
  // Toast state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Mutations
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  const handleLogout = async () => {
    await logout();
  };

  // Property form handlers
  const handleAddProperty = () => {
    setSelectedProperty(undefined);
    setFormVisible(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setSelectedProperty(undefined);
  };

  const handleSubmitForm = async (data: PropertyFormData) => {
    try {
      if (selectedProperty) {
        // Update existing property
        await updatePropertyMutation.mutateAsync({
          id: selectedProperty.id,
          data,
        });
        setSnackbarMessage(t('properties.success.updated'));
      } else {
        // Create new property
        await createPropertyMutation.mutateAsync(data);
        setSnackbarMessage(t('properties.success.created'));
      }
      setSnackbarVisible(true);
      handleCloseForm();
    } catch (error) {
      // Error is handled by mutation
      console.error('Property form error:', error);
    }
  };

  // Delete handlers
  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteDialogVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteDialogVisible(false);
    setPropertyToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      await deletePropertyMutation.mutateAsync(propertyToDelete.id);
      setSnackbarMessage(t('properties.success.deleted'));
      setSnackbarVisible(true);
      handleCancelDelete();
    } catch (error) {
      // Error is handled by mutation
      console.error('Property delete error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <Avatar.Text 
          size={64} 
          label={user?.name?.substring(0, 2).toUpperCase() || 'U'} 
          style={styles.avatar}
        />
        <List.Item
          title={user?.name || 'User'}
          description={user?.email || ''}
          titleStyle={styles.profileName}
          descriptionStyle={styles.profileEmail}
        />
      </View>

      <Divider />

      {/* Properties Section */}
      <View style={styles.propertiesSection}>
        <PropertiesSection
          onAddProperty={handleAddProperty}
          onEditProperty={handleEditProperty}
          onDeleteProperty={handleDeleteProperty}
        />
      </View>

      <Divider />

      {/* Settings Options */}
      <List.Section>
        <List.Subheader>{t('settings.title')}</List.Subheader>
        
        <List.Item
          key="language"
          title={t('settings.language')}
          description={currentLanguageName}
          left={props => <List.Icon {...props} icon="translate" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('Language')}
        />

        <List.Item
          key="notifications"
          title={t('settings.notifications')}
          description="Quản lý thông báo"
          left={props => <List.Icon {...props} icon="bell" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {/* TODO: Navigate to notifications settings */}}
        />

        <List.Item
          key="security"
          title={t('settings.security')}
          description="Mật khẩu và bảo mật"
          left={props => <List.Icon {...props} icon="shield-check" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {/* TODO: Navigate to security settings */}}
        />
      </List.Section>

      <Divider />

      {/* About Section */}
      <List.Section>
        <List.Subheader>{t('settings.about')}</List.Subheader>
        
        <List.Item
          key="version"
          title={t('settings.version')}
          description="1.0.0"
          left={props => <List.Icon {...props} icon="information" />}
        />
      </List.Section>

      <Divider />

      {/* Logout */}
      <List.Item
        title={t('settings.logout')}
        titleStyle={styles.logoutText}
        left={props => <List.Icon {...props} icon="logout" color="#f44336" />}
        onPress={handleLogout}
        style={styles.logoutItem}
      />

      {/* Property Form Modal */}
      <PropertyFormModal
        visible={formVisible}
        property={selectedProperty}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        isLoading={createPropertyMutation.isPending || updatePropertyMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        visible={deleteDialogVisible}
        property={propertyToDelete}
        hasRooms={propertyToDelete ? propertyToDelete.totalRooms > 0 : false}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deletePropertyMutation.isPending}
      />

      {/* Success/Error Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
    backgroundColor: '#2196F3',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  propertiesSection: {
    backgroundColor: '#fff',
    padding: 16,
    minHeight: 200,
  },
  logoutItem: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  logoutText: {
    color: '#f44336',
  },
});
