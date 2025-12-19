import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from 'react-native-paper';

interface TypographyProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'textPrimary' | 'textSecondary';
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'textPrimary',
  align = 'left',
  weight,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 };
      case 'h2':
        return { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 };
      case 'h3':
        return { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 };
      case 'h4':
        return { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 };
      case 'h5':
        return { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 };
      case 'h6':
        return { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 };
      case 'body1':
        return { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 };
      case 'body2':
        return { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 };
      case 'caption':
        return { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 };
      case 'overline':
        return { fontSize: 10, fontWeight: '500' as const, lineHeight: 14, textTransform: 'uppercase' as const };
      default:
        return { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 };
    }
  };

  const getColorStyle = () => {
    const colors = theme.colors as typeof theme.colors & {
      success?: string;
      warning?: string;
      info?: string;
    };

    switch (color) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'error':
        return theme.colors.error;
      case 'success':
        return colors.success || theme.colors.tertiary;
      case 'warning':
        return colors.warning || theme.colors.secondary;
      case 'info':
        return colors.info || theme.colors.primary;
      case 'textPrimary':
        return theme.colors.onSurface;
      case 'textSecondary':
        return theme.colors.onSurfaceVariant;
      default:
        return theme.colors.onSurface;
    }
  };

  return (
    <RNText
      style={[
        getVariantStyle(),
        { color: getColorStyle(), textAlign: align },
        weight && { fontWeight: weight },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

// Convenience components
export const Heading1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const Heading4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const Heading5: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h5" {...props} />
);

export const Heading6: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h6" {...props} />
);

export const Body1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body1" {...props} />
);

export const Body2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body2" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Overline: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="overline" {...props} />
);
