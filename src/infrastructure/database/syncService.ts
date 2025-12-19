/**
 * Sync service for synchronizing offline changes with MongoDB
 */
import { getRealm } from './realm';
import {
  RoomSchema,
  TenantSchema,
  PaymentRecordSchema,
  PropertySchema,
} from './schemas';
import {
  getPendingChanges,
  removeChange,
  incrementRetryCount,
  getPendingChangesCount,
} from './offlineQueue';
import { useSyncStore } from '../../store/sync.store';
import { Room, Tenant, PaymentRecord, Property } from '../../shared/types/entities';

const MAX_RETRY_COUNT = 3;

/**
 * API client interface (to be implemented by actual API client)
 */
interface ApiClient {
  createRoom: (data: Partial<Room>) => Promise<Room>;
  updateRoom: (id: string, data: Partial<Room>) => Promise<Room>;
  deleteRoom: (id: string) => Promise<void>;
  createTenant: (data: Partial<Tenant>) => Promise<Tenant>;
  updateTenant: (id: string, data: Partial<Tenant>) => Promise<Tenant>;
  deleteTenant: (id: string) => Promise<void>;
  createPayment: (data: Partial<PaymentRecord>) => Promise<PaymentRecord>;
  updatePayment: (id: string, data: Partial<PaymentRecord>) => Promise<PaymentRecord>;
  deletePayment: (id: string) => Promise<void>;
  createProperty: (data: Partial<Property>) => Promise<Property>;
  updateProperty: (id: string, data: Partial<Property>) => Promise<Property>;
  deleteProperty: (id: string) => Promise<void>;
}

let apiClient: ApiClient | null = null;

/**
 * Set the API client for sync operations
 */
export function setApiClient(client: ApiClient): void {
  apiClient = client;
}

/**
 * Synchronize all pending changes with the server
 */
export async function syncPendingChanges(): Promise<void> {
  if (!apiClient) {
    throw new Error('API client not set. Call setApiClient() first.');
  }

  const { isOnline, isSyncing, setSyncing, setLastSyncAt, setPendingChanges, setSyncError } =
    useSyncStore.getState();

  if (!isOnline) {
    console.log('Cannot sync: offline');
    return;
  }

  if (isSyncing) {
    console.log('Sync already in progress');
    return;
  }

  setSyncing(true);
  setSyncError(null);

  try {
    const pendingChanges = getPendingChanges();
    console.log(`Syncing ${pendingChanges.length} pending changes`);

    for (const change of pendingChanges) {
      try {
        await syncChange(change);
        removeChange(change.id);
      } catch (error) {
        console.error(`Failed to sync change ${change.id}:`, error);
        
        if (change.retryCount >= MAX_RETRY_COUNT) {
          console.error(`Max retries reached for change ${change.id}, removing from queue`);
          removeChange(change.id);
        } else {
          incrementRetryCount(change.id);
        }
      }
    }

    setLastSyncAt(new Date());
    setPendingChanges(getPendingChangesCount());
  } catch (error) {
    console.error('Sync failed:', error);
    setSyncError(error instanceof Error ? error.message : 'Unknown sync error');
  } finally {
    setSyncing(false);
  }
}

/**
 * Sync a single change
 */
async function syncChange(change: ReturnType<typeof getPendingChanges>[0]): Promise<void> {
  if (!apiClient) {
    throw new Error('API client not set');
  }

  const { entityType, entityId, operation, data } = change;

  switch (entityType) {
    case 'Room':
      await syncRoomChange(entityId, operation, data);
      break;
    case 'Tenant':
      await syncTenantChange(entityId, operation, data);
      break;
    case 'PaymentRecord':
      await syncPaymentChange(entityId, operation, data);
      break;
    case 'Property':
      await syncPropertyChange(entityId, operation, data);
      break;
    default:
      throw new Error(`Unknown entity type: ${entityType}`);
  }
}

async function syncRoomChange(
  id: string,
  operation: string,
  data: any
): Promise<void> {
  if (!apiClient) throw new Error('API client not set');

  switch (operation) {
    case 'create':
      await apiClient.createRoom(data);
      break;
    case 'update':
      await apiClient.updateRoom(id, data);
      break;
    case 'delete':
      await apiClient.deleteRoom(id);
      break;
  }

  // Update local sync status
  updateLocalSyncStatus('Room', id, 'synced');
}

