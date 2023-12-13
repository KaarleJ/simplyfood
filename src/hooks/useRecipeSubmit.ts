import { useSession } from 'next-auth/react';

interface Values {
  title: string;
  description: string;
  ingredients: string[];
  equipment: string[];
  duration: string;
  guide: string;
  image: File;
}

interface outputvalues {
  title: string;
  description: string;
  ingredients: string[];
  equipment: string[];
  duration: string;
  guide: string;
  imgUrl: string;
  authorId: number;
}

const useRecipeSubmit = () => {
  const { data: session } = useSession();

  const create = async ({
    title,
    description,
    ingredients,
    equipment,
    duration,
    guide,
    image,
  }: Values) => {
    const authorId = session?.user?.id as string;
    if (!authorId) {
      return { error: 'Not logged in' };
    }

    const imgUrl = '/placeholder'; // await uploadImage(image);

    const data = await fetch('/api/recipe', {
      method: 'POST',
      body: JSON.stringify({
        recipe: {
          title,
          description,
          ingredients,
          equipment,
          duration,
          guide,
          imgUrl,
          authorId,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data.json();
  };

  return { create };
};

export default useRecipeSubmit;
