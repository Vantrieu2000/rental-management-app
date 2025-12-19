import React from 'react';
import { Button as PaperButton, ButtonProps as PaperButtonProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface ButtonProps extends Omit<PaperButtonProps, 'mode'> {
  variant?: 'contained' | 'outlined' | 'text';
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  fullWidth = false,
  size = 'medium',
  style,
  contentStyle,
  labelStyle,
  ...props
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { height: 36, paddingHorizontal: 12 };
      case 'medium':
        return { height: 44, paddingHorizontal: 16 };
      case 'large':
        return { height: 52, paddingHorizontal: 20 };
      default:
        return { height: 44, paddingHorizontal: 16 };
    }
  };

  const getLabelSizeStyle = () => {
    switch (size) {
      case 'small':
        return { fontSize: 13 };
      case 'medium':
        return { fontSize: 15 };
      case 'large':
        return { fontSize: 17 };
      default:
        return { fontSize: 15 };
    }
  };

  return (
    <PaperButton
      mode={variant}
      style={[fullWidth && styles.fullWidth, style]}
      contentStyle={[getSizeStyle(), contentStyle]}
      labelStyle={[getLabelSizeStyle(), labelStyle]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
});
