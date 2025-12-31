/**
 * Language Selection Screen
 * Allows users to change app language
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, RadioButton, Text, Appbar, Snackbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getAvailableLanguages, getCurrentLanguage } from '@/shared/i18n';

export default function LanguageScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(getCurrentLanguage());
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const languages = getAvailableLanguages();

  const handleLanguageChange = async (languageCode: string) => {
    try {
      setSelectedLanguage(languageCode);
      await changeLanguage(languageCode);
      setSnackbarVisible(true);
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={t('settings.selectLanguage')} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Text variant="bodyMedium" style={styles.description}>
          {t('settings.changeLanguage')}
        </Text>

        <RadioButton.Group
          onValueChange={handleLanguageChange}
          value={selectedLanguage}
        >
          {languages.map((language) => (
            <List.Item
              key={language.code}
              title={language.name}
              description={language.code.toUpperCase()}
              left={() => (
                <View style={styles.flagContainer}>
                  <Text style={styles.flag}>{language.flag}</Text>
                </View>
              )}
              right={() => (
                <RadioButton value={language.code} />
              )}
              onPress={() => handleLanguageChange(language.code)}
              style={styles.languageItem}
            />
          ))}
        </RadioButton.Group>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={1500}
        style={styles.snackbar}
      >
        {t('settings.languageChanged')}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  description: {
    padding: 16,
    color: '#666',
  },
  languageItem: {
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  flagContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  flag: {
    fontSize: 32,
  },
  snackbar: {
    backgroundColor: '#4CAF50',
  },
});
