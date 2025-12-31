/**
 * Maintenance Validation Schemas
 * Using Zod for runtime validation
 */

import { z } from 'zod';

export const maintenancePrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const maintenanceStatusSchema = z.enum([
  'pending',
  'in_progress',
  'completed',
  'cancelled',
]);

export const createMaintenanceRequestSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  propertyId: z.string().min(1, 'Property is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: maintenancePrioritySchema,
  reportedBy: z.string().min(1, 'Reporter name is required'),
  photos: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const updateMaintenanceRequestSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).optional(),
  priority: maintenancePrioritySchema.optional(),
  status: maintenanceStatusSchema.optional(),
  assignedTo: z.string().optional(),
  scheduledDate: z.date().optional(),
  cost: z.number().min(0).optional(),
  photos: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const resolveMaintenanceRequestSchema = z.object({
  completedDate: z.date(),
  cost: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export type CreateMaintenanceRequestInput = z.infer<
  typeof createMaintenanceRequestSchema
>;
export type UpdateMaintenanceRequestInput = z.infer<
  typeof updateMaintenanceRequestSchema
>;
export type ResolveMaintenanceRequestInput = z.infer<
  typeof resolveMaintenanceRequestSchema
>;
