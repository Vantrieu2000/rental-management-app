import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Typography } from './Typography';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
}) => {
  const theme = useTheme();

  const getVariantStyle = (): ViewStyle => {
    const colors = theme.colors as typeof theme.colors & {
      success?: string;
      successContainer?: string;
      warning?: string;
      warningContainer?: string;
      info?: string;
      infoContainer?: string;
    };

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primaryContainer,
          borderColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondaryContainer,
          borderColor: theme.colors.secondary,
        };
      case 'success':
        return {
          backgroundColor: colors.successContainer || '#DCFCE7',
          borderColor: colors.success || '#16A34A',
        };
      case 'error':
        return {
          backgroundColor: theme.colors.errorContainer,
          borderColor: theme.colors.error,
        };
      case 'warning':
        return {
          backgroundColor: colors.warningContainer || '#FEF3C7',
          borderColor: colors.warning || '#F59E0B',
        };
      case 'info':
        return {
          backgroundColor: colors.infoContainer || '#E0F2FE',
          borderColor: colors.info || '#0EA5E9',
        };
      default:
        return {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.outline,
        };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 };
      case 'medium':
        return { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 };
      case 'large':
        return { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 };
      default:
        return { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 };
    }
  };

  const getTextVariant = () => {
    switch (size) {
      case 'small':
        return 'caption';
      case 'medium':
        return 'body2';
      case 'large':
        return 'body1';
      default:
        return 'body2';
    }
  };

  const getTextColor = () => {
    const colors = theme.colors as typeof theme.colors & {
      success?: string;
      warning?: string;
      info?: string;
    };

    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'success':
        return colors.success || '#16A34A';
      case 'error':
        return theme.colors.error;
      case 'warning':
        return colors.warning || '#F59E0B';
      case 'info':
        return colors.info || '#0EA5E9';
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  return (
    <View style={[styles.badge, getVariantStyle(), getSizeStyle(), style]}>
      <Typography
        variant={getTextVariant() as 'caption' | 'body2' | 'body1'}
        style={[{ color: getTextColor() }, styles.text, textStyle]}
      >
        {children}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  text: {
    fontWeight: '600',
  },
});
