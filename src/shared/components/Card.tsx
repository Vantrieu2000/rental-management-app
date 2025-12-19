import React from 'react';
import { Card as PaperCard, CardProps as PaperCardProps } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

interface CardProps extends Omit<PaperCardProps, 'elevation'> {
  elevation?: number;
  padding?: number;
  variant?: 'elevated' | 'outlined' | 'filled';
}

export const Card: React.FC<CardProps> = ({
  elevation = 2,
  padding = 16,
  variant = 'elevated',
  style,
  children,
  ...props
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return { elevation };
      case 'outlined':
        return { elevation: 0, borderWidth: 1, borderColor: '#E5E7EB' };
      case 'filled':
        return { elevation: 0 };
      default:
        return { elevation };
    }
  };

  return (
    <PaperCard
      style={[styles.card, getVariantStyle(), { padding }, style]}
      {...props}
    >
      {children}
    </PaperCard>
  );
};

// Card sub-components
export const CardTitle = PaperCard.Title;
export const CardContent = PaperCard.Content;
export const CardCover = PaperCard.Cover;
export const CardActions = PaperCard.Actions;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
});
