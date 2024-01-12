import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Recipe } from '@/types';
import { getPopularRecipes, getRecentRecipes } from '@/prismaClient';
import Text from '@/components/Text';
import RecipeCard from '@/components/RecipeCard';

const Home = ({
  mostPopularRecipes,
  mostRecentRecipes,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="max-w-auto">
      <Text header className="m-5">
        Most popular recipes
      </Text>
      <div className="m-5 grid bg-gray-50 border rounded-md">
        <div className="overflow-x-auto py-2">
          <div className="flex flex-row items-stretch justify-start w-max">
            {mostPopularRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                className="mx-5 w-48"
              />
            ))}
          </div>
        </div>
      </div>
      <Text header className="m-5">
        Most recent recipes
      </Text>
      <div className="m-5 grid bg-gray-50 border rounded-md overflow-x-auto">
        <div className="overflow-x-auto py-2">
          <div className="flex flex-row items-stretch justify-start w-max">
            {mostRecentRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                className="mx-5 w-48"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<{
  mostRecentRecipes: Recipe[];
  mostPopularRecipes: Recipe[];
}> = async () => {
  try {
    const mostRecentRecipes = await getRecentRecipes();
    const mostPopularRecipes = await getPopularRecipes();
    return {
      props: {
        mostRecentRecipes: JSON.parse(JSON.stringify(mostRecentRecipes)),
        mostPopularRecipes: JSON.parse(JSON.stringify(mostPopularRecipes)),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);

    return {
      notFound: true,
    };
  }
};
