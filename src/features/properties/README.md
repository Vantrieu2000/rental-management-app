# Property Management Feature

This feature provides comprehensive property management functionality for the rental management application.

## 🚀 Development Mode (Mock Data)

**Hiện tại app đang sử dụng MOCK DATA** - không cần backend để develop!

```typescript
// File: src/shared/config/api.config.ts
export const USE_MOCK_API = true; // ✅ Mock data enabled
```

Mock data có sẵn 3 properties mẫu để test UI. Xem chi tiết trong `services/mockPropertyApi.ts`.

### Chuyển sang Real API

Khi backend sẵn sàng:
1. Set `USE_MOCK_API = false` trong `src/shared/config/api.config.ts`
2. Set `EXPO_PUBLIC_API_URL` trong `.env`
3. Backend implement theo `services/API_CONTRACT.md`

## Overview

The Property Management feature allows users to:
- Create and manage multiple properties
- Set property-specific utility rates
- Switch between properties to filter rooms
- View aggregated statistics across all properties

## Structure

```
properties/
├── __tests__/                          # Property-based tests
│   ├── property-creation.pbt.test.ts
│   ├── property-switching.pbt.test.ts
│   ├── dashboard-aggregation.pbt.test.ts
│   └── property-specific-rates.pbt.test.ts
├── hooks/                              # TanStack Query hooks
│   └── useProperties.ts
├── screens/                            # UI screens
│   ├── PropertyListScreen.tsx
│   └── AddEditPropertyScreen.tsx
├── services/                           # API services
│   └── propertyApi.ts
├── store/                              # Zustand store
│   └── propertyStore.ts
├── types/                              # TypeScript types
│   └── index.ts
├── index.ts                            # Feature exports
└── README.md                           # This file
```

## Components

### Types (`types/index.ts`)

Defines all TypeScript interfaces for properties:
- `Property`: Main property entity
- `CreatePropertyDto`: Data for creating a property
- `UpdatePropertyDto`: Data for updating a property
- `PropertyFilters`: Filters for querying properties
- `PropertyStatistics`: Aggregated statistics for a property

### API Service (`services/propertyApi.ts`)

Handles all property-related API calls:
- `getProperties()`: Fetch all properties with optional filters
- `getPropertyById()`: Fetch a single property
- `createProperty()`: Create a new property
- `updateProperty()`: Update an existing property
- `deleteProperty()`: Delete a property
- `getPropertyStatistics()`: Get statistics for a property

### Store (`store/propertyStore.ts`)

Zustand store for managing property state:
- `selectedPropertyId`: Currently selected property
- `properties`: List of all properties
- `setSelectedProperty()`: Set the active property
- `getSelectedProperty()`: Get the currently selected property
- CRUD operations for managing properties in state

### Hooks (`hooks/useProperties.ts`)

TanStack Query hooks for data fetching and mutations:
- `useProperties()`: Fetch all properties
- `useProperty()`: Fetch a single property
- `usePropertyStatistics()`: Fetch property statistics
- `useCreateProperty()`: Create a new property
- `useUpdateProperty()`: Update a property
- `useDeleteProperty()`: Delete a property
- `useSelectedProperty()`: Get the currently selected property

### Screens

#### PropertyListScreen
Displays all properties with:
- Search functionality
- Property selection
- Quick access to add/edit
- Visual indication of selected property
- Pull-to-refresh

#### AddEditPropertyScreen
Form for creating/editing properties with:
- Form validation using Zod
- React Hook Form integration
- All property fields including:
  - Basic info (name, address, total rooms)
  - Default utility rates
  - Billing settings

## Property-Based Tests

All tests use fast-check with 100 iterations to verify correctness properties:

### Property 44: Property Creation Persists All Fields
Validates that creating a property stores all fields correctly and they can be retrieved.

### Property 45: Property Switching Filters Rooms
Validates that switching properties correctly filters rooms to show only those belonging to the selected property.

### Property 46: Dashboard Aggregates Across Properties
Validates that dashboard statistics correctly aggregate data across multiple properties.

### Property 47: Property-Specific Rates Apply Correctly
Validates that rooms use their property's specific utility rates for billing calculations.

## Usage

### Creating a Property

```typescript
import { useCreateProperty } from '@/features/properties';

const { mutate: createProperty } = useCreateProperty();

createProperty({
  name: 'Sunset Apartments',
  address: '123 Main St',
  totalRooms: 20,
  defaultElectricityRate: 3500,
  defaultWaterRate: 15000,
  defaultGarbageRate: 50000,
  defaultParkingRate: 100000,
  billingDayOfMonth: 1,
  reminderDaysBefore: 3,
});
```

### Selecting a Property

```typescript
import { usePropertyStore } from '@/features/properties';

const { setSelectedProperty } = usePropertyStore();

setSelectedProperty('property-id');
```

### Fetching Properties

```typescript
import { useProperties } from '@/features/properties';

const { data: properties, isLoading } = useProperties({
  search: 'sunset',
});
```

## Requirements Validation

This feature validates the following requirements:

- **13.1**: Property creation persists all fields (name, address, room count, rates)
- **13.2**: Property switching filters rooms to show only those in the selected property
- **13.3**: Dashboard aggregates statistics across all properties
- **13.4**: Property-specific rates apply correctly to room billing

## Testing

Run all property tests:
```bash
npm test -- src/features/properties/__tests__
```

Run specific test:
```bash
npm test -- property-creation.pbt.test.ts
```

## Integration

The property feature integrates with:
- **Rooms**: Rooms are filtered by selected property
- **Payments**: Billing uses property-specific rates
- **Dashboard**: Statistics aggregate across properties
- **Auth**: Properties are owned by authenticated users
