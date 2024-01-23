'use client';
import Modal from '.';
import Text from '../Text';
import { Comment } from '@/types';
import Button from '../Button';
import Image from 'next/image';
import { useState } from 'react';
import Loader from '../Loader';

interface DeleteCommentModalProps {
  comment: Comment;
  onClose: () => void;
  handleDelete: (commentId: number) => Promise<void>;
}

const DeleteCommentModal = ({
  comment,
  onClose,
  handleDelete,
}: DeleteCommentModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { authorName, avatarUrl, body, id } = comment;

  const handleClick = async () => {
    setLoading(true);
    await handleDelete(id);
    setLoading(false);
  };

  return (
    <Modal>
      <Text>Are you sure you want to delete this comment?</Text>
      <div className="rounded-md m-5 p-3 bg-off-white flex flex-row shadow-xl">
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
      </div>
      <div className="flex flex-row justify-center">
        <Button className="!mx-1 my-1" onClick={onClose}>
          Cancel
        </Button>
        {loading ? (
          <Button className="bg-red-600 !mx-1 my-1 w-16" disabled>
            <Loader size='24'/>
          </Button>
        ) : (
          <Button className="bg-red-600 !mx-1 my-1" onClick={handleClick}>
            Delete
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default DeleteCommentModal;
