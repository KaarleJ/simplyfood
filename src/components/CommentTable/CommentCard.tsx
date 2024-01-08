import { Comment } from '@/types';
import Text from '@/components/Text';
import Image from 'next/image';

interface CommentCardProps {
  comment: Comment;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const { id, authorName, avatarUrl, body } = comment;
  return (
    <div className="rounded-md m-5 p-3 bg-off-white flex flex-row shadow-xl">
      <Image
        src={avatarUrl as string}
        width={100}
        height={50}
        alt="profile picture"
        className="object-cover w-10 h-10 rounded-full"
      />
      <div className=" ml-3 flex flex-col justify-start items-start">
        <Text className='decoration-1 text-cyan-700'>{authorName}</Text>
        <Text className="text-sm">{body}</Text>
      </div>
    </div>
  );
};

export default CommentCard;
