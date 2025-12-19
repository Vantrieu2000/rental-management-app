# Rental Management Application

A comprehensive rental property management mobile application built with React Native and Expo.

## Technology Stack

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript (strict mode)
- **UI Library**: React Native Paper (Material Design 3)
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Server State**: TanStack Query (React Query v5)
- **Client State**: Zustand
- **Navigation**: React Navigation v6
- **Secure Storage**: Expo SecureStore

## Project Structure

```
rental-management-app/
├── src/
│   ├── app/                          # App entry and providers
│   ├── features/                     # Feature-based modules
│   │   ├── auth/
│   │   ├── rooms/
│   │   ├── payments/
│   │   ├── tenants/
│   │   ├── notifications/
│   │   ├── reports/
│   │   ├── properties/
│   │   └── maintenance/
│   ├── shared/                       # Shared utilities
│   │   ├── components/               # Reusable UI components
│   │   ├── hooks/                    # Common hooks
│   │   ├── utils/                    # Helper functions
│   │   ├── constants/                # App constants
│   │   ├── types/                    # Shared types
│   │   └── config/                   # Configuration
│   ├── infrastructure/               # External integrations
│   │   ├── api/                      # API client setup
│   │   ├── database/                 # Realm schemas
│   │   ├── storage/                  # Secure storage
│   │   └── i18n/                     # Translations
│   └── store/                        # Global state
├── assets/                           # Static assets
└── __tests__/                        # Test files
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Core Dependencies

- `@react-navigation/native` - Navigation framework
- `@react-navigation/bottom-tabs` - Bottom tab navigation
- `@react-navigation/native-stack` - Stack navigation
- `@tanstack/react-query` - Server state management
- `zustand` - Client state management
- `nativewind` - Tailwind CSS for React Native
- `react-native-paper` - Material Design components
- `expo-secure-store` - Secure storage for sensitive data

## Configuration

### TypeScript

The project is configured with TypeScript strict mode enabled. See `tsconfig.json` for details.

### NativeWind

NativeWind is configured to use Tailwind CSS classes in React Native. The configuration is in:

- `tailwind.config.js` - Tailwind configuration
- `metro.config.js` - Metro bundler configuration
- `babel.config.js` - Babel configuration
- `global.css` - Global styles

### TanStack Query

TanStack Query is configured with default options:

- Retry: 2 attempts
- Stale time: 5 minutes
- Cache time: 10 minutes

## Development

This project follows Clean Architecture principles with clear separation of concerns:

- **Presentation Layer**: React Native components and screens
- **Application Layer**: Business logic and state management
- **Domain Layer**: Entities and domain rules
- **Infrastructure Layer**: API clients and external services

## License

MIT
