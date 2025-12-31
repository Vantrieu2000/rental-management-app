import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  onAddProperty: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddProperty }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="home-city-outline"
        size={80}
        color="#bdbdbd"
        style={styles.icon}
      />
      <Text variant="titleMedium" style={styles.title}>
        {t('properties.noProperties')}
      </Text>
      <Text variant="bodyMedium" style={styles.message}>
        {t('properties.addFirstProperty')}
      </Text>
      <Button
        mode="contained"
        onPress={onAddProperty}
        style={styles.button}
        icon="plus"
      >
        {t('properties.addProperty')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 300,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});
