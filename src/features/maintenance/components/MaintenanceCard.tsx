/**
 * MaintenanceCard Component
 * Displays a maintenance request in a card format
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, Icon } from 'react-native-paper';
import { format } from 'date-fns';
import { MaintenanceRequest } from '../types';

interface MaintenanceCardProps {
  maintenanceRequest: MaintenanceRequest;
  onPress?: () => void;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  maintenanceRequest,
  onPress,
}) => {
  const getPriorityColor = (priority: MaintenanceRequest['priority']) => {
    switch (priority) {
      case 'urgent':
        return '#F44336';
      case 'high':
        return '#FF9800';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const getStatusColor = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'in_progress':
        return '#2196F3';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#757575';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: MaintenanceRequest['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'Urgent';
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return priority;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.title}>
              {maintenanceRequest.title}
            </Text>
            <View style={styles.badges}>
              <Chip
                mode="flat"
                style={[
                  styles.chip,
                  { backgroundColor: getPriorityColor(maintenanceRequest.priority) },
                ]}
                textStyle={styles.chipText}
              >
                {getPriorityLabel(maintenanceRequest.priority)}
              </Chip>
            </View>
          </View>

          <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
            {maintenanceRequest.description}
          </Text>

          <View style={styles.info}>
            <View style={styles.infoRow}>
              <Icon source="account" size={16} color="#757575" />
              <Text variant="bodySmall" style={styles.infoText}>
                {maintenanceRequest.reportedBy}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon source="calendar" size={16} color="#757575" />
              <Text variant="bodySmall" style={styles.infoText}>
                {format(maintenanceRequest.reportedDate, 'MMM dd, yyyy')}
              </Text>
            </View>

            {maintenanceRequest.photos.length > 0 && (
              <View style={styles.infoRow}>
                <Icon source="camera" size={16} color="#757575" />
                <Text variant="bodySmall" style={styles.infoText}>
                  {maintenanceRequest.photos.length} photo(s)
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Chip
              mode="flat"
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(maintenanceRequest.status) },
              ]}
              textStyle={styles.statusChipText}
            >
              {getStatusLabel(maintenanceRequest.status)}
            </Chip>

            {maintenanceRequest.cost && (
              <Text variant="bodyMedium" style={styles.cost}>
                ${maintenanceRequest.cost.toLocaleString()}
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontWeight: '600',
  },
  badges: {
    marginLeft: 8,
  },
  chip: {
    height: 24,
  },
  chipText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  description: {
    color: '#757575',
    marginBottom: 12,
  },
  info: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    color: '#757575',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusChip: {
    height: 32,
  },
  statusChipText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cost: {
    fontWeight: '600',
    color: '#2196F3',
  },
});
