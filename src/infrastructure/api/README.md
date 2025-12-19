# API Infrastructure

This directory contains the API client infrastructure for the Rental Management Application.

## Overview

The API infrastructure provides:
- Axios-based HTTP client with interceptors
- TanStack Query (React Query) configuration
- Centralized error handling
- Automatic token refresh
- Retry logic with exponential backoff
- Query key factories for all entities

## Components

### API Client (`client.ts`)

The API client is a singleton Axios instance with the following features:

- **Authentication**: Automatically adds JWT tokens to requests
- **Token Refresh**: Automatically refreshes expired tokens
- **Error Handling**: Converts all errors to `AppError` instances
- **Interceptors**: Request and response interceptors for auth and error handling

**Usage:**

```typescript
import { apiClient } from '@/infrastructure/api';

// GET request
const rooms = await apiClient.get('/rooms');

// POST request
const newRoom = await apiClient.post('/rooms', roomData);

// PUT request
const updated = await apiClient.put(`/rooms/${id}`, updateData);

// DELETE request
await apiClient.delete(`/rooms/${id}`);
```

### Query Client (`queryClient.ts`)

TanStack Query client with optimized default options:

- **Stale Time**: 5 minutes
- **Cache Time**: 10 minutes
- **Retry Logic**: Smart retry based on error type
- **Refetch**: On reconnect and window focus (production only)

**Usage:**

```typescript
import { queryClient, queryClientUtils } from '@/infrastructure/api';

// Invalidate queries
await queryClientUtils.invalidateEntity('rooms');

// Clear cache
await queryClientUtils.clearCache();

// Prefetch data
await queryClientUtils.prefetch(
  roomKeys.detail('123'),
  () => apiClient.get('/rooms/123')
);
```

### Query Keys (`queryKeys.ts`)

Centralized query key factories for all entities:

- `roomKeys` - Room-related queries
- `tenantKeys` - Tenant-related queries
- `paymentKeys` - Payment-related queries
- `propertyKeys` - Property-related queries
- `notificationKeys` - Notification-related queries
- `reminderKeys` - Reminder-related queries
- `maintenanceKeys` - Maintenance-related queries
- `reportKeys` - Report-related queries
- `authKeys` - Authentication-related queries
- `dashboardKeys` - Dashboard-related queries

**Usage:**

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient, roomKeys } from '@/infrastructure/api';

// List query
const { data } = useQuery({
  queryKey: roomKeys.list({ status: 'occupied' }),
  queryFn: () => apiClient.get('/rooms', { params: { status: 'occupied' } }),
});

// Detail query
const { data } = useQuery({
  queryKey: roomKeys.detail(roomId),
  queryFn: () => apiClient.get(`/rooms/${roomId}`),
});
```

### Error Handler (`errorHandler.ts`)

Centralized error handling that converts all errors to `AppError`:

- **Network Errors**: Connection issues, timeouts
- **HTTP Errors**: 400, 401, 403, 404, 500, etc.
- **Validation Errors**: Field-level validation errors
- **Generic Errors**: Fallback for unknown errors

**Error Codes:**

- `NETWORK_ERROR` - Network connectivity issues
- `TIMEOUT_ERROR` - Request timeout
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Input validation failed
- `SERVER_ERROR` - Server-side error
- `UNKNOWN_ERROR` - Unknown error

**Usage:**

```typescript
import { handleApiError, isAuthError, AppError } from '@/infrastructure/api';

try {
  await apiClient.get('/rooms');
} catch (error) {
  const appError = handleApiError(error);
  
  if (isAuthError(appError)) {
    // Handle auth error
  }
  
  console.error(appError.message);
}
```

### Retry Logic (`retry.ts`)

Retry utility with exponential backoff:

- **Configurable**: Max retries, delays, backoff multiplier
- **Smart Retry**: Only retries appropriate errors
- **Presets**: Aggressive, standard, conservative, none

**Usage:**

```typescript
import { retryWithBackoff, retryPresets } from '@/infrastructure/api';

// Retry with default options
const data = await retryWithBackoff(
  () => apiClient.get('/rooms'),
  retryPresets.standard
);

// Custom retry options
const data = await retryWithBackoff(
  () => apiClient.get('/rooms'),
  {
    maxRetries: 5,
    initialDelay: 500,
    onRetry: (error, attempt) => {
      console.log(`Retry attempt ${attempt}: ${error.message}`);
    },
  }
);
```

### Query Provider (`QueryProvider.tsx`)

React component that provides TanStack Query context:

**Usage:**

```typescript
import { QueryProvider } from '@/infrastructure/api/QueryProvider';

function App() {
  return (
    <QueryProvider>
      <YourApp />
    </QueryProvider>
  );
}
```

## Integration

### 1. Wrap your app with QueryProvider

```typescript
// App.tsx
import { QueryProvider } from '@/infrastructure/api/QueryProvider';

export default function App() {
  return (
    <QueryProvider>
      {/* Your app components */}
    </QueryProvider>
  );
}
```

### 2. Use in components

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient, roomKeys, queryClientUtils } from '@/infrastructure/api';

function RoomList() {
  // Fetch rooms
  const { data, isLoading, error } = useQuery({
    queryKey: roomKeys.list(),
    queryFn: () => apiClient.get('/rooms'),
  });

  // Create room mutation
  const createMutation = useMutation({
    mutationFn: (roomData) => apiClient.post('/rooms', roomData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClientUtils.invalidateEntity('rooms');
    },
  });

  // ...
}
```

## Best Practices

1. **Always use query keys from factories** - Don't create ad-hoc query keys
2. **Invalidate related queries after mutations** - Keep data fresh
3. **Handle errors gracefully** - Use error boundaries and user-friendly messages
4. **Use optimistic updates** - Improve perceived performance
5. **Prefetch data when possible** - Reduce loading states
6. **Configure retry logic appropriately** - Don't retry auth or validation errors

## Testing

The API infrastructure is designed to be easily testable:

```typescript
import { apiClient } from '@/infrastructure/api';

// Mock API client in tests
jest.mock('@/infrastructure/api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Use in tests
it('should fetch rooms', async () => {
  (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });
  
  // Test your component
});
```

## Environment Variables

Required environment variables (see `.env.example`):

- `API_URL` - Base URL for API (e.g., `http://localhost:3000/api`)
- `API_TIMEOUT` - Request timeout in milliseconds (default: 30000)

## Error Handling Flow

```
Request → Interceptor (Add Auth) → API Call
                                      ↓
                                   Response
                                      ↓
                              Error? → Yes → 401?
                                      ↓         ↓
                                     No        Yes → Refresh Token
                                      ↓              ↓
                              Convert to      Success? → Retry Request
                               AppError           ↓
                                      ↓           No → Logout
                                   Throw
```

## Token Refresh Flow

```
401 Error → Is Refreshing?
               ↓
              Yes → Queue Request → Wait for Token → Retry
               ↓
              No → Set Refreshing Flag
                   ↓
              Call /auth/refresh
                   ↓
              Success? → Update Tokens → Notify Queue → Retry All
                   ↓
                  No → Logout User
```
