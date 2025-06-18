import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const DatabaseSchema = z.object({
  DATABASE_URL: z.string().url().refine(url => url.startsWith('postgresql://'))
});

const AppSchema = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('8080'),
});

const parsedEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  MODE: process.env.MODE,
  PORT: process.env.PORT,
};

const config = {
  database: DatabaseSchema.parse({ DATABASE_URL: parsedEnv.DATABASE_URL }),
  app: AppSchema.parse({ MODE: parsedEnv.MODE, PORT: parsedEnv.PORT }),
};

export type Config = typeof config;
export default config;
