import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, Button, Text, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguageStore, Language } from '@/store/languageStore';

export const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage, isLoading } = useLanguageStore();
  const [menuVisible, setMenuVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLanguageChange = async (lang: Language) => {
    closeMenu();
    try {
      await setLanguage(lang);
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const getLanguageLabel = (lang: Language): string => {
    return lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English';
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="outlined"
            onPress={openMenu}
            disabled={isLoading}
            icon={() => (
              <MaterialCommunityIcons name="translate" size={20} color="#666" />
            )}
            style={styles.button}
          >
            {getLanguageLabel(language)}
          </Button>
        }
      >
        <Menu.Item
          onPress={() => handleLanguageChange('en')}
          title="🇬🇧 English"
          leadingIcon={language === 'en' ? 'check' : undefined}
        />
        <Menu.Item
          onPress={() => handleLanguageChange('vi')}
          title="🇻🇳 Tiếng Việt"
          leadingIcon={language === 'vi' ? 'check' : undefined}
        />
      </Menu>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        action={{
          label: t('common.ok'),
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {t('language.changed')}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  button: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
