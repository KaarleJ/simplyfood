import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { deleteImage } from '@/s3';
import prisma from '@/prismaClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const recipeId = Number(req.query.recipeId);
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { authorId: true, imgUrl: true },
  });
  if (!recipe) {
    res.status(404).json({ error: 'Recipe not found' });
    return;
  }
  // Check authorization
  const session = await getServerSession(req, res, authOptions);
  if (!session || recipe?.authorId !== session.user.id) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'DELETE') {
    try {
      await deleteImage(recipe.imgUrl);
      res.status(200).json({ success: true });
      return;
    } catch (error) {
      res.status(500).json({ error });
      return;
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
}