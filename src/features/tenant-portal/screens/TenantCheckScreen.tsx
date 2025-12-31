/**
 * Tenant Check Screen
 * Screen for tenants to check their payment information
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Surface,
  useTheme,
  HelperText,
  IconButton,
} from 'react-native-paper';
import { useCheckPayment } from '../hooks/useTenantPortal';
import { TenantPaymentResult } from '../types';

interface TenantCheckScreenProps {
  navigation: any;
}

export function TenantCheckScreen({ navigation }: TenantCheckScreenProps) {
  const theme = useTheme();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const { mutate: checkPayment, isPending, error } = useCheckPayment();

  const validatePhone = (): boolean => {
    if (!phone.trim()) {
      setPhoneError('Vui lòng nhập số điện thoại');
      return false;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setPhoneError('Số điện thoại không hợp lệ (10-11 số)');
      return false;
    }

    setPhoneError('');
    return true;
  };

  const handleCheck = () => {
    if (!validatePhone()) {
      return;
    }

    checkPayment(
      { phone: phone.trim() },
      {
        onSuccess: (data: TenantPaymentResult[]) => {
          navigation.navigate('TenantResult', { results: data });
        },
        onError: (err: any) => {
          setPhoneError(err.message || 'Không tìm thấy thông tin. Vui lòng kiểm tra lại số điện thoại.');
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlineMedium" style={styles.title}>
            Tra Cứu Thanh Toán
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Info Card */}
        <Surface style={styles.infoCard} elevation={1}>
          <View style={styles.iconContainer}>
            <IconButton
              icon="account-search"
              size={48}
              iconColor={theme.colors.primary}
            />
          </View>
          <Text variant="titleMedium" style={styles.infoTitle}>
            Dành cho người thuê
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            Nhập số điện thoại đã đăng ký với chủ nhà để xem thông tin thanh toán của bạn
          </Text>
        </Surface>

        {/* Input Form */}
        <Surface style={styles.formCard} elevation={2}>
          <TextInput
            label="Số điện thoại"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (phoneError) setPhoneError('');
            }}
            mode="outlined"
            keyboardType="phone-pad"
            error={!!phoneError}
            disabled={isPending}
            left={<TextInput.Icon icon="phone" />}
            placeholder="0901234567"
            style={styles.input}
          />
          {phoneError ? (
            <HelperText type="error" visible={!!phoneError}>
              {phoneError}
            </HelperText>
          ) : (
            <HelperText type="info" visible={true}>
              Nhập số điện thoại 10-11 số
            </HelperText>
          )}

          {error && (
            <Surface style={styles.errorCard} elevation={0}>
              <IconButton icon="alert-circle" size={20} iconColor={theme.colors.error} />
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {(error as any).message || 'Đã xảy ra lỗi. Vui lòng thử lại.'}
              </Text>
            </Surface>
          )}

          <Button
            mode="contained"
            onPress={handleCheck}
            loading={isPending}
            disabled={isPending || !phone}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Tra Cứu
          </Button>
        </Surface>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <IconButton icon="information" size={20} iconColor={theme.colors.primary} />
          <Text variant="bodySmall" style={styles.helpText}>
            Nếu bạn chưa có số điện thoại đăng ký, vui lòng liên hệ chủ nhà để cập nhật thông tin
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
  },
  infoCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 8,
  },
  infoTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  formCard: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 4,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffebee',
    marginTop: 8,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    marginLeft: 8,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  helpText: {
    flex: 1,
    color: '#1976d2',
    lineHeight: 18,
    marginTop: 2,
  },
});
