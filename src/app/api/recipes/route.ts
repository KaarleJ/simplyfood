import { NextRequest, NextResponse } from 'next/server';
import { Recipe } from '@/types';
import { getRecipes } from '@/lib/prismaClient';

export async function GET(req: NextRequest) {
  const searchQuery = req.nextUrl.searchParams.get('search') || undefined;
  const page = req.nextUrl.searchParams.get('page') || undefined;

  let recipes: Recipe[];
  let count: number;
  try {
    const results = await getRecipes(page, searchQuery);
    recipes = results.recipes;
    count = results.count;
    return NextResponse.json({ recipes, count }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error(error);
    return NextResponse.json(
      { error: 'Unable to fetch recipes' },
      { status: 500 }
    );
  }
}
