import { Request, Response, NextFunction } from 'express';
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { ApiException } from '../exceptions';
import { Prisma } from '@prisma/client';
import chalk from 'chalk';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiException) {
    console.error(chalk.red(`[API ERROR] Status: ${err.statusCode} Message: ${err.message}`));
    response.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(chalk.red(`[PRISMA ERROR] Code: ${err.code} Message: ${err.message}`));
    switch (err.code) {
      case 'P2002':
        response.status(StatusCodes.CONFLICT).json({ error: 'Record already exists' });
        return;
      case 'P2025':
        response.status(StatusCodes.NOT_FOUND).json({ error: 'Record not found' });
        return;
      case 'P2003':
        response.status(StatusCodes.BAD_REQUEST).json({ error: 'Foreign key constraint failed' });
        return;
      default:
        response.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
        return;
    }
  }

  if (err instanceof ZodError) {
    const errors = err.errors.map(e => e.message);
    console.error(chalk.red(`[ZOD ERROR] ${errors.join('; ')}`));
    response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: 'Validation Error', details: errors });
    return;
  }

  console.error(chalk.red('[UNHANDLED ERROR]', err));
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
};