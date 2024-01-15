import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Recipe } from '@/types';
import { getPopularRecipes, getRecentRecipes } from '@/prismaClient';
import Text from '@/components/Text';
import StaticRecipeTable from '@/components/StaticRecipeTable';

const Home = ({
  mostPopularRecipes,
  mostRecentRecipes,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="max-w-auto">
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
