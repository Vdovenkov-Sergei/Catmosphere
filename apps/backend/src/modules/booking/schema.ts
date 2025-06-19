import { z } from 'zod';

export const BookingSchema = z.object({
  id: z.number().int().nonnegative(),
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/),
  name: z.string().min(1),
  date_from: z.string().datetime(),
  date_to: z.string().datetime(),
  table_id: z.number().int().positive(),
});

export const CreateBookingSchema = BookingSchema.omit({ id: true });

export const AvailabilityQuerySchema = z.object({
  table_id: z.number().int().positive(),
  date: z.string().date(),
});

export const BookingsByPhoneQuerySchema = z.object({
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/),
});

export const BookingsArraySchema = z.array(BookingSchema);
