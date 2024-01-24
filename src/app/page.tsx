import Text from '@/components/Text';
import StaticRecipeTable from '@/components/RecipeTable';
import { getPopularRecipes, getRecentRecipes } from '@/prismaClient';

export default async function Page() {
  const mostRecentRecipes = await getRecentRecipes();
  const mostPopularRecipes = await getPopularRecipes();

  return (
    <div className="max-w-auto">
      <Text
        data-testid="banner"
        header
        className="text-center m-10 p-5 hidden sm:block text-5xl bg-lime-300 text-white shadow-lg rounded-md"
      >
        Simplyfood, the home of all delicious recipes!
      </Text>
      <div className="sm:hidden bg-lime-300 rounded-sm p-2 shadow-lg ">
        <Text header className="text-center text-white">
          Simplyfood
        </Text>
        <Text className="text-center text-white">
          The home of all delicious recipes!
        </Text>
      </div>
      <Text data-testid="popular" header className="m-5">
        Most popular recipes
      </Text>
      <StaticRecipeTable recipes={mostPopularRecipes} />
      <Text data-testid="recent" header className="m-5">
        Most recent recipes
      </Text>
      <StaticRecipeTable recipes={mostRecentRecipes} />
    </div>
  );
}

export const revalidate = 300;
