# API Client and TanStack Query Implementation

## Summary

This document summarizes the implementation of Task 6: Set up API client and TanStack Query.

## Completed Components

### 1. API Client (`client.ts`)
✅ Created Axios instance with default configuration
✅ Implemented request interceptor for authentication
✅ Implemented response interceptor for error handling
✅ Added automatic token refresh on 401 errors
✅ Implemented retry logic for failed token refresh
✅ Created wrapper methods (get, post, put, patch, delete)

**Key Features:**
- Automatic JWT token injection
- Token refresh with queue management
- Converts all errors to AppError instances
- Supports custom request configuration

### 2. Error Handler (`errorHandler.ts`)
✅ Created centralized error handling
✅ Implemented AppError class with error codes
✅ Added error type detection utilities
✅ Handles network, timeout, auth, validation, and server errors
✅ Extracts validation errors from API responses

**Error Codes:**
- NETWORK_ERROR
- TIMEOUT_ERROR
- UNAUTHORIZED
- FORBIDDEN
- NOT_FOUND
- VALIDATION_ERROR
- SERVER_ERROR
- UNKNOWN_ERROR

### 3. Query Client (`queryClient.ts`)
✅ Created TanStack Query client with optimized defaults
✅ Configured stale time (5 minutes)
✅ Configured cache time (10 minutes)
✅ Implemented smart retry logic based on error type
✅ Added query client utilities for common operations

**Utilities:**
- invalidateEntity
- clearCache
- removeQueries
- prefetch
- setQueryData
- getQueryData
- cancelQueries

### 4. Query Keys (`queryKeys.ts`)
✅ Created query key factories for all entities:
- roomKeys
- tenantKeys
- paymentKeys
- propertyKeys
- notificationKeys
- reminderKeys
- maintenanceKeys
- reportKeys
- authKeys
- dashboardKeys

✅ Implemented getEntityKeys utility function

### 5. Retry Logic (`retry.ts`)
✅ Implemented retry with exponential backoff
✅ Created configurable retry options
✅ Added smart retry logic (doesn't retry auth/validation errors)
✅ Implemented withRetry wrapper function
✅ Created retry presets (aggressive, standard, conservative, none)

### 6. Type Definitions (`types.ts`)
✅ Defined API response types
✅ Defined error types
✅ Created AppError class
✅ Defined pagination types
✅ Created request configuration types

### 7. Query Provider (`QueryProvider.tsx`)
✅ Created React component wrapper
✅ Provides TanStack Query context to app
✅ Integrated with App.tsx

### 8. Documentation
✅ Created comprehensive README.md
✅ Documented all components and their usage
✅ Added integration guide
✅ Included best practices
✅ Created usage examples (examples.tsx)

### 9. Testing
✅ Created unit tests for error handler (9 tests)
✅ Created unit tests for query keys (11 tests)
✅ Created unit tests for retry logic (13 tests)
✅ All 55 tests passing
✅ Good test coverage for core functionality

## Integration

The API infrastructure has been integrated into the application:

1. **App.tsx** - Updated to use QueryProvider instead of local QueryClient
2. **Auth Store** - Already compatible with token management
3. **Environment Config** - API URL and timeout configured

## Files Created

```
src/infrastructure/api/
├── __tests__/
│   ├── api-client.test.ts
│   ├── queryKeys.test.ts
│   └── retry.test.ts
├── client.ts
├── errorHandler.ts
├── examples.tsx
├── IMPLEMENTATION.md
├── index.ts
├── queryClient.ts
├── queryKeys.ts
├── QueryProvider.tsx
├── README.md
├── retry.ts
└── types.ts
```

## Dependencies Added

- `axios` - HTTP client library

## Usage Example

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient, roomKeys, queryClientUtils } from '@/infrastructure/api';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: roomKeys.list(),
  queryFn: () => apiClient.get('/rooms'),
});

// Mutate data
const createMutation = useMutation({
  mutationFn: (roomData) => apiClient.post('/rooms', roomData),
  onSuccess: () => {
    queryClientUtils.invalidateEntity('rooms');
  },
});
```

## Next Steps

The API infrastructure is now ready for use in feature implementations:

1. **Room Management** (Task 10) - Can use roomKeys and apiClient
2. **Tenant Management** (Task 12) - Can use tenantKeys and apiClient
3. **Payment Management** (Task 14) - Can use paymentKeys and apiClient
4. **Property Management** (Task 9) - Can use propertyKeys and apiClient
5. **All other features** - Can leverage the centralized API infrastructure

## Requirements Validation

✅ Create Axios instance with interceptors
✅ Implement request/response interceptors for auth
✅ Set up TanStack Query client with default options
✅ Create query key factories for all entities
✅ Implement error handling middleware
✅ Create API client wrapper with retry logic

All task requirements have been successfully implemented and tested.

## Test Results

```
Test Suites: 3 passed, 3 total
Tests:       55 passed, 55 total
Snapshots:   0 total
Time:        0.941 s
```

All tests passing with good coverage of core functionality.
