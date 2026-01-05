/**
 * RoomsScreen Component
 * Main screen for displaying and managing rooms
 */

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Searchbar, FAB, Text, ActivityIndicator, Button, Chip, Banner, Dialog, Portal, Paragraph } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRooms } from '../hooks/useRooms';
import { useDebounce } from '../hooks/useDebounce';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useProperties } from '@/features/properties/hooks/useProperties';
import { RoomCard } from '../components/RoomCard';
import { RoomCardSkeleton } from '../components/RoomCardSkeleton';
import { FilterModal } from '../components/FilterModal';
import { AddRoomModal } from '../components/AddRoomModal';
import { Room, RoomFilters } from '../types';
import { getRoomApi } from '../services/roomApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface RoomsScreenProps {
  navigation: any;
}

export function RoomsScreen({ navigation }: RoomsScreenProps) {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<RoomFilters>({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addRoomModalVisible, setAddRoomModalVisible] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [noPropertiesDialogVisible, setNoPropertiesDialogVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Network status monitoring
  const { isOffline, isConnected } = useNetworkStatus();

  // Fetch properties to check if any exist
  const { data: properties = [] } = useProperties();

  // Debounce search query to reduce API calls (300ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Combine debounced search query with filters
  const activeFilters: RoomFilters = {
    ...filters,
    searchQuery: debouncedSearchQuery || undefined,
    propertyId: properties[0]?._id || undefined,
  };

  const { data, isLoading, isError, error, refetch } = useRooms(activeFilters);

  console.log(data)

  // Auto-refresh when reconnecting to network
  useEffect(() => {
    if (isConnected && !isOffline) {
      // Connection restored - refresh data
      refetch();
      setShowOfflineBanner(false);
    } else if (isOffline) {
      // Show offline banner
      setShowOfflineBanner(true);
    }
  }, [isConnected, isOffline, refetch]);

  const handleRoomPress = (room: Room) => {
    navigation.navigate('RoomDetail', { roomId: room.id });
  };

  const handleUpdatePaymentStatus = async (roomId: string, status: 'paid' | 'unpaid') => {
    if (!accessToken) {
      Alert.alert(t('common.error', 'Error'), t('auth.notAuthenticated', 'Not authenticated'));
      return;
    }

    try {
      const roomApi = getRoomApi();
      await roomApi.updateRoomPaymentStatus(accessToken, roomId, status);
      
      // Refresh room list
      await refetch();
      
      Alert.alert(
        t('common.success', 'Success'),
        t('rooms.payment.updateSuccess', 'Payment status updated successfully'),
      );
    } catch (error) {
      console.error('Failed to update payment status:', error);
      throw error;
    }
  };

  const handleAddRoom = () => {
    
    // Check if properties exist
    if (!properties || properties.length === 0) {
      console.log('No properties found, showing dialog');
      // Show dialog to inform user they need to create a property first
      setNoPropertiesDialogVisible(true);
      return;
    }

    // Use the first property as default (or let user select in future)
    const firstPropertyId = properties[0]._id;
    setSelectedPropertyId(firstPropertyId);
    setAddRoomModalVisible(true);
  };

  const handleNavigateToSettings = () => {
    setNoPropertiesDialogVisible(false);
    // Navigate to Settings tab
    navigation.navigate('SettingsTab', { screen: 'SettingsHome' });
  };

  const handleCloseNoPropertiesDialog = () => {
    setNoPropertiesDialogVisible(false);
  };

  const handleOpenFilters = () => {
    setFilterModalVisible(true);
  };

  const handleApplyFilters = (newFilters: RoomFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleRoomCreated = () => {
    refetch();
  };

  const hasActiveFilters =
    (filters.status && filters.status.length > 0) ||
    (filters.paymentStatus && filters.paymentStatus.length > 0);

  const renderRoomCard = ({ item }: { item: Room }) => (
    <RoomCard 
      room={item} 
      onPress={handleRoomPress}
      onUpdatePaymentStatus={handleUpdatePaymentStatus}
    />
  );

  const keyExtractor = (item: Room) => item.id;

  // Optimize FlatList performance with getItemLayout
  // Assuming each card has a fixed height of 180px (card height + margins)
  const getItemLayout = (_data: ArrayLike<Room> | null | undefined, index: number) => ({
    length: 180,
    offset: 180 * index,
    index,
  });

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="titleMedium">{t('rooms.noRooms')}</Text>
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

  if (isError) {
    return renderErrorState();
  }

  const rooms = data?.data || [];
  const roomCount = data?.total || 0;

  return (
    <View style={styles.container}>
      {/* Offline Banner */}
      {showOfflineBanner && (
        <Banner
          visible={showOfflineBanner}
          icon="wifi-off"
          style={styles.offlineBanner}
        >
          {t('connection.offline')}
        </Banner>
      )}

      {/* Search Bar */}
      <Searchbar
        placeholder={t('rooms.searchPlaceholder')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Active Filter Indicators */}
      {hasActiveFilters && (
        <View style={styles.filterChips}>
          {filters.status?.map((status) => (
            <Chip key={status} style={styles.filterChip} compact>
              {t(`rooms.status.${status}`)}
            </Chip>
          ))}
          {filters.paymentStatus?.map((status) => (
            <Chip key={status} style={styles.filterChip} compact>
              {t(`rooms.paymentStatus.${status}`)}
            </Chip>
          ))}
          <Chip
            onPress={handleClearFilters}
            style={styles.clearChip}
            compact
            textStyle={styles.clearChipText}
          >
            {t('common.clear', 'Clear')}
          </Chip>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text variant="bodyMedium">{t('rooms.roomsFound', { count: roomCount })}</Text>
      </View>

      {/* Room List */}
      <FlatList
        data={rooms}
        renderItem={renderRoomCard}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />

      {/* Filter FAB */}
      <FAB
        icon="filter-variant"
        label={t('common.filter')}
        onPress={handleOpenFilters}
        style={styles.filterFab}
        size="small"
        accessible={true}
        accessibilityLabel={t('common.filter')}
        accessibilityRole="button"
        accessibilityHint={t('rooms.roomList')}
      />

      {/* Add Room FAB */}
      <FAB
        icon="plus"
        onPress={handleAddRoom}
        style={styles.addFab}
        accessible={true}
        accessibilityLabel={t('rooms.addRoom')}
        accessibilityRole="button"
        accessibilityHint={t('rooms.addRoom')}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        currentFilters={filters}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
      />

      {/* Add Room Modal */}
      {selectedPropertyId && (
        <AddRoomModal
          visible={addRoomModalVisible}
          propertyId={selectedPropertyId}
          onClose={() => {
            setAddRoomModalVisible(false);
            setSelectedPropertyId(null);
          }}
          onSuccess={handleRoomCreated}
        />
      )}

      {/* No Properties Dialog */}
      <Portal>
        <Dialog visible={noPropertiesDialogVisible} onDismiss={handleCloseNoPropertiesDialog}>
          <Dialog.Icon icon="alert-circle-outline" />
          <Dialog.Title>{t('rooms.noProperties.title')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{t('rooms.noProperties.message')}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCloseNoPropertiesDialog}>{t('common.cancel')}</Button>
            <Button mode="contained" onPress={handleNavigateToSettings}>
              {t('rooms.noProperties.goToSettings')}
            </Button>
          </Dialog.Actions>
        </Dialog>
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
    marginBottom: 4,
  },
  clearChip: {
    backgroundColor: '#FFEBEE',
  },
  clearChipText: {
    color: '#C62828',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  filterFab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    minWidth: 44, // Minimum touch target size
    minHeight: 44,
  },
  addFab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    minWidth: 56, // Larger touch target for primary action
    minHeight: 56,
  },
  offlineBanner: {
    backgroundColor: '#FFF3E0',
  },
});
