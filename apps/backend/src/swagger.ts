import config from './config';

import { createDocument, ZodOpenApiOperationObject } from 'zod-openapi';

import { TableSchema } from './modules/table/schema';
import { CatSchema } from './modules/cat/schema';
import {
  BookingSchema,
  CreateBookingSchema,
} from './modules/booking/schema';

import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

const InternalServerError = z.object({
  error: z.string().default('Internal Server Error'),
}).openapi({});

/**
 * This file generates the OpenAPI document using zod-openapi schemas from the app.
 */

const getTables: ZodOpenApiOperationObject = {
  operationId: 'getAllTables',
  summary: 'Retrieve all tables',
  description: 'Returns a list of all available tables in the cafe',
  tags: ['Tables'],
  responses: {
    '200': {
      description: 'A list of tables',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Table',
            }
          }
        }
      }
    },
    '500': {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: InternalServerError,
        }
      }
    }
  }
};

const getCat: ZodOpenApiOperationObject = {
  operationId: 'getCatById',
  summary: 'Get a cat by ID',
  description: 'Returns a single cat by its numeric ID',
  tags: ['Cats'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Numeric ID of the cat to get',
      schema: {
        type: 'integer',
        minimum: 1,
      }
    }
  ],
  responses: {
    '200': {
      description: 'The cat data',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Cat'
          }
        }
      }
    },
    '400': {
      description: 'Invalid cat ID supplied',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Invalid cat ID'),
          }).openapi({}),
        }
      }
    },
    '404': {
      description: 'Cat not found',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Cat with ID {id} not found'),
          }).openapi({}),
        }
      }
    },
    '500': {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: InternalServerError,
        }
      }
    }
  }
};

const getCats: ZodOpenApiOperationObject = {
  operationId: 'getAllCats',
  summary: 'Get list of cats with pagination',
  description: 'Returns paginated list of cats with optional filtering',
  tags: ['Cats'],
  parameters: [
    {
      name: 'limit',
      in: 'query',
      description: 'Number of cats to return',
      schema: {
        type: 'integer',
        minimum: 1,
        default: 10,
      }
    },
    {
      name: 'offset',
      in: 'query',
      description: 'Number of cats to skip',
      schema: {
        type: 'integer',
        minimum: 0,
        default: 0,
      }
    }
  ],
  responses: {
    '200': {
      description: 'Paginated list of cats',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Cat'
            }
          }
        }
      }
    },
    '400': {
      description: 'Invalid or missing query parameters: `limit` and `offset`',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Invalid or missing pagination parameters: `limit` and `offset`'),
          }).openapi({}),
        }
      }
    },
    '500': {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: InternalServerError,
        }
      }
    }
  }
};


const createBooking: ZodOpenApiOperationObject = {
  operationId: 'createBooking',
  summary: 'Create a new booking',
  description: 'Creates a new booking record in the system',
  tags: ['Bookings'],
  requestBody: {
    description: 'Booking data to create',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CreateBooking',
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      description: 'Booking created successfully',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Booking',
          },
        },
      },
    },
    '400': {
      description: 'Validation errors like (`date_from` after `date_to`) or (`date_from` in the past)',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Validation Error'),
          }).openapi({}),
        },
      },
    },
    '404': {
      description: 'Table not found',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Table with ID {id} not found'),
          }).openapi({}),
        },
      },
    },
    '409': {
      description: 'Booking conflict - time slot already booked',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('This time slot is already booked'),
          }).openapi({}),
        },
      },
    },
    '422': {
      description: 'Validation error - invalid input data format',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Validation Error'),
            details: z.array(z.string()).optional(),
          }).openapi({}),
        },
      },
    },
    '500': {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: InternalServerError,
        },
      },
    },
  },
};


const getAvailability: ZodOpenApiOperationObject = {
  operationId: 'getBookingAvailability',
  summary: 'Get booking availability for a table on a specific date',
  tags: ['Bookings'],
  parameters: [
    {
      name: 'table_id',
      in: 'query',
      required: true,
      description: 'ID of the table',
      schema: {
        type: 'integer',
        minimum: 1,
      },
    },
    {
      name: 'date',
      in: 'query',
      required: true,
      description: 'Date to check availability (YYYY-MM-DD)',
      schema: {
        type: 'string',
        format: 'date',
      },
    },
  ],
  responses: {
    '200': {
      description: 'Array of booleans indicating occupied hours from 9:00 to 21:00',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'boolean',
            },
            example: [false, false, true, false, true, false, false, false, false, false, false, false, false],
          },
        },
      },
    },
    '400': {
      description: 'Invalid or missing query parameters: `table_id` and `date`',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Invalid or missing query parameters: `table_id` and `date`'),
          }).openapi({}),
        },
      },
    },
    '500': {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: InternalServerError,
        },
      },
    },
  },
};


const getBookingsByPhoneNumber: ZodOpenApiOperationObject = {
  operationId: 'getBookingsByPhoneNumber',
  summary: 'Get bookings by phone number',
  description: 'Fetches a list of bookings filtered by the given phone number',
  tags: ['Bookings'],
  parameters: [
    {
      name: 'phone_number',
      in: 'query',
      required: true,
      description: 'Phone number to query bookings for',
      schema: {
        type: 'string',
        pattern: '^\\+?[0-9]{10,15}$',
        description: 'Client phone number in international format',
      },
    },
  ],
  responses: {
    '200': {
      description: 'List of bookings',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Booking',
            },
          },
        },
      },
    },
    '400': {
      description: 'Invalid or missing query parameter: `phone_number`',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Invalid or missing `phone_number` query parameter'),
          }).openapi({}),
        },
      },
    },
    '500': {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: InternalServerError,
        },
      },
    },
  },
};


const deleteBookingById: ZodOpenApiOperationObject = {
  operationId: 'deleteBookingById',
  summary: 'Cancel a booking by ID',
  description: 'Cancel a booking identified by its numeric ID',
  tags: ['Bookings'],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      description: 'Booking ID to cancel',
      schema: {
        type: 'integer',
        minimum: 1,
      },
    },
  ],
  responses: {
    '204': {
      description: 'Booking cancelled successfully (no content)',
      content: {},
    },
    '400': {
      description: 'Invalid booking ID supplied',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Invalid booking ID'),
          }).openapi({}),
        },
      },
    },
    '404': {
      description: 'Booking not found',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Booking with ID {id} not found'),
          }).openapi({}),
        },
      },
    },
    '500': {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: InternalServerError,
        },
      },
    },
  },
};


const document = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Catmosphere API",
    version: "1.0.0",
  },
  servers: [
    {
      url: `http://localhost:${config.app.PORT}`,
    },
  ],
  tags: [
    { name: "Tables", description: "Cafe tables management" },
    { name: "Cats", description: "Cafe cats information" },
    { name: "Bookings", description: "Table booking system" },
  ],
  paths: {
    "/tables": { get: getTables },
    "/cats/{id}": { get: getCat },
    "/cats": { get: getCats },
    "/bookings": { post: createBooking, get : getBookingsByPhoneNumber },
    "/bookings/availability": { get: getAvailability },
    "/bookings/{id}": { delete: deleteBookingById },
  },
  components: {
    schemas: {
      Cat: CatSchema,        
      Booking: BookingSchema,
      CreateBooking: CreateBookingSchema,
      Table: TableSchema,
    },
  },
});

export default document;
