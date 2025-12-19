/**
 * Navigation Types
 * Type-safe navigation parameter definitions for all navigators
 */

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Root Stack Navigator (Auth vs Main)
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Auth Stack Navigator
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  RoomsTab: NavigatorScreenParams<RoomsStackParamList>;
  PaymentsTab: NavigatorScreenParams<PaymentsStackParamList>;
  ReportsTab: NavigatorScreenParams<ReportsStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};

// Dashboard Stack
export type DashboardStackParamList = {
  Dashboard: undefined;
};

// Rooms Stack
export type RoomsStackParamList = {
  RoomList: undefined;
  RoomDetail: { roomId: string };
  AddRoom: undefined;
  EditRoom: { roomId: string };
  AssignTenant: { roomId: string };
};

// Payments Stack
export type PaymentsStackParamList = {
  PaymentList: undefined;
  RecordPayment: { roomId?: string };
  PaymentHistory: { roomId: string };
  PaymentDetail: { paymentId: string };
};

// Reports Stack
export type ReportsStackParamList = {
  ReportDashboard: undefined;
  GenerateReport: undefined;
  ReportPreview: { reportId: string };
};

// Settings Stack
export type SettingsStackParamList = {
  SettingsHome: undefined;
  Profile: undefined;
  Properties: undefined;
  PropertyDetail: { propertyId: string };
  AddProperty: undefined;
  EditProperty: { propertyId: string };
  Language: undefined;
  Notifications: undefined;
  About: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type DashboardStackScreenProps<T extends keyof DashboardStackParamList> =
  NativeStackScreenProps<DashboardStackParamList, T>;

export type RoomsStackScreenProps<T extends keyof RoomsStackParamList> = NativeStackScreenProps<
  RoomsStackParamList,
  T
>;

export type PaymentsStackScreenProps<T extends keyof PaymentsStackParamList> =
  NativeStackScreenProps<PaymentsStackParamList, T>;

export type ReportsStackScreenProps<T extends keyof ReportsStackParamList> = NativeStackScreenProps<
  ReportsStackParamList,
  T
>;

export type SettingsStackScreenProps<T extends keyof SettingsStackParamList> =
  NativeStackScreenProps<SettingsStackParamList, T>;

// Declare global types for React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
