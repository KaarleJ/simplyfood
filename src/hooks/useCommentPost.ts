import { useState } from 'react';
import { Comment } from '@/types';

const useComment = () => {

  const [data, setData] = useState<Comment>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const comment = async (recipeId: number, body: string) => {

    setIsLoading(true);
    const { comment, error } = await fetch('/api/comment', {
      method: 'POST',
      body: JSON.stringify({
        comment: {
          recipeId,
          body,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
    if (error) {
      setIsLoading(false);
      throw new Error(error);
    } else if (!comment) {
      setIsLoading(false);
      throw new Error('Comment failed');
    }

    setData(comment as Comment);
    setIsLoading(false);
  };

  return { data, isLoading, comment };
};

export default useComment;
