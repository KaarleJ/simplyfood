import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/next.config';
import prisma from '@/prismaClient';

export async function DELETE(req: NextRequest, { params }: { params: { commentId: string } }) {
  // Check autherization
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const commentId = Number(params.commentId);
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  if (comment.authorId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return NextResponse.json({ message: 'Comment deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
