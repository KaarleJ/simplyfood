import Text from '../Text';
import { useState } from 'react';
import Button from '../Button';
import Modal from '.';

interface DeleteModalProps {
  remove: (email: string) => Promise<void>;
  onClose: () => void;
}

const DeleteRecipeModal = ({ remove, onClose }: DeleteModalProps) => {
  const [email, setEmail] = useState<string>('');

  const handleDelete = async (event: React.FormEvent) => {
    event.preventDefault();
    await remove(email);
  };

  return (
    <Modal>
      <form
        onSubmit={handleDelete}
        className="flex flex-col items-center justify-center"
      >
        <Text className="font-bold">
          Are you sure you want to delete the recipe?
        </Text>
        <Text className="mb-4">This action cannot be undone!</Text>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email to confirm removal"
          required
          className="border border-stone-400 rounded-md p-2 m-2 text-stone-500 text-md w-md max-w-lg"
        />
        <div className="flex flex-row justify-center items-center w-min">
          <Button onClick={onClose} className="!mx-1">
            Cancel
          </Button>
          <Button type="submit" className="bg-red-600 !mx-1">
            Delete
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteRecipeModal;
