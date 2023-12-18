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

interface outputValues {
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
  }: Values): Promise<outputValues> => {
    // We get the authorId from the session and authorize the user at the same time
    const authorId = session?.user?.id as string;
    if (!authorId) {
      throw new Error('Unauthorized');
    }

    // Get the upload URL from the API
    const {
      url,
      error,
    }: { url: string | undefined; error: string | undefined } = await fetch(
      '/api/s3'
    ).then((res) => res.json());
    if (error) {
      throw new Error(error);
    } else if (!url) {
      throw new Error('Upload URL not found');
    }

    // Upload the image directly to S3
    const upload = await fetch(url, {
      method: 'PUT',
      body: image,
    });
    console.log(upload);

    // Parse the image URL from the uploadUrl
    const imgUrl = url.split('?')[0];

    // Send the recipe data to the API
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
    if (!data.ok) {
      throw new Error('Failed to create recipe');
    }

    return data.json();
  };

  return { create };
};

export default useRecipeSubmit;
