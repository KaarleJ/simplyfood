import { Recipe as RecipeType } from '@/types';
import Image from 'next/image';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { Like, Share } from 'styled-icons/boxicons-regular';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import useLike from '@/hooks/useLike';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Loader from '@/components/Loader';

// This page renders a recipe with the id that is passed in the url.
const Recipe = () => {
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeType>();
  const [likes, setLikes] = useState<number>();
  const [likedState, setLikedState] = useState<boolean>(false);
  const { like } = useLike();

  const recipeId = Number(router.query.recipeId);

  const handleLike = async () => {
    if (!recipeId) return;
    try {
      await like(recipeId, likedState);
      setLikedState(!likedState);
      if (likes !== null && likes !== undefined) {
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

  // Fetcher function for SWR
  const fetcher = () =>
    fetch(`/api/recipe/${recipeId}`).then((res) => res.json());

  // Fetch recipe from api
  const { data, error, isLoading } = useSWR(`/api/recipe/${recipeId}`, fetcher);

  useEffect(() => {
    if (data) {
      setRecipe(data.recipe);
      setLikes(data.recipe.likeCount);
      setLikedState(data.liked);
    }
  }, [data]);

  if (error) return <div>Failed to load</div>;
  if (isLoading || !recipe)
    return (
      <div className="flex flex-col justify-center items-center bg-blue-100 self-center">
        <Loader />
      </div>
    );

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
