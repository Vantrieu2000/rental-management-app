/**
 * Room Validation Schemas
 * Zod schemas for room data validation
 */

import { z } from 'zod';

/**
 * Create Room Schema
 * Validates data for creating a new room
 */
export const createRoomSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  roomCode: z
    .string()
    .min(1, 'Room code is required')
    .max(20, 'Room code must be less than 20 characters')
    .regex(/^[A-Z0-9]+$/, 'Room code must contain only uppercase letters and numbers'),
  roomName: z
    .string()
    .min(1, 'Room name is required')
    .max(100, 'Room name must be less than 100 characters'),
  rentalPrice: z
    .number()
    .min(0, 'Rental price must be positive')
    .max(1000000000, 'Rental price is too large'),
  electricityFee: z
    .number()
    .min(0, 'Electricity fee must be positive')
    .max(10000000, 'Electricity fee is too large'),
  waterFee: z
    .number()
    .min(0, 'Water fee must be positive')
    .max(10000000, 'Water fee is too large'),
  garbageFee: z
    .number()
    .min(0, 'Garbage fee must be positive')
    .max(10000000, 'Garbage fee is too large'),
  parkingFee: z
    .number()
    .min(0, 'Parking fee must be positive')
    .max(10000000, 'Parking fee is too large'),
});

/**
 * Update Room Schema
 * Validates data for updating an existing room
 * Note: Room code cannot be updated (not included in schema)
 */
export const updateRoomSchema = z.object({
  roomName: z
    .string()
    .min(1, 'Room name is required')
    .max(100, 'Room name must be less than 100 characters')
    .optional(),
  rentalPrice: z
    .number()
    .min(0, 'Rental price must be positive')
    .max(1000000000, 'Rental price is too large')
    .optional(),
  electricityFee: z
    .number()
    .min(0, 'Electricity fee must be positive')
    .max(10000000, 'Electricity fee is too large')
    .optional(),
  waterFee: z
    .number()
    .min(0, 'Water fee must be positive')
    .max(10000000, 'Water fee is too large')
    .optional(),
  garbageFee: z
    .number()
    .min(0, 'Garbage fee must be positive')
    .max(10000000, 'Garbage fee is too large')
    .optional(),
  parkingFee: z
    .number()
    .min(0, 'Parking fee must be positive')
    .max(10000000, 'Parking fee is too large')
    .optional(),
});

// Type exports for form data
export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
export type UpdateRoomFormData = z.infer<typeof updateRoomSchema>;
