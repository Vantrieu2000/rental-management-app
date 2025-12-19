/**
 * Realm schemas for offline data storage
 */
import Realm from 'realm';

export type SyncStatus = 'synced' | 'pending' | 'conflict';

/**
 * Room schema for local storage
 */
export class RoomSchema extends Realm.Object<RoomSchema> {
  id!: string;
  propertyId!: string;
  roomCode!: string;
  roomName!: string;
  status!: string;
  
  rentalPrice!: number;
  electricityFee!: number;
  waterFee!: number;
  garbageFee!: number;
  parkingFee!: number;
  
  currentTenantId?: string;
  
  syncStatus!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Room',
    primaryKey: 'id',
    properties: {
      id: 'string',
      propertyId: { type: 'string', indexed: true },
      roomCode: 'string',
      roomName: 'string',
      status: { type: 'string', indexed: true },
      rentalPrice: 'double',
      electricityFee: 'double',
      waterFee: 'double',
      garbageFee: 'double',
      parkingFee: 'double',
      currentTenantId: 'string?',
      syncStatus: { type: 'string', default: 'synced' },
      createdAt: 'date',
      updatedAt: 'date',
    },
  };
}

/**
 * Tenant schema for local storage
 */
export class TenantSchema extends Realm.Object<TenantSchema> {
  id!: string;
  name!: string;
  phone!: string;
  email?: string;
  idNumber?: string;
  
  roomId!: string;
  moveInDate!: Date;
  moveOutDate?: Date;
  
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  
  syncStatus!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Tenant',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      phone: 'string',
      email: 'string?',
      idNumber: 'string?',
      roomId: { type: 'string', indexed: true },
      moveInDate: 'date',
      moveOutDate: 'date?',
      emergencyContactName: 'string?',
      emergencyContactPhone: 'string?',
      emergencyContactRelationship: 'string?',
      syncStatus: { type: 'string', default: 'synced' },
      createdAt: 'date',
      updatedAt: 'date',
    },
  };
}

/**
 * Payment Record schema for local storage
 */
export class PaymentRecordSchema extends Realm.Object<PaymentRecordSchema> {
  id!: string;
  roomId!: string;
  tenantId!: string;
  propertyId!: string;
  
  billingMonth!: number;
  billingYear!: number;
  dueDate!: Date;
  
  rentalAmount!: number;
  electricityAmount!: number;
  waterAmount!: number;
  garbageAmount!: number;
  parkingAmount!: number;
  adjustments!: number;
  totalAmount!: number;
  
  status!: string;
  paidAmount!: number;
  paidDate?: Date;
  paymentMethod?: string;
  notes?: string;
  
  syncStatus!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'PaymentRecord',
    primaryKey: 'id',
    properties: {
      id: 'string',
      roomId: { type: 'string', indexed: true },
      tenantId: { type: 'string', indexed: true },
      propertyId: { type: 'string', indexed: true },
      billingMonth: 'int',
      billingYear: 'int',
      dueDate: { type: 'date', indexed: true },
      rentalAmount: 'double',
      electricityAmount: 'double',
      waterAmount: 'double',
      garbageAmount: 'double',
      parkingAmount: 'double',
      adjustments: 'double',
      totalAmount: 'double',
      status: { type: 'string', indexed: true },
      paidAmount: 'double',
      paidDate: 'date?',
      paymentMethod: 'string?',
      notes: 'string?',
      syncStatus: { type: 'string', default: 'synced' },
      createdAt: 'date',
      updatedAt: 'date',
    },
  };
}

/**
 * Property schema for local storage
 */
export class PropertySchema extends Realm.Object<PropertySchema> {
  id!: string;
  name!: string;
  address!: string;
  totalRooms!: number;
  
  defaultElectricityRate!: number;
  defaultWaterRate!: number;
  defaultGarbageRate!: number;
  defaultParkingRate!: number;
  
  billingDayOfMonth!: number;
  reminderDaysBefore!: number;
  
  ownerId!: string;
  syncStatus!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Property',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      address: 'string',
      totalRooms: 'int',
      defaultElectricityRate: 'double',
      defaultWaterRate: 'double',
      defaultGarbageRate: 'double',
      defaultParkingRate: 'double',
      billingDayOfMonth: 'int',
      reminderDaysBefore: 'int',
      ownerId: 'string',
      syncStatus: { type: 'string', default: 'synced' },
      createdAt: 'date',
      updatedAt: 'date',
    },
  };
}

/**
 * Pending change schema for offline queue
 */
export class PendingChangeSchema extends Realm.Object<PendingChangeSchema> {
  id!: string;
  entityType!: string;
  entityId!: string;
  operation!: string; // 'create' | 'update' | 'delete'
  data!: string; // JSON stringified data
  timestamp!: Date;
  retryCount!: number;

  static schema: Realm.ObjectSchema = {
    name: 'PendingChange',
    primaryKey: 'id',
    properties: {
      id: 'string',
      entityType: 'string',
      entityId: 'string',
      operation: 'string',
      data: 'string',
      timestamp: { type: 'date', indexed: true },
      retryCount: { type: 'int', default: 0 },
    },
  };
}

export const schemas = [
  RoomSchema,
  TenantSchema,
  PaymentRecordSchema,
  PropertySchema,
  PendingChangeSchema,
];
