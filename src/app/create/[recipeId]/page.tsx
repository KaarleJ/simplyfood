'use client';

import Text from '../../../components/Text';
import Form from '../../../components/Form';
import useRecipePut from '../../../hooks/useRecipePut';
import Loader from '@/components/Loader';

const Edit = () => {
  const { error, loading, onSubmit, recipe } = useRecipePut();

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-col max-h-full">
        <Loader />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex items-center justify-center flex-col max-h-full">
        <Text>Something went wrong</Text>
        <Text>{error}</Text>
      </div>
    );
  }

  // We shape the data to match the shape of the form
  const initialValues = {
    title: recipe.title,
    description: recipe.description ? recipe.description : '',
    ingredients: recipe.ingredients,
    equipment: recipe.equipment,
    duration: String(recipe.duration) ? String(recipe.duration) : '',
    guide: recipe.guide,
    image: recipe.imgUrl,
  };

  return (
    <>
      <Text header className="flex items-center justify-center flex-col">
        Edit recipe
      </Text>
      <Form
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) => onSubmit(values, formikHelpers)}
        className="flex items-center justify-center flex-col max-h-full"
      />
    </>
  );
};

export default Edit;
