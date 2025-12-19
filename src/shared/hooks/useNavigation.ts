/**
 * Type-safe Navigation Hooks
 * Custom hooks for type-safe navigation throughout the app
 */

import { useNavigation as useRNNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  DashboardStackParamList,
  RoomsStackParamList,
  PaymentsStackParamList,
  ReportsStackParamList,
  SettingsStackParamList,
} from '@/shared/types/navigation';

// Root Navigation
export function useRootNavigation() {
  return useRNNavigation<NavigationProp<RootStackParamList>>();
}

// Auth Navigation
export function useAuthNavigation() {
  return useRNNavigation<NavigationProp<AuthStackParamList>>();
}

// Main Tab Navigation
export function useMainTabNavigation() {
  return useRNNavigation<NavigationProp<MainTabParamList>>();
}

// Dashboard Navigation
export function useDashboardNavigation() {
  return useRNNavigation<NavigationProp<DashboardStackParamList>>();
}

// Rooms Navigation
export function useRoomsNavigation() {
  return useRNNavigation<NavigationProp<RoomsStackParamList>>();
}

// Payments Navigation
export function usePaymentsNavigation() {
  return useRNNavigation<NavigationProp<PaymentsStackParamList>>();
}

// Reports Navigation
export function useReportsNavigation() {
  return useRNNavigation<NavigationProp<ReportsStackParamList>>();
}

// Settings Navigation
export function useSettingsNavigation() {
  return useRNNavigation<NavigationProp<SettingsStackParamList>>();
}

// Route Hooks
export function useAuthRoute<T extends keyof AuthStackParamList>() {
  return useRoute<RouteProp<AuthStackParamList, T>>();
}

export function useRoomsRoute<T extends keyof RoomsStackParamList>() {
  return useRoute<RouteProp<RoomsStackParamList, T>>();
}

export function usePaymentsRoute<T extends keyof PaymentsStackParamList>() {
  return useRoute<RouteProp<PaymentsStackParamList, T>>();
}

export function useReportsRoute<T extends keyof ReportsStackParamList>() {
  return useRoute<RouteProp<ReportsStackParamList, T>>();
}

export function useSettingsRoute<T extends keyof SettingsStackParamList>() {
  return useRoute<RouteProp<SettingsStackParamList, T>>();
}
