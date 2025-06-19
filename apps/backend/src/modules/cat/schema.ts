import { z } from 'zod';

export const CatSchema = z.object({
  id: z.number(),
  name: z.string(),
  sex: z.enum(['MALE', 'FEMALE']),
  photo_url: z.string().url(),
  age: z.number(),
  experience: z.number(),
  description: z.string(),
});

export const CatsArraySchema = z.array(CatSchema);
