/**
 * Tenant Validation Schemas
 * Zod schemas for tenant data validation
 */

import { z } from 'zod';

// Phone number validation (Vietnamese format)
const phoneRegex = /^(0|\+84)[0-9]{9}$/;

// Email validation
const emailSchema = z.string().email('Invalid email format').optional();

// Emergency contact schema
const emergencyContactSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
    relationship: z.string().min(2, 'Relationship must be specified'),
  })
  .optional();

// Create tenant schema
export const createTenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format (e.g., 0901234567)'),
  email: emailSchema,
  idNumber: z.string().optional(),
  roomId: z.string().min(1, 'Room is required'),
  moveInDate: z.date({
    required_error: 'Move-in date is required',
    invalid_type_error: 'Invalid date format',
  }),
  emergencyContact: emergencyContactSchema,
});

// Update tenant schema
export const updateTenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long').optional(),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format').optional(),
  email: emailSchema,
  idNumber: z.string().optional(),
  emergencyContact: emergencyContactSchema,
});

// Assign tenant schema
export const assignTenantSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  tenantId: z.string().min(1, 'Tenant is required'),
  moveInDate: z.date({
    required_error: 'Move-in date is required',
    invalid_type_error: 'Invalid date format',
  }),
});

// Vacate tenant schema
export const vacateTenantSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  tenantId: z.string().min(1, 'Tenant is required'),
  moveOutDate: z.date({
    required_error: 'Move-out date is required',
    invalid_type_error: 'Invalid date format',
  }),
});

// Type exports
export type CreateTenantFormData = z.infer<typeof createTenantSchema>;
export type UpdateTenantFormData = z.infer<typeof updateTenantSchema>;
export type AssignTenantFormData = z.infer<typeof assignTenantSchema>;
export type VacateTenantFormData = z.infer<typeof vacateTenantSchema>;
