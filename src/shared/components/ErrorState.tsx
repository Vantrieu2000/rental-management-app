import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred. Please try again.',
  onRetry,
  retryLabel = 'Retry',
  fullScreen = false,
  style,
  icon,
}) => {

  return (
    <View style={[fullScreen ? styles.fullScreen : styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <Typography
        variant="h5"
        color="error"
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
      
      {onRetry && (
        <Button
          variant="contained"
          onPress={onRetry}
          style={styles.button}
        >
          {retryLabel}
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
