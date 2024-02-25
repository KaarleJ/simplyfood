import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useRouter, useParams } from 'next/navigation';
import { Recipe } from '@/types';
import { toast } from 'react-hot-toast';
import useLike from './useLike';
import { useSession } from 'next-auth/react';

const useRecipe = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams<{ recipeId: string}>();
  const [recipe, setRecipe] = useState<Recipe>();
  const [likes, setLikes] = useState<number>();
  const [liked, setLiked] = useState<boolean>(false);
  const { like, loading: likeLoading } = useLike();
  const recipeId = Number(params?.recipeId);

  // This function handles liking and unliking a recipe
  const handleLike = async () => {
    if (!recipeId) return;
    try {
      await like(recipeId, liked);
      setLiked(!liked);
      if (likes !== null && likes !== undefined) {
        setLikes(liked ? likes - 1 : likes + 1);
      }
      if (liked) {
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

  // We fetch the recipe and the like status from the API
  // We wrap a normal fetch function in useSWR to cache the data
  const {
    data,
    error,
    isLoading: recipeLoading,
  } = useSWR(`/api/recipes/${recipeId}`, () =>
    fetch(`/api/recipes/${recipeId}`).then((res) => res.json())
  );

  // We set the recipe, likes and liked state when the data is fetched
  useEffect(() => {
    if (data) {
      setRecipe(data?.recipe);
      setLikes(data.recipe?.likeCount);
      setLiked(data.liked);
    }
  }, [data]);

  const remove = async (email: string) => {
    if (email !== session?.user.email) {
      // eslint-disable-next-line quotes
      toast.error("Email doesn't match");
      return;
    }
    if (!recipe) {
      toast.error('Recipe not found');
      return;
    }
    try {
      await fetch(`/api/protected/recipe/${recipe.id}`, {
        method: 'DELETE',
      });
      toast.success('Recipe deleted!');
      router.push('/recipes');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return {
    recipe,
    recipeLoading,
    likeLoading,
    error,
    liked,
    likes,
    handleLike,
    remove,
    session,
  };
};

export default useRecipe;
