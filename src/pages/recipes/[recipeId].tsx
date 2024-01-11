import Image from 'next/image';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { Like, Share } from 'styled-icons/boxicons-regular';
import { toast } from 'react-hot-toast';
import Loader from '@/components/Loader';
import CommentTable from '@/components/CommentTable';
import useRecipe from '@/hooks/useRecipe';

// This page renders a recipe with the id that is passed in the url.
const Recipe = () => {
  const { recipe, error, loading, liked, likes, handleLike } = useRecipe();

  // This function copies the url to the clipboard and displays a toast notification.
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center self-center h-screen">
        <Text className="text-3xl">Recipe not found</Text>
      </div>
    );
  }
  if (loading || !recipe)
    return (
      <div className="flex flex-col justify-center items-center self-center h-screen">
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
        <div className="flex flex-col justify-start items-center">
          <div className="flex flex-row items-center mr-4 mt-5">
            <Text className="self-center">{likes}</Text>
            <Button
              type="button"
              className="mx-2 "
              onClick={handleLike}
              toggled={liked}
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
        <Text header className="text-2xl">
          Instructions
        </Text>
        <Text className="text-sm">{recipe.guide}</Text>
      </div>
      <div className="mx-4 mt-10">
        <Text header className="text-2xl mb-2">
          Comments
        </Text>
        <CommentTable comments={recipe.comments} recipeId={recipe.id}/>
      </div>
    </>
  );
};

export default Recipe;
