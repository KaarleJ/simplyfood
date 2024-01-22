'use client';
import Button from '@/components/Button';
import Image from 'next/image';
import Text from '@/components/Text';
import Loader from '@/components/Loader';
import { Like, Share } from 'styled-icons/boxicons-regular';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import DeleteRecipeModal from '@/components/Modal/DeleteRecipeModal';
import useRecipe from '@/hooks/useRecipe';
import { Recipe } from '@/types';

const RecipeActionComponents = ({ recipe }: { recipe: Recipe}) => {
  const {
    likeLoading,
    liked,
    likes,
    handleLike,
    remove,
    session,
  } = useRecipe();
  const [show, setShow] = useState<boolean>(false);

  // This function copies the url to the clipboard and displays a toast notification.
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <>
      <div className="flex flex-col justify-start items-center">
        <div className="grid grid-cols-2 sm:flex flex-row items-start justify-center sm:mr-4 mt-5">
          <Button
            type="button"
            className="!mx-1 my-1 text-md flex flex-row"
            onClick={handleLike}
            toggled={liked}
          >
            {likeLoading ? (
              <Loader size="24" />
            ) : (
              <>
                {likes}
                <Like size="20" />
              </>
            )}
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
      {show ? (
        <DeleteRecipeModal remove={remove} onClose={() => setShow(false)} />
      ) : null}
    </>
  );
};

export default RecipeActionComponents;
