import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import useRecipe from './useRecipe';
import { FormikHelpers } from 'formik';
import useRecipePut from './useRecipePut';

const useRecipeEdit = () => {
  const router = useRouter();
  const { recipe, error, loading } = useRecipe();
  const { put, session } = useRecipePut();

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

  return { session, recipe, error, loading, onSubmit };
};

export default useRecipeEdit;
