import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/next.config';
import prisma from '@/prismaClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const commentId = Number(req.query.commentId);
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    res.status(404).json({ error: 'Comment not found' });
    return;
  }

  if (comment.authorId !== session.user.id) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'DELETE') {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    res.status(200).json({ message: 'Comment deleted' });
    return;
  } else {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
}
