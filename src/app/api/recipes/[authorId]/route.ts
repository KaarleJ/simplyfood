import { NextRequest, NextResponse } from 'next/server';
import { Recipe } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { authorId: string; liked: string } }
) {
  const { authorId, liked } = params;

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
    return NextResponse.json({ recipes }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error(error);
    return NextResponse.json(
      { error: 'Unable to fetch author' },
      { status: 500 }
    );
  }
}
