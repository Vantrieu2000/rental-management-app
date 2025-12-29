/**
 * Payment Validation Schemas
 * Zod schemas for payment data validation
 */

import { z } from 'zod';

/**
 * Schema for creating a payment record
 */
export const createPaymentSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  tenantId: z.string().min(1, 'Tenant is required'),
  propertyId: z.string().min(1, 'Property is required'),
  billingMonth: z.number().int().min(1).max(12, 'Invalid month'),
  billingYear: z.number().int().min(2020).max(2100, 'Invalid year'),
  dueDate: z.date(),
  feeCalculation: z.object({
    rentalAmount: z.number().min(0, 'Rental amount must be positive'),
    electricityAmount: z.number().min(0, 'Electricity amount must be positive'),
    waterAmount: z.number().min(0, 'Water amount must be positive'),
    garbageAmount: z.number().min(0, 'Garbage amount must be positive'),
    parkingAmount: z.number().min(0, 'Parking amount must be positive'),
    adjustments: z.number(),
    totalAmount: z.number().min(0, 'Total amount must be positive'),
  }),
});

/**
 * Schema for marking payment as paid
 */
export const markPaidSchema = z.object({
  paidAmount: z.number().positive('Paid amount must be positive'),
  paidDate: z.date(),
  paymentMethod: z.enum(['cash', 'bank_transfer', 'e_wallet'], {
    errorMap: () => ({ message: 'Invalid payment method' }),
  }),
  notes: z.string().optional(),
});

/**
 * Schema for payment filters
 */
export const paymentFiltersSchema = z.object({
  propertyId: z.string().optional(),
  roomId: z.string().optional(),
  status: z.enum(['unpaid', 'partial', 'paid', 'overdue']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

/**
 * Type exports
 */
export type CreatePaymentFormData = z.infer<typeof createPaymentSchema>;
export type MarkPaidFormData = z.infer<typeof markPaidSchema>;
export type PaymentFiltersFormData = z.infer<typeof paymentFiltersSchema>;
