# Room API Contract

Backend API contract cho Room Management.

## Base URL
```
{API_URL}/api/rooms
```

## Authentication
```
Authorization: Bearer {access_token}
```

---

## 1. Get All Rooms

**Endpoint:** `GET /api/rooms`

**Query Parameters:**
- `propertyId` (optional): string - Filter by property
- `status` (optional): 'vacant' | 'occupied' | 'maintenance'
- `search` (optional): string - Search by room code or name
- `paymentStatus` (optional): 'paid' | 'unpaid'
- `minPrice` (optional): number
- `maxPrice` (optional): number

**Response:** `200 OK`
```json
{
  "rooms": [
    {
      "id": "string",
      "propertyId": "string",
      "roomCode": "string",
      "roomName": "string",
      "status": "vacant" | "occupied" | "maintenance",
      "rentalPrice": number,
      "electricityFee": number,
      "waterFee": number,
      "garbageFee": number,
      "parkingFee": number,
      "currentTenantId": "string | null",
      "createdAt": "ISO 8601",
      "updatedAt": "ISO 8601"
    }
  ]
}
```

---

## 2. Get Room By ID

**Endpoint:** `GET /api/rooms/:id`

**Response:** `200 OK`
```json
{
  "room": {
    "id": "string",
    "propertyId": "string",
    "roomCode": "string",
    "roomName": "string",
    "status": "occupied",
    "rentalPrice": 3000000,
    "electricityFee": 3500,
    "waterFee": 20000,
    "garbageFee": 30000,
    "parkingFee": 100000,
    "currentTenantId": "tenant-1",
    "tenant": {
      "id": "tenant-1",
      "name": "Nguyễn Văn A",
      "phone": "0901234567"
    },
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
}
```

---

## 3. Create Room

**Endpoint:** `POST /api/rooms`

**Request Body:**
```json
{
  "propertyId": "string (required)",
  "roomCode": "string (required, unique per property)",
  "roomName": "string (required)",
  "rentalPrice": number (required, >= 0),
  "electricityFee": number (required, >= 0),
  "waterFee": number (required, >= 0),
  "garbageFee": number (required, >= 0),
  "parkingFee": number (required, >= 0)
}
```

**Response:** `201 Created`
```json
{
  "room": {
    "id": "string",
    "propertyId": "string",
    "roomCode": "string",
    "roomName": "string",
    "status": "vacant",
    "rentalPrice": number,
    "electricityFee": number,
    "waterFee": number,
    "garbageFee": number,
    "parkingFee": number,
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
}
```

**Errors:**
- `400`: Room code already exists in property
- `404`: Property not found

---

## 4. Update Room

**Endpoint:** `PUT /api/rooms/:id`

**Request Body:** (All fields optional)
```json
{
  "roomCode": "string",
  "roomName": "string",
  "status": "vacant" | "occupied" | "maintenance",
  "rentalPrice": number,
  "electricityFee": number,
  "waterFee": number,
  "garbageFee": number,
  "parkingFee": number
}
```

**Response:** `200 OK`
```json
{
  "room": { /* updated room object */ }
}
```

---

## 5. Delete Room

**Endpoint:** `DELETE /api/rooms/:id`

**Response:** `204 No Content`

**Note:** Should archive payment history, not hard delete

---

## 6. Search Rooms

**Endpoint:** `GET /api/rooms/search`

**Query Parameters:**
- `q` (required): string - Search query
- `propertyId` (optional): string - Filter by property

**Response:** `200 OK`
```json
{
  "rooms": [ /* array of matching rooms */ ]
}
```

---

## Validation Rules

1. **roomCode**: 
   - Required
   - Unique per property
   - 2-20 characters
   
2. **roomName**:
   - Required
   - 3-100 characters

3. **Prices/Fees**:
   - All must be >= 0
   - Numbers only

4. **Status**:
   - Only: 'vacant', 'occupied', 'maintenance'
   - Default: 'vacant'

---

## Mock Data Examples

Xem `mockRoomApi.ts` để có 11 rooms mẫu across 3 properties.
