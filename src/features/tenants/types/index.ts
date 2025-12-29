/**
 * Tenant Types
 */

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email?: string;
  idNumber?: string;

  // Rental info
  roomId: string;
  moveInDate: Date;
  moveOutDate?: Date;

  // Emergency contact
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTenantDto {
  name: string;
  phone: string;
  email?: string;
  idNumber?: string;
  roomId: string;
  moveInDate: Date;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface UpdateTenantDto {
  name?: string;
  phone?: string;
  email?: string;
  idNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface AssignTenantDto {
  roomId: string;
  tenantId: string;
  moveInDate: Date;
}

export interface VacateTenantDto {
  roomId: string;
  tenantId: string;
  moveOutDate: Date;
}

export interface TenantFilters {
  roomId?: string;
  search?: string;
  isActive?: boolean;
}

export interface TenantHistory {
  id: string;
  tenantId: string;
  roomId: string;
  moveInDate: Date;
  moveOutDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}