import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import config from './config';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.database.DATABASE_URL,
    },
  },
  log: config.app.MODE === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

if (config.app.MODE === 'development') {
  prisma.$use(async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>): Promise<any> => {
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
}

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  shutdown();
});

export default prisma;