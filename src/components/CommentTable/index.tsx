import { Comment } from '@/types';
import CommentCard from './CommentCard';
import { useSession } from 'next-auth/react';
import Text from '../Text';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Button from '../Button';
import useComment from '@/hooks/useComment';
import { toast } from 'react-hot-toast';
import Loader from '../Loader';

interface CommentTableProps {
  comments: Comment[] | [] | null | undefined;
  recipeId: number;
}

const CommentTable = ({
  comments: initialComments,
  recipeId,
}: CommentTableProps) => {
  const [comments, setComments] = useState<Comment[] | null | undefined>(
    initialComments
  );
  const { data: session } = useSession();
  const [input, setInput] = useState<string>('');
  const { comment, isLoading, data } = useComment();

  const handleComment = async () => {
    try {
      await comment(recipeId, input);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
      return;
    }
    setInput('');
    toast.success('Comment posted');
  };

  useEffect(() => {
    if (data) {
      setComments((currentComments) => currentComments?.concat(data));
    }
  }, [data]);

  return (
    <div className="rounded-xl border bg-gray-100">
      {session ? (
        <div className="rounded-md m-5 p-3 bg-off-white flex flex-row shadow-xl">
          <Image
            src={session.user.image as string}
            width={100}
            height={50}
            alt="profile picture"
            className="object-cover w-10 h-10 rounded-full"
          />

          <form
            className="mx-3 flex flex-col justify-start items-start w-full"
            onSubmit={(e) => console.log(e.target)}
          >
            <Text className="decoration-1 text-cyan-700">
              {session.user.name}
            </Text>
            <textarea
              placeholder="Write your comment here..."
              className="w-full rounded-md p-2 border bg-gray-50"
              value={input}
              name="comment"
              onChange={(e) => setInput(e.target.value)}
            />
            <div className='flex flex-row justify-center items-center'>
              <Button
                className="ml-0 text-white rounded-md p-2 mt-2"
                type="button"
                onClick={handleComment}
              >
                Submit
              </Button>
              {isLoading ? <Loader size='36'/> : null}
            </div>
          </form>
        </div>
      ) : null}
      {!comments || comments[0] === null ? (
        <div className="text-center">No comments yet</div>
      ) : (
        comments.map((comment) => (
          <CommentCard comment={comment} key={comment.id} />
        ))
      )}
    </div>
  );
};

export default CommentTable;
