import { useSession } from 'next-auth/react';

const useLike = () => {
  const { data: session } = useSession();

  const like = async (recipeId: number, likedState: boolean): Promise<string> => {
    // We get the authorId from the session and authorize the user at the same time
    const authorId = session?.user?.id as string;
    if (!authorId) {
      throw new Error('Must be signed in to like a recipe');
    }

    // We send the recipeId to the API. Based on the likedState, the API will either create or delete a like.
    const method = likedState ? 'PUT' : 'POST';
    const { message, error } = await fetch('/api/like', {
      method,
      body: JSON.stringify({ recipeId }),
    }).then((res) => res.json());

    // Check if there is an error or if the message is not found
    if (error) {
      console.error(error);
      throw new Error(error);
    } else if (!message) {
      throw new Error('Like failed');
    }

    // If everything is ok, we return the message
    return message;
  };

  return { like };
};

export default useLike;
