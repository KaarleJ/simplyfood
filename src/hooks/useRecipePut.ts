import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import useRecipe from './useRecipe';
import { FormikHelpers } from 'formik';
import { useSession } from 'next-auth/react';
import { putImage } from '@/s3';
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

const useRecipeEdit = () => {
  const router = useRouter();
  const { recipe, error, loading } = useRecipe();
  const { data: session } = useSession();


  // This function is called when the form is submitted
  const onSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    try {
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      await put(values, recipe);
      setSubmitting(false);
      toast.success('Recipe edited!');
      router.push('/recipes');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      setSubmitting(false);
    }
  };

  // This function posts the edited recipe to the API
  const put = async (newValues: NewValues, oldValues: Recipe) => {
    let imgUrl: string;
    if (newValues.image instanceof File) {
      imgUrl = await putImage(newValues.image);
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

  return { session, recipe, error, loading, onSubmit };
};

export default useRecipeEdit;
