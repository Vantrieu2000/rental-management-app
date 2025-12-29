/**
 * Reminders Screen
 * Displays and manages payment reminders
 */

import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { useReminders } from '../hooks/useReminders';
import { reminderScheduler } from '../services/reminderScheduler';
import { format } from 'date-fns';

export const RemindersScreen: React.FC = () => {
  const accessToken = 'mock-token'; // In real app, get from auth store
  const { data: reminders, isLoading, error } = useReminders(accessToken);

  useEffect(() => {
    // Request notification permissions on mount
    reminderScheduler.requestPermissions();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading reminders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error loading reminders</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Payment Reminders</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Scheduled notifications for upcoming payments
        </Text>
      </View>

      {reminders && reminders.length > 0 ? (
        reminders.map((reminder) => (
          <Card key={reminder.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Chip
                  mode="outlined"
                  style={[
                    styles.chip,
                    reminder.type === 'due_date' && styles.chipDueDate,
                    reminder.type === 'recurring' && styles.chipRecurring,
                    reminder.type === 'custom' && styles.chipCustom,
                  ]}
                >
                  {reminder.type === 'due_date' && 'Due Date'}
                  {reminder.type === 'recurring' && 'Recurring'}
                  {reminder.type === 'custom' && 'Custom'}
                </Chip>
                <Chip mode="outlined" style={styles.statusChip}>
                  {reminder.status}
                </Chip>
              </View>

              <Text variant="titleMedium" style={styles.roomInfo}>
                Room: {reminder.roomId}
              </Text>

              <Text variant="bodyMedium" style={styles.scheduleInfo}>
                Scheduled: {format(new Date(reminder.scheduledDate), 'PPp')}
              </Text>

              {reminder.intervalDays && (
                <Text variant="bodySmall" style={styles.intervalInfo}>
                  Repeats every {reminder.intervalDays} days
                </Text>
              )}
            </Card.Content>
          </Card>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text variant="bodyLarge">No reminders scheduled</Text>
          <Text variant="bodyMedium" style={styles.emptySubtext}>
            Reminders will appear here when payments are due
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 4,
    color: '#666',
  },
  card: {
    margin: 8,
    marginHorizontal: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  chipDueDate: {
    backgroundColor: '#e3f2fd',
  },
  chipRecurring: {
    backgroundColor: '#fff3e0',
  },
  chipCustom: {
    backgroundColor: '#f3e5f5',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  roomInfo: {
    marginBottom: 8,
  },
  scheduleInfo: {
    color: '#666',
    marginBottom: 4,
  },
  intervalInfo: {
    color: '#999',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptySubtext: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
});
