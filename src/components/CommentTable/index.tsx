'use client';
import { Comment } from '@/types';
import CommentCard from './CommentCard';
import Text from '../Text';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Button from '../Button';
import useCommentPost from '@/hooks/useCommentPost';
import useCommentDelete from '@/hooks/useCommentDelete';
import { toast } from 'react-hot-toast';
import Loader from '../Loader';
import { Session } from 'next-auth';

interface CommentTableProps {
  comments: Comment[] | [] | null | undefined;
  recipeId: number;
  session: Session | null;
}

const CommentTable = ({
  comments: initialComments,
  recipeId,
  session,
}: CommentTableProps) => {
  const [comments, setComments] = useState<Comment[] | null | undefined>(
    initialComments
  );
  const [input, setInput] = useState<string>('');
  const { comment, isLoading: postLoading, data } = useCommentPost();
  const { remove, isLoading: deleteLoading } = useCommentDelete();

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

  const handleDelete = async (commentId: number) => {
    try {
      await remove(commentId);
      setComments((currentComments) =>
        currentComments?.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
      return;
    }
    toast.success('Comment deleted');
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
            <div className="flex flex-row justify-center items-center">
              <Button
                className="ml-0 text-white rounded-md p-2 mt-2"
                type="button"
                onClick={handleComment}
              >
                Submit
              </Button>
              {postLoading ? <Loader size="36" /> : null}
            </div>
          </form>
        </div>
      ) : null}
      {!comments || comments[0] === undefined ? (
        <div className="text-center w-full h-28">
          <Text className="text-2xl mt-10">No comments yet</Text>
        </div>
      ) : (
        comments.map((comment) => (
          <CommentCard
            comment={comment}
            key={comment.id}
            userId={session?.user.id}
            handleDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default CommentTable;
