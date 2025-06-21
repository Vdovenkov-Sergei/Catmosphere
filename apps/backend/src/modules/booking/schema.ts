import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const BookingSchema = z.object({
  id: z.number().int().positive().openapi({ description: 'Unique booking ID' }),
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/).openapi({ description: 'Client phone number in international format' }),
  name: z.string().min(1).openapi({ description: 'Name of the client' }),
  date_from: z.date().openapi({ description: 'Booking start datetime in ISO format' }),
  date_to: z.date().openapi({ description: 'Booking end datetime in ISO format' }),
  table_id: z.number().int().positive().openapi({ description: 'ID of the booked table' }),
}).openapi({ description: 'Booking object' });

export const CreateBookingSchema = z.object({
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/).openapi({ description: 'Client phone number in international format' }),
  name: z.string().min(1).openapi({ description: 'Name of the client' }),
  date_from: z.string().datetime({ offset: true }).openapi({ description: 'Booking start datetime in ISO format' }),
  date_to: z.string().datetime({ offset: true }).openapi({ description: 'Booking end datetime in ISO format' }),
  table_id: z.number().int().positive().openapi({ description: 'ID of the booked table' }),
}).openapi({ description: 'Booking creation payload' });

export const AvailabilityQuerySchema = z.object({
  table_id: z.number().int().positive().openapi({ description: 'ID of the table to check availability' }),
  date: z.string().datetime({ offset: true }).openapi({ description: 'Datetime in ISO format' }),
}).openapi({ description: 'Availability query parameters' });

export const BookingsByPhoneQuerySchema = z.object({
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/).openapi({ description: 'Client phone number to query bookings' }),
}).openapi({ description: 'Bookings query parameters by phone number' });

export const BookingsArraySchema = z.array(BookingSchema);
