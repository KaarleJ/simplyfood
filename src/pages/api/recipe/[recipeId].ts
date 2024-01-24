import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getRecipeById } from '@/prismaClient';
import { authOptions } from '../auth/[...nextauth]';
import type { Recipe as RecipeType } from '@/types';
type Recipe = Omit<RecipeType, 'id'>;
import { recipeSchema } from '../../../validationSchemas';
import * as yup from 'yup';
import prisma from '@/prismaClient';
import { deleteImage } from '@/s3';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { recipeId } = req.query;

  if (!recipeId) {
    res.status(400).json({ error: 'Missing recipe id' });
    return;
  }

  if (req.method === 'GET') {
    // Check session
    const session = await getServerSession(req, res, authOptions);
    const userId = session?.user?.id as string | undefined;

    // Get recipe by id
    const { recipe, liked }: { recipe: Recipe | null; liked: boolean } =
      await getRecipeById(Number(recipeId), userId);

    // Check if recipe exists
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    // Return recipe
    res.status(200).json({ recipe, liked });
    return;
    // All other methods are not allowed
  } else if (req.method === 'PUT') {
    // Check session
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ error: 'You must be signed in to edit a recipe' });
      return;
    }
    const userId = session?.user?.id as string | undefined;

    // Validate the recipe
    if (!req.body.recipe) {
      res.status(400).json({ error: 'Missing recipe in body' });
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

    // Get recipe by id
    const { recipe }: { recipe: Recipe | null; liked: boolean } =
      await getRecipeById(Number(recipeId), userId);

    // Check if recipe exists
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    // Check that the user is the author of the recipe
    if (recipe.authorId !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    // Update recipe
    const updatedRecipe = await prisma.recipe.update({
      where: { id: Number(recipeId) },
      data: {
        title: validatedRecipe.title,
        description: validatedRecipe.description,
        duration: validatedRecipe.duration,
        guide: validatedRecipe.guide,
        ingredients: validatedRecipe.ingredients,
        equipment: validatedRecipe.equipment,
        imgUrl: validatedRecipe.imgUrl,
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

    // Return recipe
    res.status(200).json(updatedRecipe);
    return;
  } else if (req.method === 'DELETE') {
    // Check session
    const session = await getServerSession(req, res, authOptions);
    const userId = session?.user?.id as string | undefined;
    if (!session || !userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get recipe by id
    const { recipe }: { recipe: Recipe | null; liked: boolean } =
      await getRecipeById(Number(recipeId), userId);

    // Check if recipe exists
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    // Check that the user is the author of the recipe
    if (recipe.authorId !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const imgUrl = recipe.imgUrl;

    // Delete recipe
    await prisma.recipe.delete({
      where: { id: Number(recipeId) },
    });

    // Delete image from S3
    try {
      await deleteImage(imgUrl);
    } catch (error) {
      console.log(error);
    }

    // Return recipe
    res.status(200).json({ message: 'Recipe deleted' });
    return;
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
