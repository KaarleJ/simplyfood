import { PropsWithChildren } from 'react';
import { useSession } from 'next-auth/react';
import Text from '../Text';
import { Formik, Form as Formi, ErrorMessage } from 'formik';
import Field from './Field';
import ErrorText from './ErrorText';
import { FieldArray } from 'formik';
import { RemoveCircle } from '@styled-icons/material';
import Thumb from '../Thumb';

interface FormProps extends PropsWithChildren {
  className?: string;
}

interface Values {
  title: string;
  description: string;
  ingredients: string[];
  equipment: string[];
  duration: string;
  guide: string;
  image: File | null;
}

interface Errors {
  title?: string;
  description?: string;
  ingredients?: string;
  equipment?: string;
  duration?: string;
  guide?: string;
  image?: string;
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
  const { data: session } = useSession();

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
          image: null,
        }}
        validate={(values) => {
          const errors: Errors = {};
          if (!values.title) {
            errors.title = 'Title is required';
          }
          if (!(values.ingredients.length > 0)) {
            errors.ingredients = 'At least one ingredient is required';
          }
          if (!(values.equipment.length > 0)) {
            errors.equipment = 'At least one equipment is required';
          }
          if (!values.guide) {
            errors.guide = 'Instructions are required';
          }
          if (!values.duration) {
            errors.duration = 'Duration is required';
          }

          return errors;
        }}
        onSubmit={async (values: Values, { setSubmitting }) => {
          console.log(values);
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 500);
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Formi>
            {values.image && (
              <Thumb
                file={values.image}
                className="shadow-lg max-w-xs sm:max-w-md md:max-w-2xl"
              />
            )}
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
                  type="text"
                  name="duration"
                  placeholder="Duration here..."
                />
                <ErrorMessage name="duration" component={ErrorText} />
              </div>

              <div className="flex flex-col items-center">
                <Text>Equipment</Text>
                <FieldArray
                  name="equipment"
                  render={({ push, remove }) => (
                    <div>
                      {values.equipment.length > 0 &&
                        values.equipment.map((_equipment, index) => (
                          <div key={index} className="flex flex-row">
                            <Field
                              name={`equipment.${index}`}
                              type="text"
                              placeholder="Equipment..."
                            />
                            <button type="button" onClick={() => remove(index)}>
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
                <ErrorMessage name="equipment" component={ErrorText} />
              </div>

              <div className="flex flex-col items-baseline">
                <Text>Ingredients</Text>
                <FieldArray
                  name="ingredients"
                  render={({ push, remove }) => (
                    <div className="flex flex-col items-start">
                      {values.ingredients.length > 0 &&
                        values.ingredients.map((_ingredient, index) => (
                          <div key={index} className="flex flex-row">
                            <Field
                              name={`ingredients.${index}`}
                              type="text"
                              placeholder="Ingredient..."
                            />
                            <button type="button" onClick={() => remove(index)}>
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-2 py-1 m-4 rounded-md bg-lime-300 font-bold text-white hover:brightness-90 transition-all"
                >
                  submit
                </button>
              </div>
            </div>
          </Formi>
        )}
      </Formik>
    </div>
  );
};

export default Form;