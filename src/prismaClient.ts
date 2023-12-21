/* eslint-disable indent */
import { PrismaClient } from '@prisma/client';
import { Recipe } from './types';

let prisma: PrismaClient;

// In the test environment we use a different database
if (process.env.NODE_ENV === 'test') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL,
      },
    },
  });
} else {
  prisma = new PrismaClient();
}

export default prisma;

// This function is used to get all recipes. It supports pagination and searching.
export const getRecipes = async (
  page: string = '1',
  query: string | undefined = undefined,
  take: number = 18
) => {
  let recipes: (Recipe & { likeCount: number })[];
  let count = 0;
  const skip = (parseInt(page) - 1) * 18;

  if (query) {
    recipes = await prisma.$queryRaw`
      SELECT "Recipe".*, COUNT("_UserLikedRecipes"."B") AS "likeCount"
    FROM "Recipe"
    LEFT JOIN "_UserLikedRecipes" ON "Recipe"."id" = "_UserLikedRecipes"."A"
    WHERE "Recipe"."title" ILIKE ${
      '%' + query + '%'
    } OR "Recipe"."description" ILIKE ${'%' + query + '%'}
    GROUP BY "Recipe"."id"
    ORDER BY "Recipe"."createdAt" DESC
    LIMIT ${take} OFFSET ${skip};
  `;
    count = await prisma.recipe.count({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  } else {
    recipes = await prisma.$queryRaw`
      SELECT "Recipe".*, COUNT("_UserLikedRecipes"."B") AS "likeCount"
      FROM "Recipe"
      LEFT JOIN "_UserLikedRecipes" ON "Recipe"."id" = "_UserLikedRecipes"."A"
      GROUP BY "Recipe"."id"
      ORDER BY "Recipe"."createdAt" DESC
      LIMIT ${take} OFFSET ${skip};
    `;
    count = await prisma.recipe.count();
  }

  // Convert BigInt to Number. This is necessary because Prisma returns BigInt and JSON.stringify() doesn't support BigInt.
  recipes = recipes.map((recipe) => ({
    ...recipe,
    likeCount: Number(recipe.likeCount),
  }));

  return { recipes, count };
};

// This function is used to get the most popular recipes for the homepage.
export const getPopularRecipes = async () => {
  const mostPopularRecipes: Recipe[] = await prisma.$queryRaw`
    SELECT "Recipe".*, COUNT("User"."id") AS "likeCount"
    FROM "Recipe"
    LEFT JOIN "_UserLikedRecipes" ON "Recipe"."id" = "_UserLikedRecipes"."A"
    LEFT JOIN "User" ON "User"."id" = "_UserLikedRecipes"."B"
    GROUP BY "Recipe"."id"
    ORDER BY "likeCount" DESC
    LIMIT 10;
  `;

  // Convert BigInt to Number. This is necessary because Prisma returns BigInt and JSON.stringify() doesn't support BigInt.
  const mostPopularRecipesWithLikeCount = mostPopularRecipes.map((recipe) => ({
    ...recipe,
    likeCount: Number(recipe.likeCount),
  }));

  return mostPopularRecipesWithLikeCount;
};

// This function is used to get the most recent recipes for the homepage.
export const getRecentRecipes = async () => {
  const mostRecentRecipes: Recipe[] = await prisma.$queryRaw`
    SELECT "Recipe".*, COUNT("User"."id") AS "likeCount"
    FROM "Recipe"
    LEFT JOIN "_UserLikedRecipes" ON "Recipe"."id" = "_UserLikedRecipes"."A"
    LEFT JOIN "User" ON "User"."id" = "_UserLikedRecipes"."B"
    GROUP BY "Recipe"."id"
    ORDER BY "Recipe"."createdAt" DESC
    LIMIT 10;
  `;

  // Convert BigInt to Number. This is necessary because Prisma returns BigInt and JSON.stringify() doesn't support BigInt.
  const mostRecentRecipesWithLikeCount = mostRecentRecipes.map((recipe) => ({
    ...recipe,
    likeCount: Number(recipe.likeCount),
  }));

  return mostRecentRecipesWithLikeCount;
};

// This function is used to get a recipe by its ID.
export const getRecipeById = async (id: number, userId: string | undefined) => {
  const [recipe]: (Recipe & { authorName: string })[] = await prisma.$queryRaw`
    SELECT "Recipe".*, "User"."avatarUrl", "User"."name" AS "authorName", COUNT("_UserLikedRecipes"."B") AS "likeCount"
    FROM "Recipe"
    LEFT JOIN "User" ON "Recipe"."authorId" = "User"."id"
    LEFT JOIN "_UserLikedRecipes" ON "Recipe"."id" = "_UserLikedRecipes"."A"
    WHERE "Recipe"."id" = ${id}
    GROUP BY "Recipe"."id", "User"."avatarUrl", "User"."name";
  `;

  let liked = false;

  // Check if the user has liked the recipe
  if (userId) {
    const userWithLikedRecipe = await prisma.user.findUnique({
      where: { id: userId },
      include: { likedRecipes: { where: { id: recipe.id } } },
    });
    if (!userWithLikedRecipe) {
      liked = false;
    } else {
      liked =
        userWithLikedRecipe && userWithLikedRecipe.likedRecipes.length > 0;
    }
  }

  // Convert BigInt to Number. This is necessary because Prisma returns BigInt and JSON.stringify() doesn't support BigInt.
  if (recipe) {
    recipe.likeCount = Number(recipe.likeCount);
  }

  return { recipe, liked };
};

export const likeRecipe = async (recipeId: number, userId: string) => {
  // Check if the user has already liked the recipe
  const existingLike = await prisma.user.findUnique({
    where: { id: userId },
    include: { likedRecipes: { where: { id: recipeId } } },
  });

  // If the user has already liked the recipe, return a message
  if (existingLike && existingLike.likedRecipes.length > 0) {
    return { message: 'User has already liked this recipe.' };
  }

  // If the user hasn't liked the recipe yet, create a new like
  const newLike = await prisma.user.update({
    where: { id: userId },
    data: { likedRecipes: { connect: { id: recipeId } } },
  });

  return newLike;
};
