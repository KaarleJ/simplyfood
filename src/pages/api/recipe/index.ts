import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/next.config';
import prisma from '@/prismaClient';
import type { Recipe as ReadyRecipe } from '@/types';
import * as yup from 'yup';
import { recipeSchema } from '../../../validationSchemas';
type Recipe = Omit<ReadyRecipe, 'id'>;
import { deleteImage } from '@/s3';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authorization
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: 'Must be signed in to create a recipe!' });
    return;
  }

  if (req.method === 'POST') {
    // Validate the recipe
    const recipe = req.body.recipe;
    if (!recipe) {
      res.status(400).json({ error: 'Missing body' });
      return;
    }
    recipe.authorId = session.user.id;
    let validatedRecipe: Recipe;
    try {
      validatedRecipe = await recipeSchema.validate(req.body.recipe);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        await deleteImage(recipe.imgUrl);
        res.status(400).json({ error: error.errors[0] });
        return;
      } else {
        await deleteImage(recipe.imgUrl);
        res.status(500).json({ error: 'Unable to validate recipe' });
        return;
      }
    }

    // Create the recipe in db
    const createdRecipe = await prisma.recipe.create({
      data: {
        title: validatedRecipe.title,
        description: validatedRecipe.description,
        duration: validatedRecipe.duration,
        guide: validatedRecipe.guide,
        ingredients: validatedRecipe.ingredients,
        equipment: validatedRecipe.equipment,
        imgUrl: validatedRecipe.imgUrl,
        authorId: validatedRecipe.authorId,
      },
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
    return;
    // All other methods are not allowed
  } else {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
}