async function syncTenantChange(
  id: string,
  operation: string,
  data: any
): Promise<void> {
  if (!apiClient) throw new Error('API client not set');

  switch (operation) {
    case 'create':
      await apiClient.createTenant(data);
      break;
    case 'update':
      await apiClient.updateTenant(id, data);
      break;
    case 'delete':
      await apiClient.deleteTenant(id);
      break;
  }

  updateLocalSyncStatus('Tenant', id, 'synced');
}

async function syncPaymentChange(
  id: string,
  operation: string,
  data: any
): Promise<void> {
  if (!apiClient) throw new Error('API client not set');

  switch (operation) {
    case 'create':
      await apiClient.createPayment(data);
      break;
    case 'update':
      await apiClient.updatePayment(id, data);
      break;
    case 'delete':
      await apiClient.deletePayment(id);
      break;
  }

  updateLocalSyncStatus('PaymentRecord', id, 'synced');
}

async function syncPropertyChange(
  id: string,
  operation: string,
  data: any
): Promise<void> {
  if (!apiClient) throw new Error('API client not set');

  switch (operation) {
    case 'create':
      await apiClient.createProperty(data);
      break;
    case 'update':
      await apiClient.updateProperty(id, data);
      break;
    case 'delete':
      await apiClient.deleteProperty(id);
      break;
  }

  updateLocalSyncStatus('Property', id, 'synced');
}

/**
 * Update sync status in local database
 */
function updateLocalSyncStatus(
  entityType: string,
  entityId: string,
  status: 'synced' | 'pending' | 'conflict'
): void {
  const realm = getRealm();

  realm.write(() => {
    const entity = realm.objectForPrimaryKey(entityType, entityId);
    if (entity) {
      (entity as any).syncStatus = status;
    }
  });
}

/**
 * Cache data from server to local database
 */
export function cacheRoom(room: Room): void {
  const realm = getRealm();

  realm.write(() => {
    realm.create(
      'Room',
      {
        id: room.id,
        propertyId: room.propertyId,
        roomCode: room.roomCode,
        roomName: room.roomName,
        status: room.status,
        rentalPrice: room.rentalPrice,
        electricityFee: room.electricityFee,
        waterFee: room.waterFee,
        garbageFee: room.garbageFee,
        parkingFee: room.parkingFee,
        currentTenantId: room.currentTenantId,
        syncStatus: 'synced',
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      },
      Realm.UpdateMode.Modified
    );
  });
}

export function cacheTenant(tenant: Tenant): void {
  const realm = getRealm();

  realm.write(() => {
    realm.create(
      'Tenant',
      {
        id: tenant.id,
        name: tenant.name,
        phone: tenant.phone,
        email: tenant.email,
        idNumber: tenant.idNumber,
        roomId: tenant.roomId,
        moveInDate: tenant.moveInDate,
        moveOutDate: tenant.moveOutDate,
        emergencyContactName: tenant.emergencyContact?.name,
        emergencyContactPhone: tenant.emergencyContact?.phone,
        emergencyContactRelationship: tenant.emergencyContact?.relationship,
        syncStatus: 'synced',
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      },
      Realm.UpdateMode.Modified
    );
  });
}

