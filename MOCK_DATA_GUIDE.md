# 🎯 Mock Data Development Guide

Hướng dẫn sử dụng mock data để develop frontend mà không cần backend.

## 📋 Tổng Quan

App hiện đang sử dụng **MOCK DATA** cho tất cả features. Bạn có thể develop UI/UX hoàn chỉnh mà không cần backend!

## ✅ Features Đã Có Mock Data

### 1. ✅ Property Management (Task 9)
- **Mock Data**: 3 properties (Nhà trọ Hòa Bình, Chung cư Mini An Phú, Nhà trọ Sinh Viên)
- **Files**:
  - `src/features/properties/services/mockPropertyApi.ts`
  - `src/features/properties/API_CONTRACT.md`
- **Endpoints**: 6 endpoints (CRUD + statistics)

### 2. ✅ Room Management (Task 10)
- **Mock Data**: 11 rooms across 3 properties
- **Files**:
  - `src/features/rooms/services/mockRoomApi.ts`
  - `src/features/rooms/API_CONTRACT.md`
- **Endpoints**: 6 endpoints (CRUD + search)

### 3. 🔄 Tenant Management (Task 12) - TODO
### 4. 🔄 Payment Management (Task 14) - TODO
### 5. 🔄 Notification System (Task 16) - TODO
### 6. 🔄 Maintenance Management (Task 18) - TODO
### 7. 🔄 Reports (Task 20) - TODO

## 🚀 Quick Start

### Bật/Tắt Mock Data

```typescript
// File: src/shared/config/api.config.ts

export const API_CONFIG = {
  useMockData: {
    properties: true,  // ✅ Dùng mock
    rooms: true,       // ✅ Dùng mock
    tenants: true,     // 🔄 Chưa implement
    payments: true,    // 🔄 Chưa implement
    // ...
  },
};
```

### Sử Dụng Trong Code

```typescript
// Tự động dùng mock hoặc real API
import { useProperties } from '@/features/properties/hooks/useProperties';

function MyComponent() {
  // Nếu mock enabled → dùng mock data
  // Nếu mock disabled → call real API
  const { data: properties } = useProperties();
  
  return <PropertyList properties={properties} />;
}
```

## 📊 Mock Data Structure

### Properties (3 items)
```typescript
{
  id: '1',
  name: 'Nhà trọ Hòa Bình',
  address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
  totalRooms: 20,
  defaultElectricityRate: 3500,
  defaultWaterRate: 20000,
  defaultGarbageRate: 30000,
  defaultParkingRate: 100000,
  // ...
}
```

### Rooms (11 items)
```typescript
{
  id: 'room-1',
  propertyId: '1',
  roomCode: 'P101',
  roomName: 'Phòng 101',
  status: 'occupied',
  rentalPrice: 3000000,
  currentTenantId: 'tenant-1',
  // ...
}
```

## 🔧 Chuyển Sang Real API

### Bước 1: Tắt Mock Data
```typescript
// src/shared/config/api.config.ts
export const USE_MOCK_API = false;
```

### Bước 2: Set API URL
```bash
# .env
EXPO_PUBLIC_API_URL=https://your-backend.com/api
```

### Bước 3: Backend Implement
Backend developer implement theo các file `API_CONTRACT.md`:
- `src/features/properties/API_CONTRACT.md`
- `src/features/rooms/API_CONTRACT.md`
- ... (more to come)

### Bước 4: Test
```bash
# App tự động dùng real API
npm start
```

## 📝 Thêm Mock Data Mới

### Ví dụ: Thêm Property Mới

```typescript
// File: src/features/properties/services/mockPropertyApi.ts

let mockProperties: Property[] = [
  // ... existing properties
  {
    id: '4',
    name: 'Nhà Trọ Mới',
    address: 'Địa chỉ mới',
    totalRooms: 25,
    // ... other fields
  },
];
```

### Ví dụ: Thêm Room Mới

```typescript
// File: src/features/rooms/services/mockRoomApi.ts

let mockRooms: Room[] = [
  // ... existing rooms
  {
    id: 'room-12',
    propertyId: '1',
    roomCode: 'P301',
    roomName: 'Phòng 301',
    status: 'vacant',
    rentalPrice: 3000000,
    // ... other fields
  },
];
```

## 🧪 Testing với Mock Data

```typescript
// Tests tự động dùng mock data
describe('Property Management', () => {
  it('should fetch properties', async () => {
    const { data } = await useProperties();
    expect(data).toHaveLength(3); // 3 mock properties
  });
});
```

## 📚 API Contracts

Mỗi feature có file `API_CONTRACT.md` document chi tiết:

### Property API
- `GET /api/properties` - List all
- `GET /api/properties/:id` - Get one
- `POST /api/properties` - Create
- `PUT /api/properties/:id` - Update
- `DELETE /api/properties/:id` - Delete
- `GET /api/properties/:id/statistics` - Stats

### Room API
- `GET /api/rooms` - List all (with filters)
- `GET /api/rooms/:id` - Get one
- `POST /api/rooms` - Create
- `PUT /api/rooms/:id` - Update
- `DELETE /api/rooms/:id` - Delete
- `GET /api/rooms/search` - Search

## 🎨 Mock Data Features

### 1. Network Delay Simulation
```typescript
const delay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));
```

### 2. Error Simulation
```typescript
// Duplicate room code
if (duplicate) {
  throw new Error('Room code already exists');
}
```

### 3. Data Persistence (In-Memory)
```typescript
// Data persists during app session
let mockRooms: Room[] = [...];
```

### 4. Relationships
```typescript
// Rooms belong to Properties
room.propertyId === property.id

// Rooms have Tenants
room.currentTenantId === tenant.id
```

## 🐛 Troubleshooting

### Mock data không hiển thị?
1. Check `api.config.ts` → `useMockData.properties = true`
2. Check console logs
3. Restart app

### Muốn thêm data?
1. Edit `mockXxxApi.ts` file
2. Add to array
3. Restart app (hot reload should work)

### Backend API không work?
1. Check `.env` có `EXPO_PUBLIC_API_URL`
2. Check `api.config.ts` → `USE_MOCK_API = false`
3. Verify API contract với backend
4. Check network tab

## 📖 Documentation

Mỗi feature có README riêng:
- `src/features/properties/README.md`
- `src/features/rooms/README.md`
- ... (more to come)

## 🎯 Next Steps

1. ✅ Properties - Done
2. ✅ Rooms - Done
3. 🔄 Tenants - In Progress
4. 🔄 Payments - TODO
5. 🔄 Notifications - TODO
6. 🔄 Maintenance - TODO
7. 🔄 Reports - TODO

## 💡 Tips

1. **Develop UI First**: Dùng mock data để design UI/UX hoàn chỉnh
2. **Test Interactions**: Test tất cả user flows với mock data
3. **Document API**: API contracts giúp backend team biết cần làm gì
4. **Easy Switch**: Chỉ cần 1 config để switch sang real API
5. **No Backend Dependency**: Frontend team không bị block bởi backend

---

**Happy Coding! 🚀**
