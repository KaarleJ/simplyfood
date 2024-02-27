import { NextRequest, NextResponse } from 'next/server';
import { getRecipeById } from '@/lib/prismaClient';
import type { Recipe as RecipeType } from '@/types';
type Recipe = Omit<RecipeType, 'id'>;
import { getServerSession } from 'next-auth';
import { authOptions } from '@/next.config';

export async function GET(
  _req: NextRequest,
  { params }: { params: { recipeId: string } }
) {
  const { recipeId } = params;
  const session = await getServerSession(authOptions);
  const userId = session?.user.id as string | undefined;

  if (!recipeId) {
    return NextResponse.json({ error: 'Missing recipe id' }, { status: 400 });
  }
  // Get recipe by id
  const { recipe, liked }: { recipe: Recipe | null; liked: boolean } =
    await getRecipeById(Number(recipeId), userId);

  // Check if recipe exists
  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  // Return recipe
  return NextResponse.json({ recipe, liked });
}