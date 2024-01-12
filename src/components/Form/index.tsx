import { PropsWithChildren } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import Thumb from '../Thumb';
import Loader from '../Loader';
import { recipeCreateSchema } from '@/validationSchemas';
import Field from './Field';
import Button from '../Button';
import ArrayField from './ArrayField';
import ImageField from './ImageField';

interface FormProps extends PropsWithChildren {
  className?: string;
  onSubmit: (
    values: any,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
  initialValues: {
    title: string;
    description: string;
    ingredients: string[];
    equipment: string[];
    duration: string;
    guide: string;
    image: File | string;
  };
}

const RecipeForm = ({ className, onSubmit, initialValues }: FormProps) => (
  <div className={className}>
    <Formik
      initialValues={initialValues}
      validationSchema={recipeCreateSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, setFieldValue, values, errors, touched }) => (
        <Form>
          <Thumb
            file={values.image}
            className="shadow-lg max-w-xs sm:max-w-md md:max-w-2xl"
          />

          <div className="flex flex-col">
            <ImageField
              id="image"
              name="image"
              onchange={(e) => {
                if (e.target.files) {
                  setFieldValue('image', e.target.files[0], true);
                }
              }}
            />

            <Field
              type="text"
              name="title"
              placeholder="Title here..."
              error={errors.title}
              touched={touched.title}
            />

            <Field
              type="textarea"
              name="description"
              placeholder="Description here..."
              error={errors.description}
              touched={touched.description}
            />

            <Field
              type="number"
              name="duration"
              placeholder="Duration here..."
              error={errors.duration}
              touched={touched.duration}
            />

            <ArrayField
              values={values.equipment}
              name="equipment"
              placeholder="Equipment..."
              className="mt-2"
            />

            <ArrayField
              values={values.ingredients}
              name="ingredients"
              placeholder="Ingredient..."
              className="mt-2"
            />

            <Field
              title="Instructions"
              type="textarea"
              name="guide"
              placeholder="Instructions here..."
              error={errors.guide}
              touched={touched.guide}
            />

            <div className="flex justify-center items-center">
              <div className="relative flex items-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-center m-5 px-5 py-3"
                >
                  Submit Recipe
                </Button>

                {isSubmitting && (
                  <Loader size="24" className="absolute left-full" />
                )}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  </div>
);

export default RecipeForm;
