import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../database';
import { StatusCodes } from 'http-status-codes';
import { CatNotFound, BadRequest } from '../../exceptions';
import { CatSchema, CatsArraySchema } from './schema';
import chalk from 'chalk';

const router = Router();

// GET /cats/:id — get cat by id
router.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const id = Number(request.params.id);
  if (isNaN(id) || id <= 0) return next(new BadRequest('Invalid cat ID'));

  try {
    const cat = await prisma.cat.findUnique({ where: { id } });
    if (!cat) return next(new CatNotFound(id));
    const validatedCat = CatSchema.parse(cat);
    
    console.log(chalk.green(`[CATS] Fetched cat with ID ${validatedCat.id}`));
    response.status(StatusCodes.OK).json(validatedCat);
  } catch (error) {
    next(error);
  }
});

// GET /cats?limit=10&offset=0 — get cats with pagination
router.get('/', async (request: Request, response: Response, next: NextFunction) => {
  const limit = Number(request.query.limit) || 10;
  const offset = Number(request.query.offset) || 0;
  if (isNaN(limit) || isNaN(offset) || limit <= 0 || offset < 0) {
    return next(new BadRequest('Limit must be positive and offset non-negative'));
  }

  try {
    const cats = await prisma.cat.findMany({
      skip: offset,
      take: limit,
      orderBy: { id: 'asc' },
    });
    const validatedCats = CatsArraySchema.parse(cats);
    
    console.log(chalk.green(`[CATS] Fetched ${validatedCats.length} cats with limit ${limit} and offset ${offset}`));
    response.status(StatusCodes.OK).json(validatedCats);
  } catch (error) {
    next(error);
  }
});

export { router };
