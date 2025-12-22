/**
 * App Entry Point
 * Root component with all providers and navigation
 */

import './global.css';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

// Initialize i18n
import './src/infrastructure/i18n/config';

// Import theme
import { lightTheme } from './src/shared/config/theme';

// Import API infrastructure
import { QueryProvider } from './src/infrastructure/api/QueryProvider';

// Import navigation
import { RootNavigator } from './src/core/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <PaperProvider theme={lightTheme}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <StatusBar style="auto" />
        </PaperProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
