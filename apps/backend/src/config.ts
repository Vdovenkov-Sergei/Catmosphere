import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// ========== DATABASE ==========
const DatabaseSchema = z.object({
  DATABASE_URL: z.string().url().refine(url => url.startsWith('postgresql://')),
});

// ========== APP ==========
const AppSchema = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('8080'),
});

// ========== AUTH ==========
const AuthSchema = z.object({
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD_HASH: z.string(),
  ADMIN_COOKIE_SECRET: z.string(),
});

// ========== Parse ENV ==========
const parsedEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  MODE: process.env.MODE,
  PORT: process.env.PORT,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
  ADMIN_COOKIE_SECRET: process.env.ADMIN_COOKIE_SECRET,
};

// ========== Export Config ==========
const config = {
  database: DatabaseSchema.parse({ DATABASE_URL: parsedEnv.DATABASE_URL }),
  app: AppSchema.parse({ MODE: parsedEnv.MODE, PORT: parsedEnv.PORT }),
  auth: AuthSchema.parse({
    ADMIN_EMAIL: parsedEnv.ADMIN_EMAIL,
    ADMIN_PASSWORD_HASH: parsedEnv.ADMIN_PASSWORD_HASH,
    ADMIN_COOKIE_SECRET: parsedEnv.ADMIN_COOKIE_SECRET,
  }),
};

export type Config = typeof config;
export default config;
