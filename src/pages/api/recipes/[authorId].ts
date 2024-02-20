import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prismaClient';
import { Recipe } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authorId = req.query.authorId as string;
  const liked = req.query.liked as string | undefined;

  // For now we just assume that no one is going to have over 20 twenty recipe to their name
  // so we won't implement pagination for now
  if (req.method === 'GET') {
    try {
      let recipes: Recipe[];
      if (liked) {
        recipes = await prisma.recipe.findMany({
          where: {
            likedBy: {
              some: {
                id: authorId,
              },
            },
          },
        });
      } else {
        recipes = await prisma.recipe.findMany({
          where: {
            authorId,
          },
        });
      }
      res.status(200).json({ recipes });
      await prisma.$disconnect();
      return;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
        await prisma.$disconnect();
        return;
      }
      console.error(error);
      res.status(500).json({ error: 'Unable to fetch author' });
      await prisma.$disconnect();
      return;
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
    await prisma.$disconnect();
    return;
  }
}