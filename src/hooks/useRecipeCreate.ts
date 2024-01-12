import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FormikHelpers } from 'formik';
import { toast } from 'react-hot-toast';
import useRecipeSubmit from './useRecipeSubmit';

const useRecipeCreate = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { create } = useRecipeSubmit();

  const initialValues = {
    title: '',
    description: '',
    ingredients: [''],
    equipment: [''],
    duration: '',
    guide: '',
    image: new File([], ''),
  };

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

  return { session, onSubmit, initialValues };
};

export default useRecipeCreate;
