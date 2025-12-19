import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { Typography } from './Typography';

interface LoadingProps {
  size?: 'small' | 'large' | number;
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  message,
  fullScreen = false,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[fullScreen ? styles.fullScreen : styles.container, style]}>
      <ActivityIndicator
        size={size}
        color={theme.colors.primary}
        animating={true}
      />
      {message && (
        <Typography
          variant="body2"
          color="textSecondary"
          style={styles.message}
        >
          {message}
        </Typography>
      )}
    </View>
  );
};

// Skeleton loader for content placeholders
interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.skeleton,
        {
          height,
          borderRadius,
          backgroundColor: theme.colors.surfaceVariant,
        },
        typeof width === 'number' ? { width } : { width: width as `${number}%` },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  message: {
    marginTop: 12,
  },
  skeleton: {
    opacity: 0.6,
  },
});
