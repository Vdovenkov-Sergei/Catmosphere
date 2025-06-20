import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const TableSchema = z.object({
  id: z.number().int().positive().openapi({ description: "Unique ID for the table" }),
  max_seats: z.number().int().positive().openapi({ description: "Maximum number of seats at the table" }),
}).openapi({ description: "Table object representing a cafe table" });

export const TablesArraySchema = z.array(TableSchema);
