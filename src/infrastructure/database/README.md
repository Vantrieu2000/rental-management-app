# Database Module - Offline Support with Realm

This module provides offline data storage and synchronization capabilities using Realm.

## Features

- **Local Data Storage**: Store Room, Tenant, Payment, and Property data locally using Realm
- **Offline Queue**: Queue changes made while offline for later synchronization
- **Automatic Sync**: Automatically sync pending changes when connection is restored
- **Connection Status**: Track online/offline status and display to users
- **Conflict Resolution**: Handle sync conflicts with retry logic

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Components  │  │   Screens    │  │    Hooks     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Sync Store                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  isOnline | isSyncing | pendingChanges | lastSyncAt │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Sync Service                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ syncPending  │  │  cacheData   │  │  getCached   │      │
│  │   Changes    │  │              │  │     Data     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Offline Queue                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ queueChange  │  │ getPending   │  │ removeChange │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Realm Database                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Rooms     │  │   Tenants    │  │   Payments   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │  Properties  │  │   Pending    │                         │
│  │              │  │   Changes    │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

## Usage

### Initialize Realm

```typescript
import { initializeRealm } from '@/infrastructure/database';

// In your app initialization
await initializeRealm();
```

### Initialize Network Listener

```typescript
import { initializeNetworkListener } from '@/store/sync.store';

// In your app initialization
const unsubscribe = initializeNetworkListener();

// Clean up on unmount
return () => unsubscribe();
```

### Cache Data from Server

```typescript
import { cacheRoom, cacheTenant } from '@/infrastructure/database';

// After fetching from API
const rooms = await api.getRooms();
rooms.forEach(room => cacheRoom(room));
```

### Get Cached Data (Offline)

```typescript
import { getCachedRooms, getCachedTenants } from '@/infrastructure/database';

// Get all cached rooms
const rooms = getCachedRooms();

// Get rooms for specific property
const propertyRooms = getCachedRooms(propertyId);
```

### Queue Changes (Offline)

```typescript
import { queueChange } from '@/infrastructure/database';
import { useSyncStore } from '@/store/sync.store';

// When making changes offline
queueChange({
  entityType: 'Room',
  entityId: room.id,
  operation: 'update',
  data: updatedRoom,
  timestamp: new Date(),
});

// Increment pending changes count
useSyncStore.getState().incrementPendingChanges();
```

### Sync Pending Changes

```typescript
import { syncPendingChanges, setApiClient } from '@/infrastructure/database';

// Set API client first
setApiClient({
  createRoom: api.createRoom,
  updateRoom: api.updateRoom,
  deleteRoom: api.deleteRoom,
  // ... other methods
});

// Sync when online
await syncPendingChanges();
```

### Display Connection Status

```typescript
import { ConnectionStatus } from '@/shared/components/ConnectionStatus';

// In your layout component
<View>
  <ConnectionStatus />
  {/* Your content */}
</View>
```

## Schemas

### Room Schema
- Stores room information with sync status
- Indexed by propertyId and status for fast queries

### Tenant Schema
- Stores tenant information with emergency contact
- Indexed by roomId for fast lookups

### Payment Record Schema
- Stores payment records with billing information
- Indexed by roomId, tenantId, propertyId, status, and dueDate

### Property Schema
- Stores property information with default rates
- Includes billing settings

### Pending Change Schema
- Stores queued changes for offline sync
- Includes retry count for failed syncs

## Sync Strategy

1. **Online Mode**: All changes go directly to server and are cached locally
2. **Offline Mode**: Changes are queued and cached locally
3. **Reconnection**: Pending changes are synced automatically
4. **Retry Logic**: Failed syncs are retried up to 3 times
5. **Conflict Resolution**: Last-write-wins strategy (can be enhanced)

## Testing

Property-based tests validate:
- Offline data access (Property 32)
- Offline change queuing (Property 33)
- Offline sync round-trip (Property 34)

## Future Enhancements

- Conflict resolution UI for manual resolution
- Selective sync (sync only specific entities)
- Background sync using background tasks
- Delta sync (only sync changed fields)
- Compression for large datasets
