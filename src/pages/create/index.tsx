import Form from '../../components/Form';
import useRecipePost from '../../hooks/useRecipePost';
import Text from '../../components/Text';

const Create = () => {
  const { session, onSubmit, initialValues } = useRecipePost();

  if (!session) {
    return (
      <div className="flex items-center justify-center flex-col max-h-full">
        <Text>You must be signed in to create a recipe</Text>
      </div>
    );
  }

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
