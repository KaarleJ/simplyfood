import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '@/prismaClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check autherization
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  // Check if the recipeId is in the body
  if (!JSON.parse(req.body).recipeId) {
    res.status(400).json({ error: 'Missing recipeId in body' });
    return;
  }
  // Check if the user id is in the session
  if (session.user.id === undefined) {
    res.status(400).json({ error: 'Missing id in session' });
    return;
  }
  const userId = Number(session.user.id);
  const recipeId = Number(JSON.parse(req.body).recipeId);

  // We check if the recipe is already liked
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      likedRecipes: true,
    },
  });

  let liked = false;

  // If the user has liked the recipe, we set liked to true
  if (user?.likedRecipes.some((recipe) => recipe.id === recipeId)) {
    liked = true;
  }

  // If the request is a POST request, we create a new like
  if (req.method === 'POST') {
    if (liked) {
      res.status(400).json({ error: 'Recipe already liked' });
      return;
    }

    // Create the like in db
    try {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          likedRecipes: {
            connect: {
              id: recipeId,
            },
          },
        },
      });
      res.status(200).json({ message: 'Recipe liked' });
      return;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // If the request is a PUT request, we update the like
  } else if (req.method === 'PUT') {
    // If the user hasn't liked this post, return an error
    if (!liked) {
      res.status(400).json({ error: 'Recipe not liked' });
      return;
    }

    // Update the user in db
    try {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          likedRecipes: {
            disconnect: {
              id: recipeId,
            },
          },
        },
      });

      res.status(200).json({ message: 'Recipe unliked' });
      return;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        res.status(500).json({ error: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }
}
