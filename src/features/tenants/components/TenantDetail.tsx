/**
 * Tenant Detail Component
 * Displays detailed information about a tenant
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Divider, Chip } from 'react-native-paper';
import { format } from 'date-fns';
import { Tenant } from '../types';

interface TenantDetailProps {
  tenant: Tenant;
}

export const TenantDetail: React.FC<TenantDetailProps> = ({ tenant }) => {
  const isActive = !tenant.moveOutDate;

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <Chip
            mode="flat"
            style={[styles.statusChip, isActive ? styles.activeChip : styles.inactiveChip]}
            textStyle={styles.statusText}
          >
            {isActive ? 'Active' : 'Moved Out'}
          </Chip>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Basic Information
          </Text>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>
              Name:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {tenant.name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>
              Phone:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {tenant.phone}
            </Text>
          </View>
          {tenant.email && (
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                Email:
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                {tenant.email}
              </Text>
            </View>
          )}
          {tenant.idNumber && (
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                ID Number:
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                {tenant.idNumber}
              </Text>
            </View>
          )}
        </View>

        <Divider style={styles.divider} />

        {/* Rental Information */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Rental Information
          </Text>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>
              Move-in Date:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {format(new Date(tenant.moveInDate), 'dd/MM/yyyy')}
            </Text>
          </View>
          {tenant.moveOutDate && (
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                Move-out Date:
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                {format(new Date(tenant.moveOutDate), 'dd/MM/yyyy')}
              </Text>
            </View>
          )}
        </View>

        {/* Emergency Contact */}
        {tenant.emergencyContact && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Emergency Contact
              </Text>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.label}>
                  Name:
                </Text>
                <Text variant="bodyMedium" style={styles.value}>
                  {tenant.emergencyContact.name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.label}>
                  Phone:
                </Text>
                <Text variant="bodyMedium" style={styles.value}>
                  {tenant.emergencyContact.phone}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.label}>
                  Relationship:
                </Text>
                <Text variant="bodyMedium" style={styles.value}>
                  {tenant.emergencyContact.relationship}
                </Text>
              </View>
            </View>
          </>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  statusContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusChip: {
    height: 32,
  },
  activeChip: {
    backgroundColor: '#E8F5E9',
  },
  inactiveChip: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#666',
    flex: 1,
  },
  value: {
    flex: 2,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 16,
  },
});
