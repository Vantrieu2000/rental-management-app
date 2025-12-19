# Development Infrastructure Setup

This document describes the development infrastructure that has been configured for the Rental Management Application.

## Overview

The development infrastructure includes:

- **Code Quality**: ESLint and Prettier for consistent code style
- **Testing**: Jest, React Native Testing Library, and fast-check for comprehensive testing
- **Type Safety**: TypeScript with strict mode enabled
- **Path Aliases**: Simplified imports using @ prefixes
- **Environment Configuration**: Separate configs for development and production

## Installed Tools

### ESLint

ESLint is configured with TypeScript, React, and React Hooks support.

**Configuration**: `eslint.config.js`

**Run linting**:

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

**Rules**:

- TypeScript recommended rules
- React recommended rules
- React Hooks rules
- Prettier integration (no conflicts)

### Prettier

Prettier ensures consistent code formatting across the project.

**Configuration**: `.prettierrc`

**Run formatting**:

```bash
npm run format        # Format all files
npm run format:check  # Check formatting without changes
```

**Settings**:

- Single quotes
- 2 space indentation
- 100 character line width
- Semicolons enabled
- Trailing commas (ES5)

### Jest

Jest is the test runner with support for TypeScript and React Native.

**Configuration**: `jest.config.js`

**Run tests**:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
npm run test:pbt      # Run only property-based tests
```

**Features**:

- TypeScript support via Babel
- Path alias resolution
- Custom matchers
- React Native mocking
- Coverage reporting

### React Native Testing Library

Provides utilities for testing React Native components.

**Usage**: Import from `@shared/utils/test-utils` to get components wrapped with providers.

```typescript
import { render, screen } from '@shared/utils/test-utils';

it('should render component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeTruthy();
});
```

### fast-check

Property-based testing library for generating random test data.

**Configuration**: 100 iterations per test (as per design document)

**Usage**:

```typescript
import { runPropertyTest, roomCodeArbitrary } from '@shared/utils/pbt-utils';

it('should validate room codes', async () => {
  await runPropertyTest(roomCodeArbitrary(), (code) => {
    return /^[A-Z0-9]{3,10}$/.test(code);
  });
});
```

**Available Arbitraries**:

- `roomCodeArbitrary()` - Valid room codes
- `phoneNumberArbitrary()` - Vietnamese phone numbers
- `emailArbitrary()` - Email addresses
- `monetaryAmountArbitrary()` - Positive amounts
- `roomStatusArbitrary()` - Room statuses
- `paymentStatusArbitrary()` - Payment statuses
- And more...

## Path Aliases

The following path aliases are configured for cleaner imports:

| Alias              | Maps To                  |
| ------------------ | ------------------------ |
| `@/*`              | `src/*`                  |
| `@features/*`      | `src/features/*`         |
| `@shared/*`        | `src/shared/*`           |
| `@infrastructure/*`| `src/infrastructure/*`   |
| `@store/*`         | `src/store/*`            |
| `@app/*`           | `src/app/*`              |

**Example**:

```typescript
// Instead of:
import { Button } from '../../../shared/components/Button';

// Use:
import { Button } from '@shared/components/Button';
```

**Configuration Files**:

- `tsconfig.json` - TypeScript path mapping
- `babel.config.js` - Runtime resolution
- `jest.config.js` - Test resolution

## Environment Configuration

Environment variables are managed through `.env` files.

**Files**:

- `.env.example` - Template with all variables
- `.env.development` - Development settings
- `.env.production` - Production settings

**Access**:

```typescript
import { env } from '@shared/config/env';

console.log(env.apiUrl);
console.log(env.enableOfflineMode);
```

**Available Variables**:

- `API_URL` - Backend API endpoint
- `API_TIMEOUT` - Request timeout
- `JWT_SECRET_KEY` - JWT secret
- `MONGODB_URI` - Database connection
- `DEFAULT_LANGUAGE` - App language (vi/en)
- `ENABLE_BIOMETRIC_AUTH` - Feature flag
- `ENABLE_OFFLINE_MODE` - Feature flag
- `DEBUG_MODE` - Debug logging
- And more...

## Custom Test Utilities

### Custom Matchers

Domain-specific Jest matchers for better test readability:

```typescript
expect('A101').toBeValidRoomCode();
expect('0123456789').toBeValidPhoneNumber();
expect('test@example.com').toBeValidEmail();
expect(1000000).toBePositiveAmount();
expect(new Date()).toBeValidDate();
```

### Test Utilities

Helper functions for testing:

- `render()` - Renders components with all providers
- `runPropertyTest()` - Runs property-based tests with 100 iterations
- Various arbitraries for generating test data

## Scripts

All available npm scripts:

```bash
# Development
npm start           # Start Expo dev server
npm run android     # Run on Android
npm run ios         # Run on iOS
npm run web         # Run on web

# Testing
npm test            # Run all tests
npm run test:watch  # Watch mode
npm run test:coverage # Coverage report
npm run test:pbt    # Property-based tests only

# Code Quality
npm run lint        # Check linting
npm run lint:fix    # Fix linting issues
npm run format      # Format all files
npm run format:check # Check formatting
npm run type-check  # TypeScript type checking
```

## Continuous Integration

For CI/CD pipelines, run these commands:

```bash
npm run type-check  # Type checking
npm run lint        # Linting
npm run format:check # Format checking
npm test            # All tests
```

## Best Practices

1. **Always run tests before committing**:
   ```bash
   npm test && npm run lint
   ```

2. **Use path aliases** for imports

3. **Write property-based tests** for universal properties

4. **Write unit tests** for specific examples and edge cases

5. **Format code** before committing:
   ```bash
   npm run format
   ```

6. **Check types** regularly:
   ```bash
   npm run type-check
   ```

## Troubleshooting

### Tests failing with module resolution errors

Ensure path aliases are configured in:

- `tsconfig.json`
- `babel.config.js`
- `jest.config.js`

### ESLint errors

Run auto-fix:

```bash
npm run lint:fix
```

### Prettier conflicts with ESLint

The configuration includes `eslint-config-prettier` to prevent conflicts.

### TypeScript errors

Run type checking:

```bash
npm run type-check
```

## Next Steps

With the development infrastructure set up, you can now:

1. Start implementing features from the task list
2. Write tests for each feature
3. Use property-based testing for correctness properties
4. Maintain code quality with linting and formatting

See `TESTING.md` for detailed testing guidelines.
