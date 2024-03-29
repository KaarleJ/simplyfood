import { NextRequest, NextResponse } from 'next/server';
import { getRecipeById } from '@/lib/prismaClient';
import type { Recipe as RecipeType } from '@/types';
type Recipe = Omit<RecipeType, 'id'>;
import { recipeSchema } from '@/validationSchemas';
import { ValidationError } from 'yup';
import prisma from '@/lib/prismaClient';
import { deleteImage } from '@/lib/s3';

export async function PUT(
  req: NextRequest,
  { params }: { params: { recipeId: string } }
) {
  const { recipeId } = params;
  const userId = req.cookies.get('userId')?.value as string;

  if (!recipeId) {
    return NextResponse.json({ error: 'Missing recipe id' }, { status: 400 });
  }

  // Validate the recipe
  const body = await req.json();
  if (!body.recipe) {
    return NextResponse.json(
      { error: 'Missing recipe in body' },
      { status: 400 }
    );
  }
  let validatedRecipe: Recipe;
  try {
    validatedRecipe = await recipeSchema.validate(body.recipe);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.errors[0] }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: 'Unable to validate recipe' },
        { status: 500 }
      );
    }
  }

  // Get recipe by id
  const { recipe }: { recipe: Recipe | null; liked: boolean } =
    await getRecipeById(Number(recipeId), userId);

  // Check if recipe exists
  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  // Check if the user is the author of the recipe
  if (recipe.authorId !== userId) {
    return NextResponse.json(
      { error: 'You are not the author of this recipe' },
      { status: 403 }
    );
  }

  // Update the recipe
  const updatedRecipe = await prisma.recipe.update({
    where: { id: Number(recipeId) },
    data: {
      title: validatedRecipe.title,
      description: validatedRecipe.description,
      duration: validatedRecipe.duration,
      guide: validatedRecipe.guide,
      ingredients: validatedRecipe.ingredients,
      equipment: validatedRecipe.equipment,
      imgUrl: validatedRecipe.imgUrl,
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

  return NextResponse.json({ updatedRecipe }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { recipeId: string } }
) {
  const { recipeId } = params;
  const userId = req.cookies.get('userId')?.value as string;

  if (!recipeId) {
    return NextResponse.json({ error: 'Missing recipe id' }, { status: 400 });
  }

  // Get recipe by id
  const { recipe }: { recipe: Recipe | null; liked: boolean } =
    await getRecipeById(Number(recipeId), userId);

  // Check if recipe exists
  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  // Check that the user is the author of the recipe
  if (recipe.authorId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const imgUrl = recipe.imgUrl;

  // Delete recipe
  await prisma.recipe.delete({ where: { id: Number(recipeId) } });

  // Delete image from s3
  try {
    await deleteImage(imgUrl);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Unable to delete image' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: 'Recipe deleted' },
    { status: 200 }
  );
}
