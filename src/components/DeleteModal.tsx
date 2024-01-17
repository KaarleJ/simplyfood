import Text from './Text';
import { useState } from 'react';
import Button from './Button';

interface DeleteModalProps {
  remove: (email: string) => Promise<void>;
}

const DeleteModal = ({ remove }: DeleteModalProps) => {
  const [email, setEmail] = useState<string>('');

  const handleDelete = async (event: React.FormEvent) => {
    event.preventDefault();
    await remove(email);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30"></div>
      <div className="bg-white rounded-lg p-8 shadow-lg z-10 absolute">
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
          <Button type="submit" className="bg-red-600">
            Delete
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DeleteModal;
