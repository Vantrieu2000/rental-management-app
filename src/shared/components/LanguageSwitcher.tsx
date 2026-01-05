import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Menu } from 'react-native-paper';
import { useLanguage, type SupportedLanguage } from '@/infrastructure/i18n';

interface LanguageSwitcherProps {
  variant?: 'button' | 'menu';
}

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
};

/**
 * Language switcher component
 * Allows users to change the application language
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'menu' }) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [menuVisible, setMenuVisible] = React.useState(false);

  const handleLanguageChange = async (language: SupportedLanguage) => {
    try {
      await changeLanguage(language);
      setMenuVisible(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  if (variant === 'button') {
    return (
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={() => handleLanguageChange(currentLanguage === 'en' ? 'vi' : 'en')}
        >
          {LANGUAGE_LABELS[currentLanguage === 'en' ? 'vi' : 'en']}
        </Button>
      </View>
    );
  }

  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Button mode="outlined" onPress={() => setMenuVisible(true)}>
          {LANGUAGE_LABELS[currentLanguage]}
        </Button>
      }
    >
      <Menu.Item
        onPress={() => handleLanguageChange('en')}
        title={LANGUAGE_LABELS.en}
        leadingIcon={currentLanguage === 'en' ? 'check' : undefined}
      />
      <Menu.Item
        onPress={() => handleLanguageChange('vi')}
        title={LANGUAGE_LABELS.vi}
        leadingIcon={currentLanguage === 'vi' ? 'check' : undefined}
      />
    </Menu>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 8,
  },
});
