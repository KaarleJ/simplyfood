import { Comment } from '@/types';
import Text from '@/components/Text';
import Image from 'next/image';
import Button from '../Button';
import { Delete } from '@styled-icons/fluentui-system-filled';
import { useState } from 'react';
import DeleteCommentModal from '../Modal/DeleteCommentModal';

interface CommentCardProps {
  comment: Comment;
  userId?: string;
  handleDelete: (commentId: number) => Promise<void>;
}

const CommentCard = ({ comment, userId, handleDelete }: CommentCardProps) => {
  const [show, setShow] = useState<boolean>(false);
  const { authorName, avatarUrl, body, authorId } = comment;
  const author = userId === authorId;

  return (
    <div className="relative rounded-md m-5 p-3 bg-off-white flex flex-row shadow-xl">
      <Image
        src={avatarUrl as string}
        width={100}
        height={50}
        alt="profile picture"
        className="object-cover w-10 h-10 rounded-full"
      />
      <div className=" ml-3 flex flex-col justify-start items-start">
        <Text className="decoration-1 text-cyan-700">{authorName}</Text>
        <Text className="text-sm">{body}</Text>
      </div>

      {author ? (
        <Button
          className="bg-red-600 absolute top-0 right-0 !p-1 !mx-2 my-2"
          onClick={() => setShow(true)}
        >
          <Delete size="22" />
        </Button>
      ) : null}

      {show ? (
        <DeleteCommentModal
          comment={comment}
          onClose={() => setShow(false)}
          handleDelete={handleDelete}
        />
      ) : null}
    </div>
  );
};

export default CommentCard;
