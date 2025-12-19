import React from 'react';
import { Avatar as PaperAvatar } from 'react-native-paper';
import { ViewStyle } from 'react-native';

interface AvatarProps {
  source?: { uri: string } | number;
  label?: string;
  icon?: string;
  size?: number;
  style?: ViewStyle;
  color?: string;
  backgroundColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  label,
  icon,
  size = 40,
  style,
  color,
  backgroundColor,
}) => {
  const avatarStyle = [{ width: size, height: size, borderRadius: size / 2 }, style];

  if (source) {
    return (
      <PaperAvatar.Image
        source={source}
        size={size}
        style={avatarStyle}
      />
    );
  }

  if (icon) {
    return (
      <PaperAvatar.Icon
        icon={icon}
        size={size}
        style={[avatarStyle, backgroundColor && { backgroundColor }]}
        color={color}
      />
    );
  }

  if (label) {
    return (
      <PaperAvatar.Text
        label={label}
        size={size}
        style={[avatarStyle, backgroundColor && { backgroundColor }]}
        color={color}
      />
    );
  }

  // Default fallback
  return (
    <PaperAvatar.Icon
      icon="account"
      size={size}
      style={avatarStyle}
    />
  );
};
