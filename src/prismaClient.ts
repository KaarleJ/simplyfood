import { PrismaClient } from '@prisma/client';
import { Recipe } from './types';

let prisma: PrismaClient;

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
export const getRecipeById = async (id: number) => {
  const [recipe]: (Recipe & { authorName: string })[] = await prisma.$queryRaw`
    SELECT "Recipe".*, "User"."avatarUrl", "User"."name" AS "authorName", COUNT("_UserLikedRecipes"."B") AS "likeCount"
    FROM "Recipe"
    LEFT JOIN "User" ON "Recipe"."authorId" = "User"."id"
    LEFT JOIN "_UserLikedRecipes" ON "Recipe"."id" = "_UserLikedRecipes"."A"
    WHERE "Recipe"."id" = ${id}
    GROUP BY "Recipe"."id", "User"."avatarUrl", "User"."name";
  `;

  // Convert BigInt to Number. This is necessary because Prisma returns BigInt and JSON.stringify() doesn't support BigInt.
  if (recipe) {
    recipe.likeCount = Number(recipe.likeCount);
  }

  return recipe;
};
