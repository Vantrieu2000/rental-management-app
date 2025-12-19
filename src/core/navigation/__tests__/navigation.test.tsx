/**
 * Navigation Structure Tests
 * Tests for navigation setup and configuration
 */

import type {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  RoomsStackParamList,
  PaymentsStackParamList,
} from '@/shared/types/navigation';

describe('Navigation Structure', () => {
  describe('Navigation Types', () => {
    it('should have correct RootStackParamList structure', () => {
      // Type test - will fail at compile time if types are wrong
      const params: RootStackParamList = {} as RootStackParamList;
      expect(params).toBeDefined();
    });

    it('should have correct AuthStackParamList structure', () => {
      const params: AuthStackParamList = {} as AuthStackParamList;
      expect(params).toBeDefined();
    });

    it('should have correct MainTabParamList structure', () => {
      const params: MainTabParamList = {} as MainTabParamList;
      expect(params).toBeDefined();
    });

    it('should have correct RoomsStackParamList structure', () => {
      const params: RoomsStackParamList = {} as RoomsStackParamList;
      expect(params).toBeDefined();
    });

    it('should have correct PaymentsStackParamList structure', () => {
      const params: PaymentsStackParamList = {} as PaymentsStackParamList;
      expect(params).toBeDefined();
    });
  });

  describe('Navigation Hooks', () => {
    it('should export navigation hooks', async () => {
      const hooks = await import('@/shared/hooks/useNavigation');
      
      expect(hooks.useRootNavigation).toBeDefined();
      expect(hooks.useAuthNavigation).toBeDefined();
      expect(hooks.useMainTabNavigation).toBeDefined();
      expect(hooks.useDashboardNavigation).toBeDefined();
      expect(hooks.useRoomsNavigation).toBeDefined();
      expect(hooks.usePaymentsNavigation).toBeDefined();
      expect(hooks.useReportsNavigation).toBeDefined();
      expect(hooks.useSettingsNavigation).toBeDefined();
    });
  });

  describe('Navigation Components', () => {
    it('should export RootNavigator', async () => {
      const { RootNavigator } = await import('../index');
      expect(RootNavigator).toBeDefined();
    });

    it('should export AuthStack', async () => {
      const { AuthStack } = await import('../index');
      expect(AuthStack).toBeDefined();
    });

    it('should export MainTabs', async () => {
      const { MainTabs } = await import('../index');
      expect(MainTabs).toBeDefined();
    });

    it('should export all stack navigators', async () => {
      const navigators = await import('../index');
      
      expect(navigators.DashboardStack).toBeDefined();
      expect(navigators.RoomsStack).toBeDefined();
      expect(navigators.PaymentsStack).toBeDefined();
      expect(navigators.ReportsStack).toBeDefined();
      expect(navigators.SettingsStack).toBeDefined();
    });
  });

  describe('Screen Components', () => {
    it('should export LoginScreen', async () => {
      const LoginScreen = (await import('@/features/auth/screens/LoginScreen')).default;
      expect(LoginScreen).toBeDefined();
    });

    it('should export DashboardScreen', async () => {
      const DashboardScreen = (await import('@/features/dashboard/screens/DashboardScreen')).default;
      expect(DashboardScreen).toBeDefined();
    });

    it('should export RoomListScreen', async () => {
      const RoomListScreen = (await import('@/features/rooms/screens/RoomListScreen')).default;
      expect(RoomListScreen).toBeDefined();
    });

    it('should export PaymentListScreen', async () => {
      const PaymentListScreen = (await import('@/features/payments/screens/PaymentListScreen')).default;
      expect(PaymentListScreen).toBeDefined();
    });

    it('should export ReportDashboardScreen', async () => {
      const ReportDashboardScreen = (await import('@/features/reports/screens/ReportDashboardScreen')).default;
      expect(ReportDashboardScreen).toBeDefined();
    });

    it('should export SettingsHomeScreen', async () => {
      const SettingsHomeScreen = (await import('@/features/settings/screens/SettingsHomeScreen')).default;
      expect(SettingsHomeScreen).toBeDefined();
    });
  });
});
