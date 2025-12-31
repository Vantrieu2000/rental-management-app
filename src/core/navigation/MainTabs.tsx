/**
 * Main Tab Navigator
 * Bottom tab navigation for main app features
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  
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
          height: 'auto',
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: t('dashboard.title', 'Dashboard'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="RoomsTab"
        component={RoomsStack}
        options={{
          tabBarLabel: t('rooms.title', 'Rooms'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PaymentsTab"
        component={PaymentsStack}
        options={{
          tabBarLabel: t('payments.title', 'Payments'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cash-multiple" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsStack}
        options={{
          tabBarLabel: t('notifications.title', 'Notifications'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          ),
          tabBarBadge: notificationCount > 0 ? notificationCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#F44336',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
            minWidth: 18,
            height: 18,
            borderRadius: 9,
          },
        }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsStack}
        options={{
          tabBarLabel: t('reports.title', 'Reports'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          tabBarLabel: t('settings.title', 'Settings'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
