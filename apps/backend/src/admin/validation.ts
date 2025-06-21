import { ValidationError as AdminValidationError } from 'adminjs';
import { z } from 'zod';

const toNumber = (val: unknown) => isNaN(Number(val)) ? val : Number(val);

const tableBaseSchema = z.object({
  max_seats: z.preprocess(toNumber, z.number().int().positive({ message: 'Field `max_seats` must be a positive integer' })),
});

const tableUpdateSchema = tableBaseSchema.extend({
  id: z.preprocess(toNumber, z.number().int().nonnegative({ message: 'Field `id` must be a non-negative integer' })),
});

const catBaseSchema = z.object({
  name: z.string().min(1, 'Field `name` is required (1-100 chars)').max(100, 'Field `name` is required (1-100 chars)'),
  sex: z.enum(['MALE', 'FEMALE'], { errorMap: () => ({ message: 'Field `sex` is required and must be MALE or FEMALE' }) }),
  photo_url: z.string().url('Field `photo_url` is required and must be a valid URL'),
  age: z.preprocess(toNumber, z.number().int().nonnegative({ message: 'Field `age` must be a non-negative integer' })),
  experience: z.preprocess(toNumber, z.number().int().nonnegative({ message: 'Field `experience` must be a non-negative integer' })),
  description: z.string().min(1, 'Field `description` is required (1-1000 chars)').max(1000, 'Field `description` is required (1-1000 chars)'),
});

const catUpdateSchema = catBaseSchema.extend({
  id: z.preprocess(toNumber, z.number().int().nonnegative({ message: 'Field `id` must be a non-negative integer' })),
});


// Validation for `Table`
export function validateTable(input: any, isCreate = false) {
  const schema = isCreate ? tableBaseSchema : tableUpdateSchema;
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    const field = firstError.path[0] as string;

    throw new AdminValidationError(
      { [field]: { message: firstError.message } },
      { message: firstError.message }
    );
  }

  return parsed.data;
}

// Validation for `Cat`
export function validateCat(input: any, isCreate = false) {
  const schema = isCreate ? catBaseSchema : catUpdateSchema;
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    const field = firstError.path[0] as string;

    throw new AdminValidationError(
      { [field]: { message: firstError.message } },
      { message: firstError.message }
    );
  }

  return parsed.data;
}