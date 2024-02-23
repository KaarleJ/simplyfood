import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/next.config';
import { deleteImage } from '@/s3';
import prisma from '@/prismaClient';

export async function DELETE(_req: NextRequest, { params }: { params: { recipeId: string } }) {
  const recipeId = Number(params.recipeId);
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { authorId: true, imgUrl: true },
  });
  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }
  const session = await getServerSession(authOptions);
  if (!session || recipe?.authorId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await deleteImage(recipe.imgUrl);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
