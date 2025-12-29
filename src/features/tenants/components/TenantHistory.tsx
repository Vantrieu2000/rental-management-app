/**
 * Tenant History Component
 * Displays the history of tenants for a room
 */

import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Divider, ActivityIndicator } from 'react-native-paper';
import { format } from 'date-fns';
import { useTenantHistory } from '../hooks/useTenants';
import { TenantHistory as TenantHistoryType } from '../types';

interface TenantHistoryProps {
  roomId: string;
}

export const TenantHistory: React.FC<TenantHistoryProps> = ({ roomId }) => {
  const { data: history, isLoading, error } = useTenantHistory(roomId);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="bodyMedium" style={styles.errorText}>
          Failed to load tenant history
        </Text>
      </View>
    );
  }

  if (!history || history.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="bodyMedium" style={styles.emptyText}>
          No tenant history available
        </Text>
      </View>
    );
  }

  const renderHistoryItem = ({ item }: { item: TenantHistoryType }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.row}>
          <Text variant="bodyMedium" style={styles.label}>
            Move-in:
          </Text>
          <Text variant="bodyMedium" style={styles.value}>
            {format(new Date(item.moveInDate), 'dd/MM/yyyy')}
          </Text>
        </View>
        {item.moveOutDate && (
          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>
              Move-out:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {format(new Date(item.moveOutDate), 'dd/MM/yyyy')}
            </Text>
          </View>
        )}
        {!item.moveOutDate && (
          <View style={styles.currentBadge}>
            <Text variant="bodySmall" style={styles.currentText}>
              Current Tenant
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Tenant History
      </Text>
      <Divider style={styles.divider} />
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  divider: {
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#666',
    flex: 1,
  },
  value: {
    flex: 1,
    fontWeight: '500',
    textAlign: 'right',
  },
  currentBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  currentText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
});
