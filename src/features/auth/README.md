# Authentication Feature

This module implements a comprehensive authentication system for the Rental Management Application.

## Features

- ✅ Email/Password authentication
- ✅ JWT token management with automatic refresh
- ✅ Biometric authentication (fingerprint, face recognition)
- ✅ Secure token storage using Expo SecureStore
- ✅ Auto-logout on token expiration (30 minutes inactivity)
- ✅ Session restoration on app restart
- ✅ Comprehensive error handling

## Architecture

### Components

1. **Auth Store** (`/store/auth.store.ts`)
   - Zustand store managing authentication state
   - Handles user data, tokens, and authentication status
   - Provides actions for login, logout, and profile updates

2. **Auth API Client** (`/services/authApi.ts`)
   - Handles all authentication-related API calls
   - Implements login, logout, token refresh, and profile management
   - Includes timeout handling and error management

3. **Biometric Auth Service** (`/services/biometricAuth.ts`)
   - Manages biometric authentication
   - Checks device capabilities
   - Handles biometric prompts and results

4. **Token Manager** (`/services/tokenManager.ts`)
   - Manages JWT token lifecycle
   - Schedules automatic token refresh
   - Implements inactivity timeout (30 minutes)
   - Handles token expiration

5. **useAuth Hook** (`/hooks/useAuth.ts`)
   - React hook providing authentication functionality
   - Simplifies authentication operations in components
   - Handles login, logout, biometric auth, and profile updates

6. **Login Screen** (`/screens/LoginScreen.tsx`)
   - User interface for authentication
   - Email/password input with validation
   - Biometric authentication option
   - Internationalized error messages

## Usage

### Basic Login

```typescript
import { useAuth } from '@/features/auth';

function LoginComponent() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123',
    });

    if (result.success) {
      // Navigate to main app
    } else {
      // Show error message
      console.error(result.error);
    }
  };

  return (
    // Your UI
  );
}
```

### Biometric Authentication

```typescript
import { useAuth } from '@/features/auth';

function BiometricLogin() {
  const { loginWithBiometric, enableBiometric } = useAuth();

  const handleBiometricLogin = async () => {
    const result = await loginWithBiometric();
    if (result.success) {
      // User authenticated
    }
  };

  const handleEnableBiometric = async () => {
    const result = await enableBiometric();
    if (result.success) {
      // Biometric enabled
    }
  };

  return (
    // Your UI
  );
}
```

### Logout

```typescript
import { useAuth } from '@/features/auth';

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Navigate to login screen
  };

  return (
    // Your UI
  );
}
```

### Check Authentication Status

```typescript
import { useAuth } from '@/features/auth';

function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <MainApp user={user} />;
}
```

## Security Features

### Token Management
- Access tokens expire after 15 minutes (configurable)
- Refresh tokens expire after 7 days (configurable)
- Automatic token refresh 5 minutes before expiration
- Secure storage using Expo SecureStore

### Auto-Logout
- Automatic logout after 30 minutes of inactivity
- Inactivity timer resets on user interaction
- Token expiration triggers immediate logout

### Biometric Authentication
- Device capability detection
- Secure biometric prompt
- Fallback to password authentication
- User-controlled enable/disable

## API Endpoints

The authentication system expects the following API endpoints:

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

## Testing

### Property-Based Tests
Located in `__tests__/auth-failures.pbt.test.ts`

Tests authentication failure scenarios:
- Invalid credentials prevention
- Token storage on failure
- Clear error messages
- Network timeout handling
- Malformed response handling

Run with:
```bash
npm test -- src/features/auth/__tests__/auth-failures.pbt.test.ts
```

### Unit Tests
Located in `__tests__/auth.test.ts`

Tests core functionality:
- Login success/failure
- Logout
- Biometric authentication
- Profile updates
- Session restoration

Run with:
```bash
npm test -- src/features/auth/__tests__/auth.test.ts
```

## Configuration

Environment variables (in `src/shared/config/env.ts`):

```typescript
{
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000,
  jwtSecretKey: 'your-secret-key',
  tokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  enableBiometricAuth: true,
}
```

## Internationalization

The authentication system supports multiple languages (English and Vietnamese).

Translation keys are located in:
- `src/infrastructure/i18n/locales/en.json`
- `src/infrastructure/i18n/locales/vi.json`

Key translation paths:
- `auth.login.*` - Login screen text
- `auth.errors.*` - Error messages
- `auth.biometric.*` - Biometric authentication text

## Requirements Validation

This implementation satisfies the following requirements:

- **Requirement 12.1**: Authentication required before accessing features ✅
- **Requirement 12.2**: Email/password and biometric authentication support ✅
- **Requirement 12.3**: Clear error messages on authentication failure ✅
- **Requirement 12.4**: Auto-logout after 30 minutes of inactivity ✅
- **Requirement 12.5**: Secure credential storage ✅

## Future Enhancements

- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook)
- [ ] Remember me functionality
- [ ] Account lockout after failed attempts
- [ ] Password strength requirements
- [ ] Session management across devices
