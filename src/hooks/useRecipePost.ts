import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FormikHelpers } from 'formik';
import { toast } from 'react-hot-toast';
import { putImage } from '@/s3';

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

const useRecipeCreate = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const initialValues = {
    title: '',
    description: '',
    ingredients: [''],
    equipment: [''],
    duration: '',
    guide: '',
    image: new File([], ''),
  };

  // This handles form submit
  const onSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    try {
      await create(values);
      setSubmitting(false);
      toast.success('Recipe created!');
      router.push('/recipes');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      setSubmitting(false);
    }
  };

  // This functions posts the recipe data to the API
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

    // Upload the image to S3 and get the URL
    const imgUrl = await putImage(image);

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

  return { session, onSubmit, initialValues };
};

export default useRecipeCreate;
