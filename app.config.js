module.exports = {
  expo: {
    name: "Rental Management",
    slug: "rental-management-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
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
      logLevel: process.env.LOG_LEVEL || "info"
    }
  }
};
