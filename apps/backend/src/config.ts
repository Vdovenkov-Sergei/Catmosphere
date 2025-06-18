import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const DatabaseSchema = z.object({
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_PORT: z.string().regex(/^\d+$/).transform(Number).refine(v => v > 0 && v < 65536),
  DB_NAME: z.string().min(1),
  DB_SSL: z.string().transform(v => v === 'true').optional(),
});

const AppSchema = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('8080'),
});

const config = {
  database: DatabaseSchema.parse({
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_SSL: process.env.DB_SSL,
  }),
  app: AppSchema.parse({
    MODE: process.env.MODE,
    PORT: process.env.PORT,
  }),
};

export type Config = typeof config;
export default config;