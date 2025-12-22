/**
 * Room List Screen
 * Displays list of all rooms with search and filter
 */

import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  Searchbar,
  FAB,
  Chip,
  Text,
  ActivityIndicator,
  Portal,
  Modal,
} from 'react-native-paper';
import type { RoomsStackScreenProps } from '@/shared/types/navigation';
import { useSearch } from '@/shared/hooks/useSearch';
import HighlightedText from '@/shared/components/HighlightedText';
import FilterSheet from '@/features/rooms/components/FilterSheet';
import type { RoomWithTenant } from '@/features/rooms/types';

type Props = RoomsStackScreenProps<'RoomList'>;

// Mock data for demonstration
const MOCK_ROOMS: RoomWithTenant[] = [
  {
    id: '1',
    propertyId: 'prop1',
    roomCode: 'A101',
    roomName: 'Room A101',
    status: 'occupied',
    rentalPrice: 3000000,
    electricityFee: 200000,
    waterFee: 100000,
    garbageFee: 50000,
    parkingFee: 150000,
    createdAt: new Date(),
    updatedAt: new Date(),
    tenant: {
      id: 't1',
      name: 'Nguyen Van A',
      phone: '0901234567',
    },
  },
  {
    id: '2',
    propertyId: 'prop1',
    roomCode: 'A102',
    roomName: 'Room A102',
    status: 'vacant',
    rentalPrice: 3500000,
    electricityFee: 200000,
    waterFee: 100000,
    garbageFee: 50000,
    parkingFee: 150000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    propertyId: 'prop1',
    roomCode: 'B201',
    roomName: 'Room B201',
    status: 'occupied',
    rentalPrice: 4000000,
    electricityFee: 250000,
    waterFee: 120000,
    garbageFee: 50000,
    parkingFee: 200000,
    createdAt: new Date(),
    updatedAt: new Date(),
    tenant: {
      id: 't2',
      name: 'Tran Thi B',
      phone: '0907654321',
    },
  },
];

export default function RoomListScreen({ navigation }: Props) {
  const [filterVisible, setFilterVisible] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    clearFilters,
    filteredRooms,
    hasActiveFilters,
    isSearching,
  } = useSearch(MOCK_ROOMS, {
    debounceDelay: 300,
    maxResults: 1000,
  });

  const renderRoomCard = ({ item }: { item: RoomWithTenant }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <HighlightedText
            text={item.roomCode}
            query={searchQuery}
            style={styles.roomCode}
          />
          <HighlightedText
            text={item.roomName}
            query={searchQuery}
            style={styles.roomName}
          />
        </View>
        <Chip
          mode="flat"
          style={[
            styles.statusChip,
            item.status === 'occupied' && styles.occupiedChip,
            item.status === 'vacant' && styles.vacantChip,
            item.status === 'maintenance' && styles.maintenanceChip,
          ]}
        >
          {item.status}
        </Chip>
      </View>

      {item.tenant && (
        <View style={styles.tenantInfo}>
          <Text variant="bodySmall" style={styles.label}>
            Tenant:
          </Text>
          <HighlightedText
            text={item.tenant.name}
            query={searchQuery}
            style={styles.tenantName}
          />
        </View>
      )}

      <View style={styles.priceInfo}>
        <Text variant="bodyMedium" style={styles.price}>
          {item.rentalPrice.toLocaleString('vi-VN')} VND/month
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="titleMedium">No rooms found</Text>
      {hasActiveFilters && (
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          Try adjusting your filters or search query
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search by room code, name, or tenant"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        loading={isSearching}
      />

      {/* Active Filters */}
      {hasActiveFilters && (
        <View style={styles.filterChips}>
          {filters.status && (
            <Chip
              onClose={() => updateFilters({ status: undefined })}
              style={styles.filterChip}
            >
              Status: {filters.status}
            </Chip>
          )}
          {filters.paymentStatus && (
            <Chip
              onClose={() => updateFilters({ paymentStatus: undefined })}
              style={styles.filterChip}
            >
              Payment: {filters.paymentStatus}
            </Chip>
          )}
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <Chip
              onClose={() =>
                updateFilters({ minPrice: undefined, maxPrice: undefined })
              }
              style={styles.filterChip}
            >
              Price Range
            </Chip>
          )}
          <Chip onPress={clearFilters} style={styles.clearChip}>
            Clear All
          </Chip>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text variant="bodyMedium">
          {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Room List */}
      <FlatList
        data={filteredRooms}
        renderItem={renderRoomCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter FAB */}
      <FAB
        icon="filter-variant"
        label="Filter"
        onPress={() => setFilterVisible(true)}
        style={styles.filterFab}
      />

      {/* Add Room FAB */}
      <FAB
        icon="plus"
        onPress={() => navigation.navigate('AddRoom')}
        style={styles.addFab}
      />

      {/* Filter Modal */}
      <Portal>
        <Modal
          visible={filterVisible}
          onDismiss={() => setFilterVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <FilterSheet
            filters={filters}
            onApplyFilters={updateFilters}
            onClose={() => setFilterVisible(false)}
          />
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  clearChip: {
    backgroundColor: '#ffebee',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  roomCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  roomName: {
    fontSize: 14,
    color: '#666',
  },
  statusChip: {
    height: 28,
  },
  occupiedChip: {
    backgroundColor: '#E8F5E9',
  },
  vacantChip: {
    backgroundColor: '#FFF3E0',
  },
  maintenanceChip: {
    backgroundColor: '#FFEBEE',
  },
  tenantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#666',
    marginRight: 8,
  },
  tenantName: {
    fontSize: 14,
    color: '#212121',
  },
  priceInfo: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptySubtext: {
    marginTop: 8,
    color: '#666',
  },
  filterFab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
  },
  addFab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
});
