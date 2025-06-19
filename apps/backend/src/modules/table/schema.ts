import { z } from 'zod';

const TableSchema = z.object({
  id: z.number().int().nonnegative(),
  max_seats: z.number().int().positive(),
});

export const TablesArraySchema = z.array(TableSchema);
