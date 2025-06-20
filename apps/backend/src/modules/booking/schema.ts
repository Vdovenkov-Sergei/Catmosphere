import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const BookingSchema = z.object({
  id: z.number().int().nonnegative().openapi({ description: 'Unique booking ID' }),
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/).openapi({ description: 'Client phone number in international format' }),
  name: z.string().min(1).openapi({ description: 'Name of the client' }),
  date_from: z.string().datetime().openapi({ description: 'Booking start datetime and time in ISO format' }),
  date_to: z.string().datetime().openapi({ description: 'Booking end datetime and time in ISO format' }),
  table_id: z.number().int().positive().openapi({ description: 'ID of the booked table' }),
}).openapi({ description: 'Booking object' });

export const CreateBookingSchema = BookingSchema.omit({ id: true }).openapi({
  description: 'Booking creation payload',
});

export const AvailabilityQuerySchema = z.object({
  table_id: z.number().int().positive().openapi({ description: 'ID of the table to check availability' }),
  date: z.string().date().openapi({ description: 'Date to check availability (YYYY-MM-DD)' }),
}).openapi({ description: 'Availability query parameters' });

export const BookingsByPhoneQuerySchema = z.object({
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/).openapi({ description: 'Client phone number to query bookings' }),
}).openapi({ description: 'Bookings query parameters by phone number' });

export const BookingsArraySchema = z.array(BookingSchema);
