import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/types';
import SearchBar from '@/components/SearchBar';
import Text from '@/components/Text';
import PageBar from '@/components/PageBar';
import { Like } from 'styled-icons/boxicons-regular';
import { getRecipes } from '@/prismaClient';

const Recipes = ({
  recipes,
  count,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [query, setQuery] = useState<string>(''); // query state for search bar
  const [page, setPage] = useState<number>(1); // page state for pagination
  const router = useRouter(); // router for url query

  // set query state if query is in url
  useEffect(() => {
    if (router.query.search) {
      setQuery(router.query.search as string);
    }
    if (router.query.page) {
      setPage(parseInt(router.query.page as string));
    }
  }, [router.query]);

  return (
    <div className="flex flex-col min-h-loose justify-between">
      <div>
        <SearchBar
          className="flex flex-row items-center justify-between m-4 text-stone-600"
          query={query}
          setQuery={setQuery}
        />

        <Text className="text-md ml-4 flex justify-center mr-5">
          Page {page} of {Math.ceil(count / 18)}
        </Text>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 m-4">
          {recipes.map((recipe) => {
            return (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="shadow-lg h-full w-full bg-off-white text-stone-700 hover:text-cyan-700 hover:brightness-90 transition-all"
              >
                <Image
                  src={recipe.imgUrl}
                  alt={`Picture of ${recipe.title}`}
                  width={400}
                  height={300}
                  className="object-cover w-full h-48"
                />
                <div className="flex flex-row justify-between">
                  <h2 className="text-lg p-2 font-medium">{recipe.title}</h2>
                  <div className="flex flex-row justify-center">
                    <Text className="text-md mt-2 font-medium">
                      {recipe.likeCount}
                    </Text>
                    <Like className="w-6 h-6 ml-1 my-2 mr-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <PageBar
        search={query}
        pages={Math.ceil(count / 18)}
        currentPage={page}
        className=""
      />
    </div>
  );
};

export default Recipes;

// We use getServerSideProps to fetch the recipes from the database.
export const getServerSideProps: GetServerSideProps<{
  recipes: Recipe[];
  count: number;
}> = async (context) => {
  // We get the search query and page from the url
  const searchQuery = context.query.search as string | undefined;
  const page = context.query.page as string | undefined;

  let recipes: Recipe[];
  let count: number;
  try {
    // We fetch the recipes and count from the database
    const res = await getRecipes(page, searchQuery);
    recipes = res.recipes;
    count = res.count;
    // We return the recipes and count as props
    return {
      props: {
        recipes: JSON.parse(JSON.stringify(recipes)),
        count,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      notFound: true,
    };
  }
};
