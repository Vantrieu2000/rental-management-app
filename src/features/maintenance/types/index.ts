/**
 * Maintenance Types
 */

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface MaintenanceRequest {
  id: string;
  roomId: string;
  propertyId: string;

  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;

  reportedBy: string;
  reportedDate: Date;

  assignedTo?: string;
  scheduledDate?: Date;
  completedDate?: Date;

  cost?: number;
  photos: string[];
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMaintenanceRequestDto {
  roomId: string;
  propertyId: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  reportedBy: string;
  photos?: string[];
  notes?: string;
}

export interface UpdateMaintenanceRequestDto {
  title?: string;
  description?: string;
  priority?: MaintenancePriority;
  status?: MaintenanceStatus;
  assignedTo?: string;
  scheduledDate?: Date;
  cost?: number;
  photos?: string[];
  notes?: string;
}

export interface ResolveMaintenanceRequestDto {
  completedDate: Date;
  cost?: number;
  notes?: string;
}

export interface MaintenanceFilters {
  propertyId?: string;
  roomId?: string;
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  startDate?: Date;
  endDate?: Date;
}
