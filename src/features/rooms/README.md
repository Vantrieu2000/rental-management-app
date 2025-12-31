# Rooms Management Feature

This feature provides comprehensive room management functionality for the rental management application.

## Directory Structure

```
src/features/rooms/
├── components/          # Reusable UI components
│   └── FilterSheet.tsx  # Existing filter component
├── hooks/              # Custom React hooks for room operations
├── screens/            # Screen components
│   └── RoomListScreen.tsx  # Existing room list screen
├── services/           # API service layer
│   ├── mockRoomApi.ts  # Mock API for development
│   └── roomApi.ts      # Real API client
├── types/              # TypeScript type definitions
│   └── index.ts        # Room types and interfaces
├── utils/              # Utility functions
├── validation/         # Zod validation schemas
│   └── roomSchemas.ts  # Room form validation
└── index.ts           # Feature exports
```

## Core Types

### Room Entity
- `Room`: Complete room information including pricing, tenant, and payment status
- `CurrentTenant`: Tenant information for occupied rooms
- `RoomStatus`: 'vacant' | 'occupied' | 'maintenance'
- `PaymentStatus`: 'paid' | 'unpaid' | 'overdue'

### DTOs
- `CreateRoomDto`: Data for creating new rooms
- `UpdateRoomDto`: Data for updating existing rooms (room code is immutable)
- `RoomFilters`: Filter criteria for room list

### API Responses
- `RoomsResponse`: Paginated list of rooms
- `RoomResponse`: Single room response
- `PaymentRecord`: Payment history record

## Validation

The feature uses Zod for runtime validation:

- `createRoomSchema`: Validates room creation data
  - Room code: Uppercase letters and numbers only, max 20 chars
  - Room name: 1-100 characters
  - All fees: Non-negative numbers with reasonable max values

- `updateRoomSchema`: Validates room update data
  - All fields optional
  - Same validation rules as creation
  - Room code cannot be updated

## Requirements Coverage

This setup addresses the following requirements:
- **Requirement 1.1**: Type definitions for room list display
- **Requirement 4.3**: Validation schemas for form data

## Next Steps

1. Implement API service layer (Task 2)
2. Create internationalization support (Task 3)
3. Build UI components (Tasks 4-5)
4. Implement CRUD operations (Tasks 7-10)
