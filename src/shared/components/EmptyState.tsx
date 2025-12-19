import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data found',
  message = 'There are no items to display.',
  icon,
  actionLabel,
  onAction,
  fullScreen = false,
  style,
}) => {

  return (
    <View style={[fullScreen ? styles.fullScreen : styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <Typography
        variant="h5"
        color="textSecondary"
        align="center"
        style={styles.title}
      >
        {title}
      </Typography>
      
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        style={styles.message}
      >
        {message}
      </Typography>
      
      {actionLabel && onAction && (
        <Button
          variant="contained"
          onPress={onAction}
          style={styles.button}
        >
          {actionLabel}
        </Button>
      )}
    </View>
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
    padding: 20,
  },
  iconContainer: {
    marginBottom: 16,
    opacity: 0.5,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 20,
    maxWidth: 300,
  },
  button: {
    minWidth: 120,
  },
});
