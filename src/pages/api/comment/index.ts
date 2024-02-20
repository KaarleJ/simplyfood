import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import * as yup from 'yup';
import prisma from '@/prismaClient';
import { commentSchema } from '../../../validationSchemas';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authorization
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: 'Must be signed in to create a recipe!' });
    await prisma.$disconnect();
    return;
  }

  if (req.method === 'POST') {
    // Validate the comment
    const comment = req.body.comment;
    if (!comment) {
      res.status(400).json({ error: 'Missing body' });
      await prisma.$disconnect();
      return;
    }
    try {
      await commentSchema.validate(req.body.comment);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.status(400).json({ error: error.errors[0] });
        await prisma.$disconnect();
        return;
      } else {
        res.status(500).json({ error: 'Internal server error' });
        await prisma.$disconnect();
        return;
      }
    }

    // Create the comment in db
    const createdComment = await prisma.comment.create({
      data: {
        body: comment.body,
        author: {
          connect: {
            id: session.user.id,
          },
        },
        recipe: {
          connect: {
            id: comment.recipeId,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // We map the object to match the type
    const commentToSend = {
      id: createdComment.id,
      body: createdComment.body,
      authorId: createdComment.author.id,
      authorName: createdComment.author.name,
      avatarUrl: createdComment.author.avatarUrl,
      createdAt: createdComment.createdAt,
      recipeId: createdComment.recipeId,
    };

    // Send the created comment back to the client
    res.status(201).json({ comment: commentToSend });
    await prisma.$disconnect();
    return;
  } else {
    res.status(405).json({ message: 'Method not allowed' });
    await prisma.$disconnect();
    return;
  }
}
