import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getRecipeById } from '@/prismaClient';
import { authOptions } from '../auth/[...nextauth]';
import { Recipe } from '@/types';

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
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
