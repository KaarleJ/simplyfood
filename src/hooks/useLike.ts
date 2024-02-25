import { useState } from 'react';


// This hook handles the api request to like a recipe
const useLike = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const like = async (
    recipeId: number,
    likedState: boolean
  ): Promise<string> => {
    setLoading(true);
    // We send the recipeId to the API. Based on the likedState, the API will either create or delete a like.
    const method = likedState ? 'PUT' : 'POST';
    const { message, error } = await fetch('/api/protected/like', {
      method,
      body: JSON.stringify({ recipeId }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());

    // Check if there is an error or if the message is not found
    if (error) {
      console.error(error);
      setLoading(false);
      throw new Error(error);
    } else if (!message) {
      setLoading(false);
      throw new Error('Like failed');
    }


    setLoading(false);

    // If everything is ok, we return the message
    return message;
  };

  return { like, loading };
};

export default useLike;
