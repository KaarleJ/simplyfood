import * as yup from 'yup';

// Here we define a validation schema for a ready recipe
export const recipeSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().nullable(),
  duration: yup.number().nullable(),
  guide: yup.string().required(),
  ingredients: yup.array().of(yup.string().required()).required(),
  equipment: yup.array().of(yup.string().required()).required(),
  imgUrl: yup.string().required(),
  authorId: yup.number().nullable(),
});

// Here we define a validation schema for a recipe that is being created
export const recipeCreateSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().nullable(),
  duration: yup.number().nullable(),
  guide: yup.string().required(),
  ingredients: yup.array().of(yup.string().required()).required(),
  equipment: yup.array().of(yup.string().required()).required(),
  image: yup.object().required(),
});