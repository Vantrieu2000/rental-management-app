import * as fc from 'fast-check';
import * as SecureStore from 'expo-secure-store';
import i18n, { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../config';

// Mock SecureStore
jest.mock('expo-secure-store');

/**
 * Feature: rental-management-app, Property 27: Language preference persists
 * Validates: Requirements 7.3
 *
 * This property verifies that language selection persists across app restarts.
 * For any supported language, selecting it should store the preference and
 * retrieve the same language on subsequent initialization (round-trip property).
 */
describe('Property 27: Language preference persists', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should persist language preference when changed (storage round-trip)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...SUPPORTED_LANGUAGES),
        async (selectedLanguage: SupportedLanguage) => {
          // Mock storage
          let storedValue: string | null = null;

          (SecureStore.setItemAsync as jest.Mock).mockImplementation(
            async (_key: string, value: string) => {
              storedValue = value;
              return Promise.resolve();
            }
          );

          (SecureStore.getItemAsync as jest.Mock).mockImplementation(async (_key: string) => {
            return Promise.resolve(storedValue);
          });

          // Step 1: Change language (this should persist it)
          await i18n.changeLanguage(selectedLanguage);

          // Step 2: Verify it was stored
          expect(SecureStore.setItemAsync).toHaveBeenCalledWith('app_language', selectedLanguage);

          // Step 3: Retrieve the stored value (simulating app restart)
          const retrievedLanguage = await SecureStore.getItemAsync('app_language');

          // Step 4: Verify round-trip - retrieved language should match selected language
          expect(retrievedLanguage).toBe(selectedLanguage);

          // Step 5: Verify i18n current language matches
          expect(i18n.language).toBe(selectedLanguage);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should store language preference for all supported languages', async () => {
    // Test each supported language explicitly
    for (const language of SUPPORTED_LANGUAGES) {
      let storedValue: string | null = null;

      (SecureStore.setItemAsync as jest.Mock).mockImplementation(
        async (_key: string, value: string) => {
          storedValue = value;
          return Promise.resolve();
        }
      );

      (SecureStore.getItemAsync as jest.Mock).mockImplementation(async (_key: string) => {
        return Promise.resolve(storedValue);
      });

      // Change to this language
      await i18n.changeLanguage(language);

      // Verify storage was called
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('app_language', language);

      // Verify we can retrieve it
      const retrieved = await SecureStore.getItemAsync('app_language');
      expect(retrieved).toBe(language);
    }
  });

  it('should handle language switching multiple times', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.constantFrom(...SUPPORTED_LANGUAGES), { minLength: 2, maxLength: 10 }),
        async (languageSequence: SupportedLanguage[]) => {
          let storedValue: string | null = null;

          (SecureStore.setItemAsync as jest.Mock).mockImplementation(
            async (_key: string, value: string) => {
              storedValue = value;
              return Promise.resolve();
            }
          );

          (SecureStore.getItemAsync as jest.Mock).mockImplementation(async (_key: string) => {
            return Promise.resolve(storedValue);
          });

          // Change language multiple times
          for (const language of languageSequence) {
            await i18n.changeLanguage(language);
          }

          // The stored value should be the last language in the sequence
          const lastLanguage = languageSequence[languageSequence.length - 1];
          const retrieved = await SecureStore.getItemAsync('app_language');
          expect(retrieved).toBe(lastLanguage);
          expect(i18n.language).toBe(lastLanguage);
        }
      ),
      { numRuns: 50 }
    );
  });
});
