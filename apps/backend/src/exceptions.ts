import { StatusCodes } from 'http-status-codes';

export class ApiException extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequest extends ApiException {
  constructor(message: string = 'Bad request') {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

export class TableNotFound extends ApiException {
  constructor(id: number) {
    super(StatusCodes.NOT_FOUND, `Table with ID ${id} not found`);
  }
}

export class CatNotFound extends ApiException {
  constructor(id: number) {
    super(StatusCodes.NOT_FOUND, `Cat with ID ${id} not found`);
  }
}

export class BookingNotFound extends ApiException {
  constructor(id: number) {
    super(StatusCodes.NOT_FOUND, `Booking with ID ${id} not found`);
  }
}

export class BookingConflict extends ApiException {
  constructor(message: string = 'Booking conflict') {
    super(StatusCodes.CONFLICT, message);
  }
}