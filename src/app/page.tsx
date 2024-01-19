import Text from '@/components/Text';
import StaticRecipeTable from '@/components/StaticRecipeTable';
import { getPopularRecipes, getRecentRecipes } from '@/prismaClient';

export default async function Page() {
  const mostRecentRecipes = await getRecentRecipes();
  const mostPopularRecipes = await getPopularRecipes();

  return (
    <div className="max-w-auto">
      <Text header className='text-center m-5'>Welcome to SimplyFood! The home of all delicious recipes!</Text>
      <Text className="m-5 !text-2xl">
        Most popular recipes
      </Text>
      <StaticRecipeTable recipes={mostPopularRecipes} />
      <Text className="m-5 !text-2xl" >
        Most recent recipes
      </Text>
      <StaticRecipeTable recipes={mostRecentRecipes} />
    </div>
  );
}

export const revalidate = 300;