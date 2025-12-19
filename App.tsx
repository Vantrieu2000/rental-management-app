import './global.css';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

// Initialize i18n
import './src/infrastructure/i18n/config';

// Import theme
import { lightTheme } from './src/shared/config/theme';

// Import API infrastructure
import { QueryProvider } from './src/infrastructure/api/QueryProvider';

// Import components
import {
  Typography,
  Heading1,
  Button,
  Card,
  CardContent,
  Badge,
  LanguageSwitcher,
} from './src/shared/components';

export default function App() {
  const { t } = useTranslation();

  return (
    <QueryProvider>
      <PaperProvider theme={lightTheme}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <CardContent>
              <Heading1 color="primary" align="center" style={styles.title}>
                {t('common.appName', 'Rental Management')}
              </Heading1>
              
              <Typography variant="body1" align="center" style={styles.subtitle}>
                {t('common.setupComplete', 'Setup Complete!')}
              </Typography>
              
              <View style={styles.badgeContainer}>
                <Badge variant="success" size="medium">
                  {t('common.ready', 'Ready')}
                </Badge>
              </View>
              
              <LanguageSwitcher />
              
              <Button
                variant="contained"
                fullWidth
                style={styles.button}
                onPress={() => console.log('Get Started')}
              >
                {t('common.getStarted', 'Get Started')}
              </Button>
            </CardContent>
          </Card>
          <StatusBar style="auto" />
        </View>
      </PaperProvider>
    </QueryProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
  },
});
