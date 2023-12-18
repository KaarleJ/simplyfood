import { Recipe as RecipeType } from '@/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { getRecipeById } from '@/prismaClient';
import Text from '@/components/Text';

// This page renders a recipe with the id that is passed in the url.
const Recipe = ({
  recipe,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Image
        src={recipe.imgUrl}
        alt={`Picture of ${recipe.title}`}
        width={1920}
        height={1080}
        className="object-cover w-full h-96 xl:h-128 2xl:h-144 shadow-lg"
      />
      <div className="flex flex-row justify-between">
        <div className="text-stone-700 m-5">
          <Text header className="self-end">
            {recipe.title}
          </Text>
          <p className="italic">{recipe.description}</p>
          <h1 className="mt-2 text-xl">Ingredients:</h1>
          <ul className="ml-4 list-disc">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          {recipe.equipment ? (
            <>
              <h1 className="mt-2 text-xl">Cooking equipment:</h1>
              <ul className="ml-4 list-disc">
                {recipe.equipment.map((equipment) => (
                  <li key={equipment}>{equipment}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        <div className="flex flex-col justify-start items-center mt-5">
          {recipe.avatarUrl ? (
            <Image
              src={recipe.avatarUrl}
              alt="Author profile picture"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          ) : null}
          {recipe.authorName ? (
            <Text header className="m-5">
              {recipe.authorName}
            </Text>
          ) : null}
        </div>
      </div>
      <div className='mx-4'>
        <h1 className="text-xl">Instructions</h1>
        <a>{recipe.guide}</a>
      </div>
    </>
  );
};

export default Recipe;

// This function fetches the data for the recipe with the id that is passed in the url.
// This function is used to build the page on every request.
export const getServerSideProps: GetServerSideProps<{
  recipe: RecipeType;
}> = async (context) => {
  const { params } = context;
  const recipe: RecipeType | null = await getRecipeById(
    Number(params?.recipeId)
  );
  if (!recipe) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      recipe: JSON.parse(JSON.stringify(recipe)),
    },
  };
};
