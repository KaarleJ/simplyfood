import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Comment } from '@/types';

const useComment = () => {
  const { data: session } = useSession();

  const [data, setData] = useState<Comment>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const comment = async (recipeId: number, body: string) => {
    // We get the authorId from the session and authorize the user at the same time
    const authorId = session?.user?.id as string;
    if (!authorId) {
      throw new Error('Must be signed in to comment a recipe');
    }

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
      throw new Error(error);
    } else if (!comment) {
      throw new Error('Comment failed');
    }

    setData(comment as Comment);
    setIsLoading(false);
  };

  return { data, isLoading, comment };
};

export default useComment;
