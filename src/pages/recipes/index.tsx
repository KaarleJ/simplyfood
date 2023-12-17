import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/types';
import prisma from '@/prismaClient';
import SearchBar from '@/components/SearchBar';

const Recipes = ({
  recipes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [query, setQuery] = useState<string>(''); // query state for search bar
  const router = useRouter(); // router for url query

  // set query state if query is in url
  useEffect(() => {
    if (router.query.search) {
      setQuery(router.query.search as string);
    }
  }, [router.query.search]);

  return (
    <>
      <SearchBar
        className="flex flex-row items-center justify-between m-4 text-stone-600"
        query={query}
        setQuery={setQuery}
      />
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
              <h2 className="text-lg p-2 font-medium">{recipe.title}</h2>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Recipes;

// We use getServerSideProps to fetch the recipes from the database.
export const getServerSideProps: GetServerSideProps<{
  recipes: Recipe[];
}> = async (context) => {
  // We get the search query from the url
  const searchQuery = context.query.search as string;

  try {
    let recipes: Recipe[];
    // If there is a search query, we search for recipes that match the query
    if (searchQuery) {
      recipes = await prisma.recipe.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
      });
      // If there is no search query, we fetch all recipes
    } else {
      recipes = await prisma.recipe.findMany();
    }
    // We return the recipes as props
    return {
      props: {
        recipes: JSON.parse(JSON.stringify(recipes)),
      },
    };
  } catch (error) {
    console.log(error);

    return {
      notFound: true,
    };
    // We disconnect prismaClient
  }
};
