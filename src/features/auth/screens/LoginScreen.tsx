/**
 * Login Screen
 * Integrated with real backend API and i18n
 */

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '../services/authApi';
import type { AuthStackScreenProps } from '@/shared/types/navigation';
import { AdBanner } from '@/shared/components/AdBanner';

type Props = AuthStackScreenProps<'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Call real backend API
      const response = await authApi.login({ email, password });
      
      // Map backend response to frontend format
      const user = {
        id: response.user._id,
        _id: response.user._id,
        email: response.user.email,
        name: response.user.name,
        phone: response.user.phone,
        role: response.user.role,
        language: response.user.language,
        currency: response.user.currency,
        timezone: response.user.timezone,
        biometricEnabled: response.user.biometricEnabled,
        lastLoginAt: response.user.lastLoginAt,
        createdAt: response.user.createdAt,
        updatedAt: response.user.updatedAt,
      };

      const tokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };

      await login(user, tokens);
      
      // Navigation will happen automatically via RootNavigator
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Ad Banner at top */}
      <AdBanner />
      
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              {t('common.appName', 'Quản Lý Cho Thuê')}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {t('auth.signIn')}
            </Text>

            {error ? (
              <Text variant="bodyMedium" style={styles.error}>
                {error}
              </Text>
            ) : null}

            <TextInput
              label={t('auth.email')}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              disabled={loading}
            />

            <TextInput
              label={t('auth.password')}
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              disabled={loading}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              {t('auth.login')}
            </Button>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text variant="bodySmall" style={styles.dividerText}>
                hoặc
              </Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Tenant Portal Button */}
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('TenantCheck')}
              icon="account-search"
              style={styles.tenantButton}
              labelStyle={styles.tenantButtonLabel}
            >
              Tra Cứu Thanh Toán
            </Button>
            <Text variant="bodySmall" style={styles.tenantHint}>
              Dành cho người thuê
            </Text>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#2196F3',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  error: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#f44336',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 4,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
  },
  tenantButton: {
    marginBottom: 8,
    borderColor: '#4caf50',
    borderWidth: 2,
  },
  tenantButtonLabel: {
    color: '#4caf50',
    fontWeight: '600',
  },
  tenantHint: {
    textAlign: 'center',
    color: '#4caf50',
    marginBottom: 8,
  },
  hint: {
    textAlign: 'center',
    color: '#999',
  },
});
