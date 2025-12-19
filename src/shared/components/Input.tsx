import React from 'react';
import { TextInput, TextInputProps, HelperText } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

interface InputProps extends Omit<TextInputProps, 'mode'> {
  variant?: 'outlined' | 'flat';
  helperText?: string;
  errorText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  variant = 'outlined',
  helperText,
  errorText,
  fullWidth = true,
  style,
  error,
  ...props
}) => {
  const hasError = error || !!errorText;

  return (
    <View style={[fullWidth && styles.fullWidth, styles.container]}>
      <TextInput
        mode={variant}
        error={hasError}
        style={[fullWidth && styles.fullWidth, style]}
        {...props}
      />
      {(helperText || errorText) && (
        <HelperText type={hasError ? 'error' : 'info'} visible={true}>
          {errorText || helperText}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  fullWidth: {
    width: '100%',
  },
});
