# Property API Contract

Đây là contract API cho Property Management. Backend cần implement các endpoints này.

## Base URL
```
{API_URL}/api/properties
```

## Authentication
Tất cả requests cần header:
```
Authorization: Bearer {access_token}
```

---

## 1. Get All Properties

**Endpoint:** `GET /api/properties`

**Query Parameters:**
- `search` (optional): string - Tìm kiếm theo tên hoặc địa chỉ
- `ownerId` (optional): string - Lọc theo owner ID

**Response:** `200 OK`
```json
{
  "properties": [
    {
      "id": "string",
      "name": "string",
      "address": "string",
      "totalRooms": number,
      "defaultElectricityRate": number,
      "defaultWaterRate": number,
      "defaultGarbageRate": number,
      "defaultParkingRate": number,
      "billingDayOfMonth": number,
      "reminderDaysBefore": number,
      "ownerId": "string",
      "createdAt": "ISO 8601 date string",
      "updatedAt": "ISO 8601 date string"
    }
  ]
}
```

**Example:**
```bash
GET /api/properties?search=hòa bình
```

---

## 2. Get Property By ID

**Endpoint:** `GET /api/properties/:id`

**Response:** `200 OK`
```json
{
  "property": {
    "id": "string",
    "name": "string",
    "address": "string",
    "totalRooms": number,
    "defaultElectricityRate": number,
    "defaultWaterRate": number,
    "defaultGarbageRate": number,
    "defaultParkingRate": number,
    "billingDayOfMonth": number,
    "reminderDaysBefore": number,
    "ownerId": "string",
    "createdAt": "ISO 8601 date string",
    "updatedAt": "ISO 8601 date string"
  }
}
```

**Error:** `404 Not Found`
```json
{
  "message": "Property not found"
}
```

---

## 3. Create Property

**Endpoint:** `POST /api/properties`

**Request Body:**
```json
{
  "name": "string (required)",
  "address": "string (required)",
  "totalRooms": number (required),
  "defaultElectricityRate": number (required),
  "defaultWaterRate": number (required)",
  "defaultGarbageRate": number (required)",
  "defaultParkingRate": number (required)",
  "billingDayOfMonth": number (required, 1-31)",
  "reminderDaysBefore": number (required, 1-30)"
}
```

**Response:** `201 Created`
```json
{
  "property": {
    "id": "string",
    "name": "string",
    "address": "string",
    "totalRooms": number,
    "defaultElectricityRate": number,
    "defaultWaterRate": number,
    "defaultGarbageRate": number,
    "defaultParkingRate": number,
    "billingDayOfMonth": number,
    "reminderDaysBefore": number,
    "ownerId": "string",
    "createdAt": "ISO 8601 date string",
    "updatedAt": "ISO 8601 date string"
  }
}
```

**Example:**
```json
{
  "name": "Nhà trọ Hòa Bình",
  "address": "123 Đường Lê Lợi, Quận 1, TP.HCM",
  "totalRooms": 20,
  "defaultElectricityRate": 3500,
  "defaultWaterRate": 20000,
  "defaultGarbageRate": 30000,
  "defaultParkingRate": 100000,
  "billingDayOfMonth": 5,
  "reminderDaysBefore": 3
}
```

---

## 4. Update Property

**Endpoint:** `PUT /api/properties/:id`

**Request Body:** (Tất cả fields đều optional)
```json
{
  "name": "string",
  "address": "string",
  "totalRooms": number,
  "defaultElectricityRate": number,
  "defaultWaterRate": number,
  "defaultGarbageRate": number,
  "defaultParkingRate": number,
  "billingDayOfMonth": number,
  "reminderDaysBefore": number
}
```

**Response:** `200 OK`
```json
{
  "property": {
    "id": "string",
    "name": "string",
    "address": "string",
    "totalRooms": number,
    "defaultElectricityRate": number,
    "defaultWaterRate": number,
    "defaultGarbageRate": number,
    "defaultParkingRate": number,
    "billingDayOfMonth": number,
    "reminderDaysBefore": number,
    "ownerId": "string",
    "createdAt": "ISO 8601 date string",
    "updatedAt": "ISO 8601 date string"
  }
}
```

**Error:** `404 Not Found`
```json
{
  "message": "Property not found"
}
```

---

## 5. Delete Property

**Endpoint:** `DELETE /api/properties/:id`

**Response:** `204 No Content`

**Error:** `404 Not Found`
```json
{
  "message": "Property not found"
}
```

---

## 6. Get Property Statistics

**Endpoint:** `GET /api/properties/:id/statistics`

**Response:** `200 OK`
```json
{
  "statistics": {
    "propertyId": "string",
    "totalRooms": number,
    "occupiedRooms": number,
    "vacantRooms": number,
    "totalRevenue": number,
    "unpaidAmount": number,
    "occupancyRate": number (0-1)
  }
}
```

**Example Response:**
```json
{
  "statistics": {
    "propertyId": "1",
    "totalRooms": 20,
    "occupiedRooms": 18,
    "vacantRooms": 2,
    "totalRevenue": 54000000,
    "unpaidAmount": 6000000,
    "occupancyRate": 0.9
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "message": "You don't have permission to access this resource"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Notes for Backend Implementation

1. **Authentication**: Lấy `ownerId` từ JWT token, không từ request body
2. **Validation**: 
   - `billingDayOfMonth`: 1-31
   - `reminderDaysBefore`: 1-30
   - `totalRooms`: > 0
   - Rates: >= 0
3. **Timestamps**: Sử dụng ISO 8601 format
4. **Statistics**: Tính toán real-time từ rooms và payments data
5. **Soft Delete**: Nên implement soft delete thay vì hard delete
6. **Pagination**: Có thể thêm pagination cho GET /api/properties nếu cần

---

## Mock Data Examples

Xem file `mockPropertyApi.ts` để có ví dụ về fake data structure.
