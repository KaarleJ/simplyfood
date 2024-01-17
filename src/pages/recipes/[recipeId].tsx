import Image from 'next/image';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { Like, Share } from 'styled-icons/boxicons-regular';
import { toast } from 'react-hot-toast';
import Loader from '@/components/Loader';
import CommentTable from '@/components/CommentTable';
import useRecipe from '@/hooks/useRecipe';
import Link from 'next/link';
import DeleteRecipeModal from '@/components/Modal/DeleteRecipeModal';
import { useState } from 'react';

// This page renders a recipe with the id that is passed in the url.
const Recipe = () => {
  const { recipe, error, loading, liked, likes, handleLike, remove, session } =
    useRecipe();
  const [show, setShow] = useState<boolean>(false);

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
          <div className="grid grid-cols-2 sm:flex flex-row items-start justify-center sm:mr-4 mt-5">
            <Button
              type="button"
              className="!mx-1 my-1 text-md flex flex-row"
              onClick={handleLike}
              toggled={liked}
            >
              {likes}
              <Like size="20"/>
            </Button>
            <Button type="button" onClick={handleShare} className="!mx-1 my-1">
              <Share size="24" />
            </Button>
            {session?.user.id === recipe.authorId ? (
              <>
                <Button className="!mx-1 my-1">
                  <Link href={`/create/${recipe.id}`}>edit</Link>
                </Button>
                <Button
                  className="bg-red-600 !mx-1 my-1"
                  onClick={() => setShow(true)}
                >
                  delete
                </Button>
              </>
            ) : null}
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
        <CommentTable
          comments={recipe.comments}
          recipeId={recipe.id}
          session={session}
        />
      </div>

      {show ? (
        <DeleteRecipeModal remove={remove} onClose={() => setShow(false)} />
      ) : null}
    </>
  );
};

export default Recipe;
