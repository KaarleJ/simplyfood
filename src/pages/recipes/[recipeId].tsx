import { Recipe as RecipeType } from '@/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import prisma from '@/prismaClient';

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
      <div className="text-stone-700 m-5">
        <h1 className="text-3xl">{recipe.title}</h1>
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
        <h1 className="mt-5 text-xl">Instructions</h1>
        <a>{recipe.guide}</a>
      </div>
    </>
  );
};

export default Recipe;

export const getServerSideProps: GetServerSideProps<{
  recipe: RecipeType;
}> = async (context) => {
  const { params } = context;
  const recipe: RecipeType | null = await prisma.recipe.findUnique({
    where: {
      id: Number(params!.recipeId),
    },
  });
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
