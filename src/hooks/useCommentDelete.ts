import { useState } from 'react';

const useComment = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const remove = async (commentId: number) => {
    setIsLoading(true);
    const { error } = await fetch(`/api/comment/${commentId}`, {
      method: 'DELETE',
    }).then((res) => res.json());
    if (error) {
      setIsLoading(false);
      throw new Error(error);
    }
    setIsLoading(false);
  };

  return { isLoading, remove };
};

export default useComment;
