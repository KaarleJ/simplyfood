import Form from '../../components/Form';
import useRecipePost from '../../hooks/useRecipePost';
import Text from '../../components/Text';

const Create = () => {
  const { onSubmit, initialValues } = useRecipePost();

  return (
    <>
      <Text header className='flex items-center justify-center flex-col'>Create a recipe</Text>
      <Form
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) => onSubmit(values, formikHelpers)}
        className="flex items-center justify-center flex-col max-h-full"
      />
    </>
  );
};

export default Create;
