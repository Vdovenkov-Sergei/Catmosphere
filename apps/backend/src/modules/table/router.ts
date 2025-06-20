import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../database';
import { StatusCodes } from 'http-status-codes';
import { TablesArraySchema } from './schema';
import chalk from 'chalk';

const router = Router();

// GET /tables — get all tables
router.get('/', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { id: 'asc' },
    });
      
    const validatedTables = TablesArraySchema.parse(tables);
    console.log(chalk.green(`[TABLES] Fetched ${validatedTables.length} tables`));
    response.status(StatusCodes.OK).json(validatedTables);
  } catch (error) {
    next(error);
  }
});

export { router };
