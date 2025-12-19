# Testing Guide

This document describes the testing infrastructure and best practices for the Rental Management Application.

## Testing Stack

- **Jest**: Test runner and assertion library
- **React Native Testing Library**: Component testing utilities
- **fast-check**: Property-based testing library

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only property-based tests
npm run test:pbt
```

## Test Types

### Unit Tests

Unit tests verify specific functionality of individual components, functions, or modules.

**Location**: `__tests__` folders or `.test.ts(x)` files

**Example**:

```typescript
import { calculateTotalFees } from '../fee-calculator';

describe('calculateTotalFees', () => {
  it('should sum all fee components', () => {
    const fees = {
      rental: 3000000,
      electricity: 200000,
      water: 100000,
    };
    expect(calculateTotalFees(fees)).toBe(3300000);
  });
});
```

### Property-Based Tests

Property-based tests verify universal properties across many randomly generated inputs.

**Location**: `.pbt.test.ts(x)` files

**Configuration**: Each test runs 100 iterations by default

**Example**:

```typescript
import fc from 'fast-check';
import { runPropertyTest, roomCodeArbitrary } from '@shared/utils/pbt-utils';

/**
 * Feature: rental-management-app, Property 5: Room codes are unique
 * Validates: Requirements 1.5
 */
it('should enforce unique room codes', async () => {
  await runPropertyTest(fc.array(roomCodeArbitrary(), { minLength: 2 }), (roomCodes) => {
    const uniqueCodes = new Set(roomCodes);
    return uniqueCodes.size === roomCodes.length;
  });
});
```

## Test Utilities

### Custom Render

Use the custom `render` function from `@shared/utils/test-utils` to render components with all necessary providers:

```typescript
import { render, screen } from '@shared/utils/test-utils';

it('should render component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeTruthy();
});
```

### Custom Matchers

The following custom matchers are available:

- `toBeValidRoomCode()`: Validates room code format
- `toBeValidPhoneNumber()`: Validates Vietnamese phone number format
- `toBeValidEmail()`: Validates email format
- `toBePositiveAmount()`: Validates positive monetary amounts
- `toBeValidDate()`: Validates Date objects

**Example**:

```typescript
expect('A101').toBeValidRoomCode();
expect(1000000).toBePositiveAmount();
```

### PBT Arbitraries

Pre-built generators for common data types:

- `roomCodeArbitrary()`: Generates valid room codes
- `roomNameArbitrary()`: Generates room names
- `phoneNumberArbitrary()`: Generates Vietnamese phone numbers
- `emailArbitrary()`: Generates email addresses
- `monetaryAmountArbitrary()`: Generates monetary amounts
- `roomStatusArbitrary()`: Generates room statuses
- `paymentStatusArbitrary()`: Generates payment statuses
- `paymentMethodArbitrary()`: Generates payment methods
- And more...

## Path Aliases

The following path aliases are configured:

- `@/*`: Maps to `src/*`
- `@features/*`: Maps to `src/features/*`
- `@shared/*`: Maps to `src/shared/*`
- `@infrastructure/*`: Maps to `src/infrastructure/*`
- `@store/*`: Maps to `src/store/*`
- `@app/*`: Maps to `src/app/*`

**Example**:

```typescript
import { render } from '@shared/utils/test-utils';
import { useAuthStore } from '@store/auth.store';
import { RoomCard } from '@features/rooms/components/RoomCard';
```

## Best Practices

1. **Test Naming**: Use descriptive test names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
3. **Isolation**: Each test should be independent and not rely on other tests
4. **Coverage**: Aim for high coverage but focus on meaningful tests
5. **Property Tests**: Use property-based tests for universal properties
6. **Unit Tests**: Use unit tests for specific examples and edge cases

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Continuous Integration

Tests are automatically run on:

- Pull requests
- Commits to main branch
- Pre-commit hooks (optional)

## Troubleshooting

### Tests Timing Out

Increase the timeout in `jest.setup.js`:

```javascript
jest.setTimeout(30000); // 30 seconds
```

### Module Resolution Issues

Ensure path aliases are configured in:

- `tsconfig.json`
- `babel.config.js`
- `jest.config.js`

### React Native Mocking Issues

Add mocks to `jest.setup.js` for problematic modules.
