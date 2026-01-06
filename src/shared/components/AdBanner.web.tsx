/**
 * AdBanner Component - Web Version
 * AdMob is not supported on web, so this is a no-op component
 */

import React from 'react';

interface AdBannerProps {
  style?: any;
}

export function AdBanner({ style }: AdBannerProps) {
  // AdMob is not supported on web
  return null;
}
