import { Recipe as RecipeType } from '@/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { getRecipeById } from '@/prismaClient';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { Like, Share } from 'styled-icons/boxicons-regular';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import useLike from '@/hooks/useLike';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

// This page renders a recipe with the id that is passed in the url.
const Recipe = ({
  recipe,
  liked,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [likes, setLikes] = useState(recipe.likeCount);
  const [likedState, setLikedState] = useState(liked);
  const { like } = useLike();

  const handleLike = async () => {
    try {
      await like(recipe.id, likedState);
      setLikedState(!likedState);
      if (likes !== null && likes !== undefined ) {
        setLikes(likedState ? likes - 1 : likes + 1);
      }
      if (likedState) {
        toast.success('Recipe unliked');
      } else {
        toast.success('Recipe liked');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // This function copies the url to the clipboard and displays a toast notification.
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

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
        <div className="flex flex-col justify-start items-center">
          <div className="flex flex-row items-center mr-4 mt-5">
            <Text className="self-center">{likes}</Text>
            <Button
              type="button"
              className="mx-2 "
              onClick={handleLike}
              toggled={likedState}
            >
              <Like size="24" />
            </Button>
            <Button type="button" className="mx-2" onClick={handleShare}>
              <Share size="24" />
            </Button>
          </div>
          {recipe.avatarUrl ? (
            <Image
              src={recipe.avatarUrl}
              alt="Author profile picture"
              width={100}
              height={100}
              className="rounded-full object-cover mt-5"
            />
          ) : null}
          {recipe.authorName ? (
            <Text header className="m-5">
              {recipe.authorName}
            </Text>
          ) : null}
        </div>
      </div>
      <div className="mx-4">
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
  liked: boolean;
}> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = Number(session?.user?.id) as number | undefined;

  // We get the recipe id from the url.
  const { params } = context;
  // We fetch the recipe from the DB using the id.
  const { recipe, liked }: { recipe: RecipeType | null; liked: boolean } =
    await getRecipeById(Number(params?.recipeId), userId);
  if (!recipe) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      recipe: JSON.parse(JSON.stringify(recipe)),
      liked,
    },
  };
};
