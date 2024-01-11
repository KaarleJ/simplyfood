import { NextApiRequest, NextApiResponse } from 'next';
import { getRecipes } from '@/prismaClient';
import { Recipe } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const searchQuery = req.query.search as string | undefined;
  const page = req.query.page as string | undefined;

  if (req.method === 'GET') {
    let recipes: Recipe[];
    let count: number;
    try {
      const results = await getRecipes(page, searchQuery);
      recipes = results.recipes;
      count = results.count;
      res.status(200).json({ recipes, count });
      return;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ error: 'Unable to fetch recipes' });
      return;
    }
  }
}
