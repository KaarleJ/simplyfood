import { PropsWithChildren, use } from 'react';
import { useSession } from 'next-auth/react';
import Text from '../Text';
import { Formik, Form as Formi, ErrorMessage } from 'formik';
import Field from './Field';
import ErrorText from './ErrorText';
import { FieldArray } from 'formik';
import { RemoveCircle } from '@styled-icons/material';
import Thumb from '../Thumb';
import useRecipeSubmit from '@/hooks/useRecipeSubmit';
import { useRouter } from 'next/router';
import Loader from '../Loader';
import { recipeCreateSchema } from '@/validationSchemas';
import { toast } from 'react-hot-toast';

interface FormProps extends PropsWithChildren {
  className?: string;
}

/*
 * This component represents the form for creating a recipe.
 * It uses Formik to handle form state and validation.
 * It uses the Field component to render each field.
 * It uses the ErrorText component to render error messages.
 * It uses the useSession hook to get the current session.
 * If there is no session, it urges the user to signin.
 * Otherwise, it renders the form.
 *
 * The from has a lot of boilerplate code.
 * We haven't implemented custom components that would reduce boilerplate code  due to to the way Formik handles custom components.
 * We might implement custom components in the future.
 */

const Form = ({ className }: FormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { create } = useRecipeSubmit();

  // If no session then urge the user to signin
  if (!session) {
    return (
      <div className={className}>
        <Text>You must be signed in to create a recipe</Text>
      </div>
    );
  }

  // Otherwise, render the form
  return (
    <div className={className}>
      <Text header>Create a recipe</Text>

      <Formik
        initialValues={{
          title: '',
          description: '',
          ingredients: [''],
          equipment: [''],
          duration: '',
          guide: '',
          image: new File([], ''), // This is a hack to get around the fact that Formik doesn't support file inputs
        }}
        validationSchema={recipeCreateSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await create(values);
            setSubmitting(false);
            toast.success('Recipe created!');
            router.push('/recipes');
          } catch (error) {
            if (error instanceof Error) toast.error(error.message);
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Formi>
            <Thumb
              file={values.image}
              className="shadow-lg max-w-xs sm:max-w-md md:max-w-2xl"
            />
            <div className="flex flex-col">
              <div className="flex flex-col items-center">
                <Text>Image</Text>
                <input
                  id="image"
                  type="file"
                  name="image"
                  className="border border-stone-400 rounded-md p-2 m-2 text-stone-500 text-md w-full max-w-lg"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFieldValue('image', e.target.files[0], true);
                    }
                  }}
                />
                <ErrorMessage name="image" component={ErrorText} />
              </div>

              <div className="flex flex-col items-center">
                <Text>Title</Text>
                <Field type="text" name="title" placeholder="Title here..." />
                <ErrorMessage name="title" component={ErrorText} />
              </div>

              <div className="flex flex-col items-center">
                <Text>Description</Text>
                <Field
                  type="textarea"
                  name="description"
                  placeholder="Description here..."
                />
                <ErrorMessage name="description" component={ErrorText} />
              </div>

              <div className="flex flex-col items-center">
                <Text>Duration</Text>
                <Field
                  type="number"
                  name="duration"
                  placeholder="Duration here..."
                />
                <ErrorMessage name="duration" component={ErrorText} />
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full max-w-lg">
                  <Text>Equipment</Text>
                  <FieldArray
                    name="equipment"
                    render={({ push, remove }) => (
                      <div>
                        {values.equipment.length > 0 &&
                          values.equipment.map((_equipment, index) => (
                            <div key={index} className="flex flex-row w-64">
                              <Field
                                name={`equipment.${index}`}
                                type="text"
                                placeholder="Equipment..."
                              />
                              <button
                                type="button"
                                onClick={() => remove(index)}
                              >
                                <RemoveCircle
                                  size="24"
                                  className="text-gray-400"
                                />
                              </button>
                            </div>
                          ))}
                        <button
                          type="button"
                          onClick={() => push('')}
                          className="px-2 py-1 my-2 ml-5 rounded-md bg-lime-300 font-bold text-white hover:brightness-90 transition-all"
                        >
                          add
                        </button>
                      </div>
                    )}
                  />
                </div>
                <ErrorMessage name="equipment" component={ErrorText} />
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full max-w-lg">
                  <Text>Ingredients</Text>
                  <FieldArray
                    name="ingredients"
                    render={({ push, remove }) => (
                      <div className="flex flex-col items-start">
                        {values.ingredients.length > 0 &&
                          values.ingredients.map((_ingredient, index) => (
                            <div key={index} className="flex flex-row w-64">
                              <Field
                                name={`ingredients.${index}`}
                                type="text"
                                placeholder="Ingredient..."
                              />
                              <button
                                type="button"
                                onClick={() => remove(index)}
                              >
                                <RemoveCircle
                                  size="24"
                                  className="text-gray-400"
                                />
                              </button>
                            </div>
                          ))}
                        <button
                          type="button"
                          onClick={() => push(' ')}
                          className="px-2 py-1 my-2 ml-5 rounded-md bg-lime-300 font-bold text-white hover:brightness-90 transition-all"
                        >
                          add
                        </button>
                      </div>
                    )}
                  />
                </div>
                <ErrorMessage name="ingredients" component={ErrorText} />
              </div>

              <div className="flex flex-col items-center">
                <Text>Instructions</Text>
                <Field
                  type="textarea"
                  name="guide"
                  placeholder="Instructions here..."
                  className="h-40"
                />
                <ErrorMessage name="guide" component={ErrorText} />
              </div>

              <div className="flex justify-center items-center">
                <div className="relative flex items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-2 py-1 m-4 rounded-md bg-lime-300 font-bold text-white hover:brightness-90 transition-all"
                  >
                    submit
                  </button>
                  {isSubmitting && (
                    <div className="absolute left-full">
                      <Loader size="24" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Formi>
        )}
      </Formik>
    </div>
  );
};

export default Form;
