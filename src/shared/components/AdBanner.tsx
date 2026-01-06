/**
 * AdBanner Component - Native Version
 * Displays Google AdMob banner ads on iOS and Android
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface AdBannerProps {
  style?: any;
}

// Check if AdMob module is available
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;
let isAdMobAvailable = false;

try {
  const AdMobModule = require('react-native-google-mobile-ads');
  BannerAd = AdMobModule.BannerAd;
  BannerAdSize = AdMobModule.BannerAdSize;
  TestIds = AdMobModule.TestIds;
  isAdMobAvailable = true;
} catch (error) {
  console.log('AdMob module not available - using placeholder');
  isAdMobAvailable = false;
}

export function AdBanner({ style }: AdBannerProps) {
  // If AdMob is not available, show placeholder in development
  if (!isAdMobAvailable) {
    if (__DEV__) {
      return (
        <View style={[styles.container, styles.placeholder, style]}>
          <Text variant="bodySmall" style={styles.placeholderText}>
            📱 Ad Banner (Development Mode)
          </Text>
          <Text variant="bodySmall" style={styles.placeholderSubtext}>
            Run: npx expo run:android to enable ads
          </Text>
        </View>
      );
    }
    // In production, don't show anything if AdMob is not available
    return null;
  }

  // Get Ad Unit ID from environment variables
  const Constants = require('expo-constants').default;
  const Platform = require('react-native').Platform;
  
  const adUnitId = __DEV__
    ? TestIds.BANNER // Use test ID in development
    : Platform.select({
        android: Constants.expoConfig?.extra?.admobBannerIdAndroid,
        ios: Constants.expoConfig?.extra?.admobBannerIdIos,
      }) || TestIds.BANNER;

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
  },
  placeholder: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#90caf9',
  },
  placeholderText: {
    color: '#1976d2',
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderSubtext: {
    color: '#1976d2',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.7,
  },
});
