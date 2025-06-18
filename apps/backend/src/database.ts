import { PrismaClient } from '@prisma/client';
import config from './config';

const getDatabaseUrl = () => {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, DB_SSL } = config.database;
  const ssl = DB_SSL ? '?sslmode=require' : '';
  return `postgresql://${DB_USER}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}${ssl}`;
};

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
  log: config.app.MODE === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
  __internal: {
    engine: {
      enableEngineDebugMode: false,
      enableQueryLogging: config.app.MODE === 'development',
    },
  },
});

prisma.$use(async (params, next) => {
  const start = Date.now();
  try {
    const result = await next(params);
    const duration = Date.now() - start;
    console.log(`[PRISMA] ${params.model}.${params.action} - ${duration}ms`);
    return result;
  } catch (error) {
    console.error(`[PRISMA ERROR] ${params.model}.${params.action}`, error);
    throw error;
  }
});

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

export default prisma;