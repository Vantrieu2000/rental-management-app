/**
 * Main Tab Navigator
 * Bottom tab navigation for main app features
 */

import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '@/shared/types/navigation';

// Stack Navigators
import DashboardStack from './DashboardStack';
import RoomsStack from './RoomsStack';
import PaymentsStack from './PaymentsStack';
import NotificationsStack from './NotificationsStack';
import ReportsStack from './ReportsStack';
import SettingsStack from './SettingsStack';

// Hooks
import { useNotificationSummary } from '@/features/notifications/hooks/useNotifications';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  // Get notification count for badge
  const { data: notificationSummary } = useNotificationSummary();
  const notificationCount = notificationSummary
    ? notificationSummary.totalUnpaid + notificationSummary.totalOverdue
    : 0;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 75,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            // Placeholder - will be replaced with actual icons
            <TabIcon name="dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="RoomsTab"
        component={RoomsStack}
        options={{
          tabBarLabel: 'Rooms',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="rooms" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PaymentsTab"
        component={PaymentsStack}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="payments" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsStack}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="notifications" color={color} size={size} />
          ),
          tabBarBadge: notificationCount > 0 ? notificationCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#D32F2F',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsStack}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="reports" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Placeholder Tab Icon Component
// Will be replaced with actual icon library (e.g., @expo/vector-icons)
function TabIcon({ name, color, size }: { name: string; color: string; size: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: size / 2,
      }}
    />
  );
}
