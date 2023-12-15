import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import type { Recipe as ReadyRecipe } from '@/types';
import * as yup from 'yup';
import { recipeSchema } from '../../validationSchemas';
type Recipe = Omit<ReadyRecipe, 'id'>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authorization
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Create a new Prisma client
  let prisma = new PrismaClient();

  // If we are in test environment, we use a different database
  if (process.env.NODE_ENV === 'test') {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL,
        },
      },
    });
  }

  // If the request is a POST request, we create a new recipe
  if (req.method === 'POST') {
    const recipe = req.body.recipe;
    // Validate the recipe
    if (!recipe) {
      res.status(400).json({ error: 'Missing body' });
      return;
    }
    let validatedRecipe: Recipe;
    try {
      validatedRecipe = await recipeSchema.validate(req.body.recipe);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.status(400).json({ error: error.errors[0] });
        return;
      } else {
        throw error;
      }
    }

    // Create the recipe in db
    const createdRecipe = await prisma.recipe.create({
      data: validatedRecipe,
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        guide: true,
        ingredients: true,
        equipment: true,
        imgUrl: true,
        authorId: true,
      },
    });

    // Send the recipe back to the client
    res.status(201).json(createdRecipe);

    // If the request is a GET request, we send a hello world message
  } else if (req.method === 'GET') {
    res.status(200).json({ api: 'Hello World!' });
  }
}
