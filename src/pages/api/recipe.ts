import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import type { Recipe as ReadyRecipe } from '../../types/types';
import * as yup from 'yup';
type Recipe = Omit<ReadyRecipe, 'id'>;

if (process.env.NODE_ENV === 'test') {
  console.log('Api handler in test environment');
}

// Here we define a validation schema for recipe
const recipeSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().nullable(),
  duration: yup.number().nullable(),
  guide: yup.string().required(),
  ingredients: yup.array().of(yup.string()).required(),
  equipment: yup.array().of(yup.string()).required(),
  imgUrl: yup.string().required(),
  authorId: yup.number().nullable(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Create a new Prisma client
  let prisma = new PrismaClient();

  // If we are in test environment, we use a different database
  if (process.env.NODE_ENV === 'test') {
    console.log(
      'Api handler in test environment: ' +
        process.env.NODE_ENV +
        ' ' +
        process.env.TEST_DATABASE_URL
    );
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
    const recipe: Recipe = req.body.recipe;
    // Validate the recipe
    if (!recipe) {
      res.status(400).json({ error: 'Missing body' });
      return;
    }
    try {
      await recipeSchema.validate(recipe);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.status(400).json({ error: error.errors[0] });
      } else {
        throw error;
      }
      return;
    }

    // Create the recipe in db
    const createdRecipe = await prisma.recipe.create({
      data: recipe,
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
