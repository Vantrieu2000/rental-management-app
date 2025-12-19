/**
 * Property List Screen
 * Displays all properties with ability to add, edit, and select
 */

import React, { useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text, Card, FAB, Searchbar, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useProperties } from '../hooks/useProperties';
import { usePropertyStore } from '../store/propertyStore';
import { Property } from '../types';
import { useTranslation } from 'react-i18next';

export const PropertyListScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: properties, isLoading, refetch, isRefetching } = useProperties({
    search: searchQuery,
  });

  const { selectedPropertyId, setSelectedProperty } = usePropertyStore();

  const handlePropertyPress = (property: Property) => {
    setSelectedProperty(property.id);
    // Navigate back or show confirmation
  };

  const handleAddProperty = () => {
    navigation.navigate('AddEditProperty' as never);
  };

  const handleEditProperty = (property: Property) => {
    navigation.navigate('AddEditProperty' as never, { propertyId: property.id } as never);
  };

  const renderPropertyCard = ({ item }: { item: Property }) => {
    const isSelected = item.id === selectedPropertyId;

    return (
      <TouchableOpacity
        onPress={() => handlePropertyPress(item)}
        onLongPress={() => handleEditProperty(item)}
      >
        <Card
          style={[styles.card, isSelected && styles.selectedCard]}
          mode="elevated"
        >
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={styles.propertyName}>
                {item.name}
              </Text>
              {isSelected && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedText}>{t('selected')}</Text>
                </View>
              )}
            </View>

            <Text variant="bodyMedium" style={styles.address}>
              {item.address}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="bodySmall" style={styles.statLabel}>
                  {t('totalRooms')}
                </Text>
                <Text variant="titleSmall">{item.totalRooms}</Text>
              </View>

              <View style={styles.statItem}>
                <Text variant="bodySmall" style={styles.statLabel}>
                  {t('billingDay')}
                </Text>
                <Text variant="titleSmall">{item.billingDayOfMonth}</Text>
              </View>
            </View>

            <View style={styles.ratesRow}>
              <Text variant="bodySmall" style={styles.rateLabel}>
                {t('defaultRates')}:
              </Text>
              <Text variant="bodySmall">
                {t('electricity')}: {item.defaultElectricityRate} |{' '}
                {t('water')}: {item.defaultWaterRate}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  if (isLoading && !properties) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={t('searchProperties')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={properties || []}
        renderItem={renderPropertyCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">{t('noProperties')}</Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              {t('addPropertyToGetStarted')}
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddProperty}
        label={t('addProperty')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  propertyName: {
    fontWeight: 'bold',
    flex: 1,
  },
  selectedBadge: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  address: {
    color: '#666',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    marginBottom: 4,
  },
  ratesRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  rateLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptySubtext: {
    marginTop: 8,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
