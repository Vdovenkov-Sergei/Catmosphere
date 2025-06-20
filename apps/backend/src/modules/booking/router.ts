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
import { BadRequest, BookingNotFound, BookingConflict, TableNotFound } from '../../exceptions';
import chalk from 'chalk';

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
    if (data.date_from >= data.date_to) {
      return next(new BadRequest('date_from must be before date_to'));
    }
    const now = new Date();
    if (new Date(data.date_from) < now) {
      return next(new BadRequest('date_from cannot be in the past'));
    }
    const table = await prisma.table.findUnique({ where: { id: data.table_id } });
    if (!table) return next(new TableNotFound(data.table_id));

    const conflictingBookings = await prisma.booking.findMany({
      where: {
        table_id: data.table_id,
        date_from: { lt: data.date_to },
        date_to: { gt: data.date_from },
      },
    });
    if (conflictingBookings.length > 0) {
      return next(new BookingConflict('This time slot is already booked'));
    }
    const created = await prisma.booking.create({ data });
    const validated = BookingSchema.parse(created);
    console.log(chalk.green(`[BOOKINGS] Created booking with ID ${validated.id} for table ${validated.table_id}`));
    response.status(StatusCodes.CREATED).json(validated);
  } catch (error) {
    next(error);
  }
});

// GET /bookings/availability?table_id={}&date={}
router.get('/availability', async (request: Request, response: Response, next: NextFunction) => {
  try {
    let parsed;
    try {
      parsed = AvailabilityQuerySchema.parse({
        table_id: Number(request.query.table_id),
        date: request.query.date,
      });
    } catch (error) {
      return next(new BadRequest('Invalid or missing query parameters: `table_id` and `date`'));
    }

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
    console.log(chalk.green(`[BOOKINGS] Fetched availability for table ${parsed.table_id} on ${parsed.date}`));
    response.status(StatusCodes.OK).json(availability);
  } catch (error) {
    next(error);
  }
});

// GET /bookings?phone_number={}
router.get('/', async (request: Request, response: Response, next: NextFunction) => {
  try {
    let parsed;
    try {
      parsed = BookingsByPhoneQuerySchema.parse({
        phone_number: request.query.phone_number,
      });
    }
    catch (error) {
      return next(new BadRequest('Invalid or missing `phone number` query parameter'));
    }

    const bookings = await prisma.booking.findMany({
      where: { phone_number: parsed.phone_number },
      orderBy: { date_from: 'asc' },
    });

    const validated = BookingsArraySchema.parse(bookings);
    console.log(chalk.green(`[BOOKINGS] Fetched ${validated.length} bookings for phone ${parsed.phone_number}`));
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
    console.log(chalk.green(`[BOOKINGS] Booking with ID ${id} cancelled`));
    response.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
});

export { router };
