import { useSession } from 'next-auth/react';
import { Recipe } from '../types';

interface NewValues {
  title: string;
  description: string;
  ingredients: string[];
  equipment: string[];
  duration: string;
  guide: string;
  image: File | string;
}

const useRecipePut = () => {
  const { data: session } = useSession();

  const put = async (newValues: NewValues, oldValues: Recipe) => {
    let imgUrl: string;
    if (newValues.image instanceof File) {
      // Get the upload URL from the API
      const {
        url,
        error,
      }: { url: string | undefined; error: string | undefined } = await fetch(
        '/api/s3'
      ).then((res) => res.json());

      // Check if there is an error or if the URL is not found
      if (error) {
        throw new Error(error);
      } else if (!url) {
        throw new Error('Upload URL not found');
      }

      // Upload the image directly to S3
      const upload = await fetch(url, {
        method: 'PUT',
        body: newValues.image,
      });
      if (!upload.ok) {
        throw new Error('Upload failed');
      }

      // Parse the image URL from the uploadUrl
      imgUrl = url.split('?')[0];
    } else {
      imgUrl = oldValues.imgUrl;
    }

    const recipe = {
      title: newValues.title,
      description: newValues.description,
      ingredients: newValues.ingredients,
      equipment: newValues.equipment,
      duration: newValues.duration,
      guide: newValues.guide,
      imgUrl,
    };

    // Send the recipe data to the API
    const data = await fetch(`/api/recipe/${oldValues.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        recipe,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!data.ok) {
      throw new Error('Failed to update recipe');
    }

    return data.json();
  };

  return { put, session };
};

export default useRecipePut;
