import React from 'react';
import { Searchbar, SearchbarProps } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

interface SearchBarProps extends Omit<SearchbarProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  fullWidth = true,
  style,
  ...props
}) => {
  return (
    <Searchbar
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={[styles.searchBar, fullWidth && styles.fullWidth, style]}
      elevation={1}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    borderRadius: 12,
  },
  fullWidth: {
    width: '100%',
  },
});
