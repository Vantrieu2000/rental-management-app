// Load environment variables từ file .env
import 'dotenv/config';

// Fallback to .env if .env.development doesn't exist
if (!process.env.API_URL) {
  require('dotenv').config({ path: '.env' });
}

console.log('📋 Loading Expo config with API_URL:', process.env.API_URL);

module.exports = {
  expo: {
    name: "Rental Management",
    slug: "rental-management-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.rental.management"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.rental.management"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      // Load từ environment variables
      apiUrl: process.env.API_URL || "https://rental-api.melidev.id.vn",
      apiTimeout: parseInt(process.env.API_TIMEOUT || "30000", 10),
      jwtSecretKey: process.env.JWT_SECRET_KEY || "dev-secret-key",
      tokenExpiry: process.env.TOKEN_EXPIRY || "30m",
      refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
      mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/rental-management",
      appName: process.env.APP_NAME || "Rental Management",
      defaultLanguage: process.env.DEFAULT_LANGUAGE || "vi",
      defaultCurrency: process.env.DEFAULT_CURRENCY || "VND",
      enableBiometricAuth: process.env.ENABLE_BIOMETRIC_AUTH === "true",
      enableOfflineMode: process.env.ENABLE_OFFLINE_MODE === "true",
      enableAnalytics: process.env.ENABLE_ANALYTICS === "true",
      debugMode: process.env.DEBUG_MODE === "true",
      logLevel: process.env.LOG_LEVEL || "info",
      // AdMob Configuration
      admobBannerIdAndroid: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID || "ca-app-pub-3940256099942544/6300978111",
      admobBannerIdIos: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_IOS || "ca-app-pub-3940256099942544/2934735716",
      // Bank Information for QR Code
      bankName: process.env.EXPO_PUBLIC_BANK_NAME || "Vietcombank",
      bankAccountNumber: process.env.EXPO_PUBLIC_BANK_ACCOUNT_NUMBER || "",
      bankAccountName: process.env.EXPO_PUBLIC_BANK_ACCOUNT_NAME || "",
      bankBin: process.env.EXPO_PUBLIC_BANK_BIN || "970436",
      eas: {
        projectId: "aab403db-3ce9-4333-b17d-27f011e4e19a"
      }
    },
    plugins: [
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID || "ca-app-pub-3940256099942544~3347511713",
          iosAppId: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || "ca-app-pub-3940256099942544~1458002511"
        }
      ]
    ]
  }
};
