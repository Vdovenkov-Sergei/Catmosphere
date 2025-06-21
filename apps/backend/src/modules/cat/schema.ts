import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

extendZodWithOpenApi(z);

export const CatSchema = z.object({
  id: z.number().int().positive().openapi({ description: 'Unique ID of the cat' }),
  name: z.string().min(1).max(100).openapi({ description: 'Name of the cat' }),
  sex: z.enum(['MALE', 'FEMALE']).openapi({ description: 'Sex of the cat' }),
  photo_url: z.string().url().openapi({ description: 'URL of the cat photo' }),
  age: z.number().int().nonnegative().openapi({ description: 'Age of the cat in years' }),
  experience: z.number().int().nonnegative().openapi({ description: 'Experience of the cat in years' }),
  description: z.string().min(1).max(1000).openapi({ description: 'Description of the cat' }),
}).openapi({ description: 'Cat object' });

export const CatsArraySchema = z.array(CatSchema);
