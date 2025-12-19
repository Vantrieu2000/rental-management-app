/**
 * Connection status indicator component
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSyncStore } from '../../store/sync.store';
import { useTranslation } from 'react-i18next';

export const ConnectionStatus: React.FC = () => {
  const { t } = useTranslation();
  const { isOnline, isSyncing, pendingChanges } = useSyncStore();

  if (isOnline && !isSyncing && pendingChanges === 0) {
    return null; // Don't show anything when everything is normal
  }

  return (
    <View style={[styles.container, !isOnline && styles.offline]}>
      {!isOnline && (
        <Text style={styles.text}>
          {t('connection.offline')}
          {pendingChanges > 0 && ` • ${pendingChanges} ${t('connection.pendingChanges')}`}
        </Text>
      )}
      {isOnline && isSyncing && (
        <Text style={styles.text}>{t('connection.syncing')}</Text>
      )}
      {isOnline && !isSyncing && pendingChanges > 0 && (
        <Text style={styles.text}>
          {pendingChanges} {t('connection.pendingChanges')}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offline: {
    backgroundColor: '#FF6B6B',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
