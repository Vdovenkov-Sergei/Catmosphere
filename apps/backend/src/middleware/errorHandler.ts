import { Request, Response, NextFunction } from 'express';
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { ApiException } from '../exceptions';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiException) {
    console.error(`[API ERROR] Status: ${err.statusCode} Message: ${err.message}`);
    response.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    const message = err.errors.map(e => e.message).join('; ');
    response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: message });
    return;
  }

  console.error('[UNHANDLED ERROR]', err);
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
};