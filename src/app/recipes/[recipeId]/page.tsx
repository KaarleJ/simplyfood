import Image from 'next/image';
import Text from '@/components/Text';
import CommentTable from '@/components/CommentTable';
import RecipeActionComponents from './RecipeActionComponents';
import { getRecipeById } from '@/prismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/next.config';

// This page renders a recipe with the id that is passed in the url.
const Recipe = async ({ params }: { params: { recipeId: string } }) => {
  const { recipeId } = params;
  const session = await getServerSession(authOptions);
  const { recipe } = await getRecipeById(Number(recipeId), session?.user?.id);

  if (!recipe) {
    return (
      <div className="flex flex-col justify-center items-center self-center h-screen">
        <Text className="text-3xl">Recipe not found</Text>
      </div>
    );
  }

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
          <Text header className="self-end text-4xl">
            {recipe.title}
          </Text>
          <Text className="italic text-lg">{recipe.description}</Text>
          <Text header className="mt-2 text-2xl">
            Ingredients:
          </Text>
          <ul className="ml-4 list-disc text-lg italic">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          {recipe.equipment ? (
            <>
              <Text header className="mt-2 text-2xl">
                Cooking equipment:
              </Text>
              <ul className="ml-4 list-disc text-lg italic">
                {recipe.equipment.map((equipment) => (
                  <li key={equipment}>{equipment}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        <RecipeActionComponents recipe={recipe} />
      </div>
      <div className="mx-4">
        <Text header className="text-2xl">
          Instructions
        </Text>
        <Text className="text-sm">{recipe.guide}</Text>
      </div>
      <div className="mx-4 mt-10">
        <Text header className="text-2xl mb-2">
          Comments
        </Text>
        <CommentTable
          comments={recipe.comments}
          recipeId={recipe.id}
          session={session}
        />
      </div>
    </>
  );
};

export default Recipe;
