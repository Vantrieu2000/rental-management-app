/**
 * App Entry Point
 * Root component with all providers and navigation
 */

// Note: global.css is for web only, not needed for React Native
// import './global.css';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

// Import i18n initialization
import './src/infrastructure/i18n/config';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/infrastructure/i18n/config';

// Import theme
import { lightTheme } from './src/shared/config/theme';

// Import API infrastructure
import { QueryProvider } from './src/infrastructure/api/QueryProvider';

// Import navigation
import { RootNavigator } from './src/core/navigation';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <SafeAreaProvider>
          <QueryProvider>
            <PaperProvider theme={lightTheme}>
              <NavigationContainer
                onReady={() => console.log('Navigation ready')}
                onStateChange={(state) => console.log('Navigation state changed:', state)}
                fallback={
                  <View style={styles.loadingContainer}>
                    <Text>Loading...</Text>
                  </View>
                }
              >
                <RootNavigator />
              </NavigationContainer>
              <StatusBar style="auto" />
            </PaperProvider>
          </QueryProvider>
        </SafeAreaProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d32f2f',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});
