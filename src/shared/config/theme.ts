import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Custom color palette following Material Design 3
const customColors = {
  primary: '#2563EB', // Blue
  primaryContainer: '#DBEAFE',
  secondary: '#7C3AED', // Purple
  secondaryContainer: '#EDE9FE',
  tertiary: '#059669', // Green
  tertiaryContainer: '#D1FAE5',
  error: '#DC2626',
  errorContainer: '#FEE2E2',
  success: '#16A34A',
  successContainer: '#DCFCE7',
  warning: '#F59E0B',
  warningContainer: '#FEF3C7',
  info: '#0EA5E9',
  infoContainer: '#E0F2FE',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: customColors.primary,
    primaryContainer: customColors.primaryContainer,
    secondary: customColors.secondary,
    secondaryContainer: customColors.secondaryContainer,
    tertiary: customColors.tertiary,
    tertiaryContainer: customColors.tertiaryContainer,
    error: customColors.error,
    errorContainer: customColors.errorContainer,
    // Custom colors
    success: customColors.success,
    successContainer: customColors.successContainer,
    warning: customColors.warning,
    warningContainer: customColors.warningContainer,
    info: customColors.info,
    infoContainer: customColors.infoContainer,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60A5FA', // Lighter blue for dark mode
    primaryContainer: '#1E3A8A',
    secondary: '#A78BFA', // Lighter purple for dark mode
    secondaryContainer: '#5B21B6',
    tertiary: '#34D399', // Lighter green for dark mode
    tertiaryContainer: '#065F46',
    error: '#F87171',
    errorContainer: '#7F1D1D',
    // Custom colors
    success: '#4ADE80',
    successContainer: '#14532D',
    warning: '#FBBF24',
    warningContainer: '#78350F',
    info: '#38BDF8',
    infoContainer: '#0C4A6E',
  },
};

export type AppTheme = typeof lightTheme;
