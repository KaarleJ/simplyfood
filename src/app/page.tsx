import Text from '@/components/Text';
import StaticRecipeTable from '@/components/StaticRecipeTable';
import { getPopularRecipes, getRecentRecipes } from '@/prismaClient';

export default async function Page() {
  const mostRecentRecipes = await getRecentRecipes();
  const mostPopularRecipes = await getPopularRecipes();

  return (
    <div className="max-w-auto">
      <Text header className="text-center m-10 p-5 text-5xl bg-lime-300 text-white shadow-lg rounded-md">
        Simplyfood, the home of all delicious recipes!
      </Text>
      <Text header className="m-5">
        Most popular recipes
      </Text>
      <StaticRecipeTable recipes={mostPopularRecipes} />
      <Text header className="m-5">
        Most recent recipes
      </Text>
      <StaticRecipeTable recipes={mostRecentRecipes} />
    </div>
  );
}

export const revalidate = 300;
