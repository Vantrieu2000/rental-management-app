/**
 * Maintenance List Screen
 * Displays all maintenance requests with filtering
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text, FAB, Chip, Searchbar, ActivityIndicator } from 'react-native-paper';
import { useMaintenanceRequests } from '../hooks/useMaintenance';
import { MaintenanceCard } from '../components/MaintenanceCard';
import { MaintenanceStatus, MaintenancePriority } from '../types';
import { usePropertyStore } from '@/features/properties/store/propertyStore';

export const MaintenanceListScreen = ({ navigation }: any) => {
  const selectedPropertyId = usePropertyStore((state) => state.selectedPropertyId);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<
    MaintenancePriority | undefined
  >();

  const { data: maintenanceRequests, isLoading, refetch } = useMaintenanceRequests({
    propertyId: selectedPropertyId || undefined,
    status: statusFilter,
    priority: priorityFilter,
  });

  const filteredRequests = maintenanceRequests?.filter((request) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      request.title.toLowerCase().includes(query) ||
      request.description.toLowerCase().includes(query) ||
      request.reportedBy.toLowerCase().includes(query)
    );
  });

  const handleStatusFilter = (status: MaintenanceStatus) => {
    setStatusFilter(statusFilter === status ? undefined : status);
  };

  const handlePriorityFilter = (priority: MaintenancePriority) => {
    setPriorityFilter(priorityFilter === priority ? undefined : priority);
  };

  const renderItem = ({ item }: any) => (
    <MaintenanceCard
      maintenanceRequest={item}
      onPress={() =>
        navigation.navigate('MaintenanceDetail', { maintenanceId: item.id })
      }
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text variant="bodyLarge" style={styles.emptyText}>
        No maintenance requests found
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtext}>
        Create a new maintenance request to get started
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search maintenance requests..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.filtersContainer}>
        <Text variant="labelMedium" style={styles.filterLabel}>
          Status:
        </Text>
        <View style={styles.filterChips}>
          <Chip
            selected={statusFilter === 'pending'}
            onPress={() => handleStatusFilter('pending')}
            style={styles.filterChip}
          >
            Pending
          </Chip>
          <Chip
            selected={statusFilter === 'in_progress'}
            onPress={() => handleStatusFilter('in_progress')}
            style={styles.filterChip}
          >
            In Progress
          </Chip>
          <Chip
            selected={statusFilter === 'completed'}
            onPress={() => handleStatusFilter('completed')}
            style={styles.filterChip}
          >
            Completed
          </Chip>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <Text variant="labelMedium" style={styles.filterLabel}>
          Priority:
        </Text>
        <View style={styles.filterChips}>
          <Chip
            selected={priorityFilter === 'urgent'}
            onPress={() => handlePriorityFilter('urgent')}
            style={styles.filterChip}
          >
            Urgent
          </Chip>
          <Chip
            selected={priorityFilter === 'high'}
            onPress={() => handlePriorityFilter('high')}
            style={styles.filterChip}
          >
            High
          </Chip>
          <Chip
            selected={priorityFilter === 'medium'}
            onPress={() => handlePriorityFilter('medium')}
            style={styles.filterChip}
          >
            Medium
          </Chip>
          <Chip
            selected={priorityFilter === 'low'}
            onPress={() => handlePriorityFilter('low')}
            style={styles.filterChip}
          >
            Low
          </Chip>
        </View>
      </View>

      <FlatList
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditMaintenance')}
      />
    </View>
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterLabel: {
    marginBottom: 8,
    color: '#757575',
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    marginRight: 0,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#212121',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
