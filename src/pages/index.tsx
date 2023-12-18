import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Recipe } from '@/types';
import { getPopularRecipes, getRecentRecipes } from '@/prismaClient';
import Link from 'next/link';
import Image from 'next/image';
import Text from '@/components/Text';

const Home = ({
  mostPopularRecipes,
  mostRecentRecipes,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="max-w-auto">
      <Text header className="m-5">
        Most popular recipes
      </Text>
      <div className="m-5 grid justify-center bg-gray-50 border rounded-md">
        <div className="overflow-x-auto">
          <div className="flex flex-row align-middle justify-start w-max">
            {mostPopularRecipes.map((recipe) => {
              return (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="shadow-lg w-48 mx-5 my-2 bg-off-white text-stone-700 hover:text-cyan-700 hover:brightness-90 transition-all"
                >
                  <Image
                    src={recipe.imgUrl}
                    alt={`Picture of ${recipe.title}`}
                    width={400}
                    height={300}
                    className="object-cover w-full h-48"
                  />
                  <h2 className="text-lg p-2 font-medium">{recipe.title}</h2>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Text header className="m-5">
        Most recent recipes
      </Text>
      <div className="m-5 grid justify-center bg-gray-50 border rounded-md">
        <div className="overflow-x-auto">
          <div className="flex flex-row align-middle justify-start w-max">
            {mostRecentRecipes.map((recipe) => {
              return (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="shadow-lg w-48 mx-5 my-2 bg-off-white text-stone-700 hover:text-cyan-700 hover:brightness-90 transition-all"
                >
                  <Image
                    src={recipe.imgUrl}
                    alt={`Picture of ${recipe.title}`}
                    width={400}
                    height={300}
                    className="object-cover w-full h-48"
                  />
                  <h2 className="text-lg p-2 font-medium">{recipe.title}</h2>
                </Link>
              );
            })}
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
