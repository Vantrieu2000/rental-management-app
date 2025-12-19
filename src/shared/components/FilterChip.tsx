import React from 'react';
import { Chip, ChipProps } from 'react-native-paper';
import { StyleSheet, ViewStyle, View } from 'react-native';

interface FilterChipProps extends Omit<ChipProps, 'selected'> {
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  selected = false,
  onPress,
  style,
  ...props
}) => {
  return (
    <Chip
      selected={selected}
      onPress={onPress}
      mode={selected ? 'flat' : 'outlined'}
      style={[styles.chip, style]}
      {...props}
    />
  );
};

// Container for multiple filter chips
interface FilterChipGroupProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const FilterChipGroup: React.FC<FilterChipGroupProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[styles.chipGroup, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  } as ViewStyle,
});
