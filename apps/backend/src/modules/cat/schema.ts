import { z } from 'zod';

const SexEnum = z.enum(['MALE', 'FEMALE']);

export const CatSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().min(1).max(100),
  sex: SexEnum,
  photo_url: z.string().url(),
  age: z.number().int().nonnegative(),
  experience: z.number().int().nonnegative(),
  description: z.string().min(1).max(1000),
});

export const CatsArraySchema = z.array(CatSchema);
