import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../database';
import {
  BookingSchema,
  CreateBookingSchema,
  AvailabilityQuerySchema,
  BookingsByPhoneQuerySchema,
  BookingsArraySchema,
} from './schema';
import { StatusCodes } from 'http-status-codes';
import { BadRequest, BookingNotFound } from '../../exceptions';

const router = Router();

function getOccupiedHours(bookings: { date_from: Date; date_to: Date }[]): boolean[] {
  // 12 hours: c 9:00 – 21:00
  const slots = new Array(12).fill(false);
  for (const { date_from, date_to } of bookings) {
    const startHour = date_from.getHours();
    const endHour = date_to.getHours();
    for (let h = startHour; h < endHour; h++) {
      const index = h - 9;
      if (index >= 0 && index < 12) {
        slots[index] = true;
      }
    }
  }
  return slots;
}

// POST /bookings — create new booking
router.post('/', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const data = CreateBookingSchema.parse(request.body);
    const created = await prisma.booking.create({ data });
    const validated = BookingSchema.parse(created);
    response.status(StatusCodes.CREATED).json(validated);
  } catch (error) {
    next(error);
  }
});

// GET /bookings/availability?table_id={}&date={}
router.get('/availability', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const parsed = AvailabilityQuerySchema.parse({
      table_id: Number(request.query.table_id),
      date: request.query.date,
    });

    const dayStart = new Date(`${parsed.date}T09:00:00`);
    const dayEnd = new Date(`${parsed.date}T21:00:00`);

    const bookings = await prisma.booking.findMany({
      where: {
        table_id: parsed.table_id,
        date_from: { lt: dayEnd },
        date_to: { gt: dayStart },
      },
    });

    const availability = getOccupiedHours(bookings);
    response.status(StatusCodes.OK).json(availability);
  } catch (error) {
    next(error);
  }
});

// GET /bookings?phone_number={}
router.get('/', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const parsed = BookingsByPhoneQuerySchema.parse({
      phone_number: request.query.phone_number,
    });

    const bookings = await prisma.booking.findMany({
      where: { phone_number: parsed.phone_number },
      orderBy: { date_from: 'asc' },
    });

    const validated = BookingsArraySchema.parse(bookings);
    response.status(StatusCodes.OK).json(validated);
  } catch (error) {
    next(error);
  }
});

// DELETE /bookings/:id — cancel booking
router.delete('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const id = Number(request.params.id);
  if (isNaN(id) || id <= 0) return next(new BadRequest('Invalid booking ID'));

  try {
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) return next(new BookingNotFound(id));

    await prisma.booking.delete({ where: { id } });
    response.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
});

export { router };
