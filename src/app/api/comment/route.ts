import { NextRequest, NextResponse } from 'next/server';
import { commentSchema } from '@/validationSchemas';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/next.config';
import prisma from '@/prismaClient';

export async function POST(req: NextRequest) {
  // Check authorization
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const comment = body.comment;

  // validate the comment
  try {
    await commentSchema.validate(comment);
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
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

  return NextResponse.json({ comment: commentToSend }, { status: 200 });
}
