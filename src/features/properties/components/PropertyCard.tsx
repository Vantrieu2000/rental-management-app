import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Property, getPropertyTypeOption } from '../types';

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const propertyTypeOption = getPropertyTypeOption(property.type);

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {propertyTypeOption && (
              <IconButton
                icon={propertyTypeOption.icon}
                size={24}
                style={styles.typeIcon}
              />
            )}
            <View style={styles.titleText}>
              <Text variant="titleMedium" style={styles.name}>
                {property.name}
              </Text>
              <Text variant="bodySmall" style={styles.address}>
                {property.address}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => onEdit(property)}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => onDelete(property)}
            />
          </View>
        </View>

        <View style={styles.typeContainer}>
          <Chip mode="outlined" compact>
            {t(propertyTypeOption?.labelKey || '')}
          </Chip>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="bodySmall" style={styles.statLabel}>
              {t('properties.totalRooms')}
            </Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {property.totalRooms}
            </Text>
          </View>

          {property.occupiedRooms !== undefined && (
            <View style={styles.statItem}>
              <Text variant="bodySmall" style={styles.statLabel}>
                {t('properties.occupiedRooms')}
              </Text>
              <Text variant="titleMedium" style={[styles.statValue, styles.occupiedValue]}>
                {property.occupiedRooms}
              </Text>
            </View>
          )}

          {property.vacantRooms !== undefined && (
            <View style={styles.statItem}>
              <Text variant="bodySmall" style={styles.statLabel}>
                {t('properties.vacantRooms')}
              </Text>
              <Text variant="titleMedium" style={[styles.statValue, styles.vacantValue]}>
                {property.vacantRooms}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    margin: 0,
  },
  titleText: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
  },
  address: {
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  typeContainer: {
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
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
  statValue: {
    fontWeight: '600',
  },
  occupiedValue: {
    color: '#4caf50',
  },
  vacantValue: {
    color: '#9e9e9e',
  },
});
