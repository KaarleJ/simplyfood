import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/next.config';
import prisma from '@/prismaClient';
import type { Recipe as ReadyRecipe } from '@/types';
import { ValidationError } from 'yup';
import { recipeSchema } from '../../../validationSchemas';
type Recipe = Omit<ReadyRecipe, 'id'>;
import { deleteImage } from '@/s3';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: 'Must be signed in to create a recipe!' },
      { status: 401 }
    );
  }

  const body = await req.json();
  const recipe = body.recipe;

  if (!recipe) {
    return NextResponse.json({ error: 'Missing body' }, { status: 400 });
  }

  recipe.authorId = session.user.id;
  let validatedRecipe: Recipe;
  try {
    validatedRecipe = await recipeSchema.validate(recipe);
  } catch (error) {
    if (error instanceof ValidationError) {
      await deleteImage(recipe.imgUrl);
      return NextResponse.json({ error: error.errors[0] }, { status: 400 });
    } else {
      await deleteImage(recipe.imgUrl);
      return NextResponse.json(
        { error: 'Unable to validate recipe' },
        { status: 500 }
      );
    }
  }

  const createdRecipe = await prisma.recipe.create({
    data: {
      title: validatedRecipe.title,
      description: validatedRecipe.description,
      duration: validatedRecipe.duration,
      guide: validatedRecipe.guide,
      ingredients: validatedRecipe.ingredients,
      equipment: validatedRecipe.equipment,
      imgUrl: validatedRecipe.imgUrl,
      authorId: validatedRecipe.authorId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      guide: true,
      ingredients: true,
      equipment: true,
      imgUrl: true,
      authorId: true,
    },
  });

  return NextResponse.json(createdRecipe, { status: 201 });
}
