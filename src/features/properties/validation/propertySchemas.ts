import { z } from 'zod';

export const propertySchema = z.object({
  name: z
    .string()
    .min(1, 'properties.validation.nameRequired')
    .max(100, 'properties.validation.nameMaxLength'),
  
  address: z
    .string()
    .min(1, 'properties.validation.addressRequired')
    .max(200, 'properties.validation.addressMaxLength'),
  
  type: z.enum(['apartment', 'dormitory', 'house', 'commercial'], {
    errorMap: () => ({ message: 'properties.validation.typeRequired' }),
  }).optional(), // Optional - only for UI display
  
  totalRooms: z
    .number({
      required_error: 'properties.validation.totalRoomsRequired',
      invalid_type_error: 'properties.validation.totalRoomsInteger',
    })
    .int('properties.validation.totalRoomsInteger')
    .positive('properties.validation.totalRoomsPositive')
    .min(1, 'properties.validation.totalRoomsPositive'),
  
  // Default utility rates (optional)
  defaultElectricityRate: z
    .number()
    .nonnegative('properties.validation.rateNonNegative')
    .optional(),
  
  defaultWaterRate: z
    .number()
    .nonnegative('properties.validation.rateNonNegative')
    .optional(),
  
  defaultGarbageRate: z
    .number()
    .nonnegative('properties.validation.rateNonNegative')
    .optional(),
  
  defaultParkingRate: z
    .number()
    .nonnegative('properties.validation.rateNonNegative')
    .optional(),
  
  // Billing settings (optional)
  billingDayOfMonth: z
    .number()
    .int('properties.validation.billingDayInteger')
    .min(1, 'properties.validation.billingDayMin')
    .max(31, 'properties.validation.billingDayMax')
    .optional(),
  
  reminderDaysBefore: z
    .number()
    .int('properties.validation.reminderDaysInteger')
    .min(0, 'properties.validation.reminderDaysMin')
    .max(30, 'properties.validation.reminderDaysMax')
    .optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
