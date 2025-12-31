import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Button, ActivityIndicator, Banner } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useProperties } from '../hooks/useProperties';
import { Property, PropertyStatistics } from '../types';
import { PropertyCard } from './PropertyCard';
import { PropertyStatistics as PropertyStatisticsComponent } from './PropertyStatistics';
import { EmptyState } from './EmptyState';

interface PropertiesSectionProps {
  onAddProperty: () => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (property: Property) => void;
}

export const PropertiesSection: React.FC<PropertiesSectionProps> = ({
  onAddProperty,
  onEditProperty,
  onDeleteProperty,
}) => {
  const { t } = useTranslation();
  const {
    data: properties = [],
    isLoading,
    isError,
    refetch,
  } = useProperties();
  
  // Calculate statistics from properties data (no extra API call)
  const statistics = useMemo<PropertyStatistics>(() => {
    return {
      totalProperties: properties.length,
      totalRooms: properties.reduce((sum, p) => sum + p.totalRooms, 0),
      totalOccupiedRooms: properties.reduce((sum, p) => sum + (p.occupiedRooms || 0), 0),
      totalVacantRooms: properties.reduce((sum, p) => sum + (p.vacantRooms || 0), 0),
    };
  }, [properties]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Loading state
  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            {t('properties.title')}
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  // Error state
  if (isError && !properties.length) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            {t('properties.title')}
          </Text>
        </View>
        <Banner
          visible
          icon="alert-circle"
          actions={[
            {
              label: t('common.retry'),
              onPress: () => refetch(),
            },
          ]}
        >
          {t('properties.errors.loadFailed')}
        </Banner>
      </View>
    );
  }

  // Empty state
  if (!properties.length && !isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            {t('properties.title')}
          </Text>
        </View>
        <EmptyState onAddProperty={onAddProperty} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          {t('properties.title')}
        </Text>
        <Button
          mode="contained"
          onPress={onAddProperty}
          icon="plus"
          compact
        >
          {t('properties.addProperty')}
        </Button>
      </View>

      {statistics && (
        <PropertyStatisticsComponent
          statistics={statistics}
          isLoading={isLoading}
        />
      )}

      {isError && (
        <Banner
          visible
          icon="alert-circle"
          style={styles.errorBanner}
        >
          {t('properties.errors.loadFailed')}
        </Banner>
      )}

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onEdit={onEditProperty}
            onDelete={onDeleteProperty}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorBanner: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
