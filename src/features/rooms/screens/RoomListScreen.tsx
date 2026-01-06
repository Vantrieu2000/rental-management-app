/**
 * Room List Screen
 * Displays list of all rooms with search and filter
 */

import React, { useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import {
  Searchbar,
  FAB,
  Chip,
  Text,
  Button,
  Portal,
  Modal,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { RoomsStackScreenProps } from '@/shared/types/navigation';
import { useRooms } from '../hooks/useRooms';
import { useDebounce } from '../hooks/useDebounce';
import { RoomCardSkeleton } from '../components/RoomCardSkeleton';
import FilterSheet from '@/features/rooms/components/FilterSheet';
import type { Room, RoomFilters } from '@/features/rooms/types';

type Props = RoomsStackScreenProps<'RoomList'>;

export default function RoomListScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<RoomFilters>({});
  const [filterVisible, setFilterVisible] = useState(false);

  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Combine debounced search query with filters
  const activeFilters: RoomFilters = {
    ...filters,
    searchQuery: debouncedSearchQuery || undefined,
  };

  const { data, isLoading, isError, error, refetch } = useRooms(activeFilters);

  const handleApplyFilters = (newFilters: RoomFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters =
    (filters.status && filters.status.length > 0) ||
    (filters.paymentStatus && filters.paymentStatus.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  const renderRoomCard = ({ item }: { item: Room }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.roomCode}>{item.roomCode}</Text>
          <Text style={styles.roomName}>{item.roomName}</Text>
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
          {t(`rooms.status.${item.status}`)}
        </Chip>
      </View>

      {item.currentTenant && (
        <View style={styles.tenantInfo}>
          <Text variant="bodySmall" style={styles.label}>
            {t('rooms.tenant.label')}:
          </Text>
          <Text style={styles.tenantName}>{item.currentTenant.name}</Text>
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
      <Text variant="titleMedium">{t('rooms.noRooms')}</Text>
      {hasActiveFilters && (
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          {t('rooms.adjustFilters')}
        </Text>
      )}
    </View>
  );

  const renderSkeletonLoader = () => (
    <View>
      {[1, 2, 3, 4, 5].map((key) => (
        <RoomCardSkeleton key={key} />
      ))}
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Text variant="titleMedium">{t('rooms.errors.loadFailed')}</Text>
      <Text variant="bodyMedium" style={styles.errorMessage}>
        {error?.message}
      </Text>
      <Button mode="contained" onPress={() => refetch()} style={styles.retryButton}>
        {t('common.retry')}
      </Button>
    </View>
  );

  // Show loading skeleton on initial load
  if (isLoading && !data) {
    return (
      <View style={styles.container}>
        <Searchbar
          placeholder={t('rooms.searchPlaceholder')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          editable={false}
        />
        {renderSkeletonLoader()}
      </View>
    );
  }

  // Show error state
  if (isError) {
    return (
      <View style={styles.container}>
        {renderErrorState()}
      </View>
    );
  }

  const rooms = data?.data || [];
  const roomCount = data?.total || 0;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <Searchbar
        placeholder={t('rooms.searchPlaceholder')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Active Filters */}
      {hasActiveFilters && (
        <View style={styles.filterChips}>
          {filters.status?.map((status) => (
            <Chip
              key={status}
              onClose={() => {
                const newStatus = filters.status?.filter((s) => s !== status);
                handleApplyFilters({ ...filters, status: newStatus?.length ? newStatus : undefined });
              }}
              style={styles.filterChip}
            >
              {t(`rooms.status.${status}`)}
            </Chip>
          ))}
          {filters.paymentStatus?.map((status) => (
            <Chip
              key={status}
              onClose={() => {
                const newPaymentStatus = filters.paymentStatus?.filter((s) => s !== status);
                handleApplyFilters({ ...filters, paymentStatus: newPaymentStatus?.length ? newPaymentStatus : undefined });
              }}
              style={styles.filterChip}
            >
              {t(`rooms.paymentStatus.${status}`)}
            </Chip>
          ))}
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <Chip
              onClose={() =>
                handleApplyFilters({ ...filters, minPrice: undefined, maxPrice: undefined })
              }
              style={styles.filterChip}
            >
              {t('rooms.priceRange')}
            </Chip>
          )}
          <Chip onPress={handleClearFilters} style={styles.clearChip}>
            {t('common.clear')}
          </Chip>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text variant="bodyMedium">
          {t('rooms.roomsFound', { count: roomCount })}
        </Text>
      </View>

      {/* Room List */}
      <FlatList
        data={rooms}
        renderItem={renderRoomCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />

      {/* Filter FAB */}
      <FAB
        icon="filter-variant"
        label={t('common.filter')}
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
            onApplyFilters={(newFilters) => {
              handleApplyFilters(newFilters);
              setFilterVisible(false);
            }}
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
    height: 32,
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
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorMessage: {
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
  retryButton: {
    marginTop: 8,
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
