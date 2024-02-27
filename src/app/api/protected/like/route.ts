import prisma from '@/lib/prismaClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value as string;
  const recipeId = Number(req.cookies.get('recipeId')?.value);

  // We fetch the user from the db
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      likedRecipes: true,
    },
  });

  // We check if the recipe is already liked
  if (user?.likedRecipes.some((recipe) => recipe.id === recipeId)) {
    return NextResponse.json(
      { success: false, message: 'Recipe already liked' },
      { status: 400 }
    );
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

    return NextResponse.json(
      { success: true, message: 'Recipe liked' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value as string;
  const recipeId = Number(req.cookies.get('recipeId')?.value);

  // We fetch the user from the db
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      likedRecipes: true,
    },
  });

  let liked: boolean = false;

  // We check if the recipe is already liked
  if (user?.likedRecipes.some((recipe) => recipe.id === recipeId)) {
    liked = true;
  }

  // If the user has not liked the recipe, we return an error
  if (!liked) {
    return NextResponse.json(
      { success: false, message: 'Recipe not liked' },
      { status: 400 }
    );
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
    return NextResponse.json(
      { success: true, message: 'Recipe unliked' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