export function cachePayment(payment: PaymentRecord): void {
  const realm = getRealm();

  realm.write(() => {
    realm.create(
      'PaymentRecord',
      {
        id: payment.id,
        roomId: payment.roomId,
        tenantId: payment.tenantId,
        propertyId: payment.propertyId,
        billingMonth: payment.billingMonth,
        billingYear: payment.billingYear,
        dueDate: payment.dueDate,
        rentalAmount: payment.rentalAmount,
        electricityAmount: payment.electricityAmount,
        waterAmount: payment.waterAmount,
        garbageAmount: payment.garbageAmount,
        parkingAmount: payment.parkingAmount,
        adjustments: payment.adjustments,
        totalAmount: payment.totalAmount,
        status: payment.status,
        paidAmount: payment.paidAmount,
        paidDate: payment.paidDate,
        paymentMethod: payment.paymentMethod,
        notes: payment.notes,
        syncStatus: 'synced',
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
      Realm.UpdateMode.Modified
    );
  });
}

export function cacheProperty(property: Property): void {
  const realm = getRealm();

  realm.write(() => {
    realm.create(
      'Property',
      {
        id: property.id,
        name: property.name,
        address: property.address,
        totalRooms: property.totalRooms,
        defaultElectricityRate: property.defaultElectricityRate,
        defaultWaterRate: property.defaultWaterRate,
        defaultGarbageRate: property.defaultGarbageRate,
        defaultParkingRate: property.defaultParkingRate,
        billingDayOfMonth: property.billingDayOfMonth,
        reminderDaysBefore: property.reminderDaysBefore,
        ownerId: property.ownerId,
        syncStatus: 'synced',
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
      },
      Realm.UpdateMode.Modified
    );
  });
}

/**
 * Get cached data from local database
 */
export function getCachedRooms(propertyId?: string): Room[] {
  const realm = getRealm();
  let rooms = realm.objects<RoomSchema>('Room');

  if (propertyId) {
    rooms = rooms.filtered('propertyId == $0', propertyId);
  }

  return Array.from(rooms).map(convertRoomSchemaToRoom);
}

export function getCachedTenants(roomId?: string): Tenant[] {
  const realm = getRealm();
  let tenants = realm.objects<TenantSchema>('Tenant');

  if (roomId) {
    tenants = tenants.filtered('roomId == $0', roomId);
  }

  return Array.from(tenants).map(convertTenantSchemaToTenant);
}

export function getCachedPayments(roomId?: string): PaymentRecord[] {
  const realm = getRealm();
  let payments = realm.objects<PaymentRecordSchema>('PaymentRecord');

  if (roomId) {
    payments = payments.filtered('roomId == $0', roomId);
  }

  return Array.from(payments).map(convertPaymentSchemaToPayment);
}

export function getCachedProperties(): Property[] {
  const realm = getRealm();
  const properties = realm.objects<PropertySchema>('Property');

  return Array.from(properties).map(convertPropertySchemaToProperty);
}

// Conversion functions
function convertRoomSchemaToRoom(schema: RoomSchema): Room {
  return {
    id: schema.id,
    propertyId: schema.propertyId,
    roomCode: schema.roomCode,
    roomName: schema.roomName,
    status: schema.status as Room['status'],
    rentalPrice: schema.rentalPrice,
    electricityFee: schema.electricityFee,
    waterFee: schema.waterFee,
    garbageFee: schema.garbageFee,
    parkingFee: schema.parkingFee,
    currentTenantId: schema.currentTenantId,
    createdAt: schema.createdAt,
    updatedAt: schema.updatedAt,
  };
}

function convertTenantSchemaToTenant(schema: TenantSchema): Tenant {
  return {
    id: schema.id,
    name: schema.name,
    phone: schema.phone,
    email: schema.email,
    idNumber: schema.idNumber,
    roomId: schema.roomId,
    moveInDate: schema.moveInDate,
    moveOutDate: schema.moveOutDate,
    emergencyContact:
      schema.emergencyContactName && schema.emergencyContactPhone
        ? {
            name: schema.emergencyContactName,
            phone: schema.emergencyContactPhone,
            relationship: schema.emergencyContactRelationship || '',
          }
        : undefined,
    createdAt: schema.createdAt,
    updatedAt: schema.updatedAt,
  };
}

function convertPaymentSchemaToPayment(schema: PaymentRecordSchema): PaymentRecord {
  return {
    id: schema.id,
    roomId: schema.roomId,
    tenantId: schema.tenantId,
    propertyId: schema.propertyId,
    billingMonth: schema.billingMonth,
    billingYear: schema.billingYear,
    dueDate: schema.dueDate,
    rentalAmount: schema.rentalAmount,
    electricityAmount: schema.electricityAmount,
    waterAmount: schema.waterAmount,
    garbageAmount: schema.garbageAmount,
    parkingAmount: schema.parkingAmount,
    adjustments: schema.adjustments,
    totalAmount: schema.totalAmount,
    status: schema.status as PaymentRecord['status'],
    paidAmount: schema.paidAmount,
    paidDate: schema.paidDate,
    paymentMethod: schema.paymentMethod as PaymentRecord['paymentMethod'],
    notes: schema.notes,
    createdAt: schema.createdAt,
    updatedAt: schema.updatedAt,
  };
}

function convertPropertySchemaToProperty(schema: PropertySchema): Property {
  return {
    id: schema.id,
    name: schema.name,
    address: schema.address,
    totalRooms: schema.totalRooms,
    defaultElectricityRate: schema.defaultElectricityRate,
    defaultWaterRate: schema.defaultWaterRate,
    defaultGarbageRate: schema.defaultGarbageRate,
    defaultParkingRate: schema.defaultParkingRate,
    billingDayOfMonth: schema.billingDayOfMonth,
    reminderDaysBefore: schema.reminderDaysBefore,
    ownerId: schema.ownerId,
    createdAt: schema.createdAt,
    updatedAt: schema.updatedAt,
  };
}
